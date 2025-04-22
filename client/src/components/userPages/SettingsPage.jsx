import { useState } from "react";
import { MdOutlineAccountCircle } from "react-icons/md";
import { FiHelpCircle } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import { HiArrowLeft } from "react-icons/hi";
import axiosInstance from '../../api/axios';
import Swal from 'sweetalert2';

const SettingsPage = () => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const [activeSection, setActiveSection] = useState('account');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        lastName: user?.last_name || '',
        oldEmail: user?.email || '',
        newEmail: '',
        oldPassword: '',
        newPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const logout = useUserStore((state) => state.logout);
    const setLoggedOut = useUserStore((state) => state.setLoggedOut);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (formData.newEmail && formData.newEmail === formData.oldEmail) {
            newErrors.newEmail = 'New email must be different from current email';
        }
        
        if (formData.newPassword && !formData.oldPassword) {
            newErrors.oldPassword = 'Current password is required to change password';
        }
        
        if (formData.newPassword && formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveChanges = async () => {
        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fix the errors before saving',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        setIsLoading(true);
        try {
            const updates = {};
            if (formData.name.trim() !== user.name.trim() || formData.lastName.trim() !== user.last_name.trim()) {
                updates.name = formData.name.trim();
                updates.last_name = formData.lastName.trim();
            }
            if (formData.newEmail && formData.newEmail.trim() !== user.email.trim()) {
                updates.oldEmail = formData.oldEmail;
                updates.newEmail = formData.newEmail.trim();
            }
            if (formData.newPassword) {
                updates.oldPassword = formData.oldPassword;
                updates.newPassword = formData.newPassword.trim();
            }

            if (Object.keys(updates).length > 0) {
                const response = await axiosInstance.patch('/users/update-profile/'+user.user_id, updates, { withCredentials: true });
                console.log(response)
                
                setUser(response.data.user);
                
                setFormData(prev => ({
                    ...prev,
                    oldPassword: '',
                    newPassword: '',
                    newEmail: '',
                    oldEmail: response.data.user.email
                }));

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Profile updated successfully',
                    confirmButtonColor: '#3085d6',
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'No Changes',
                    text: 'No changes were made to save',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error('Error during save changes:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update profile',
                confirmButtonColor: '#3085d6',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await axiosInstance.post('auth/logout', {}, {
                withCredentials: true
            });
            setLoggedOut(true);
            logout();
            navigate('/auth/login');
        } catch (error) {
            console.error('Error during logout:', error);
            setLoggedOut(true);
            logout();
            navigate('/auth/login');
        }
    };

    const settingsSections = [
        {
            id: 'account',
            label: 'Account Settings',
            icon: <MdOutlineAccountCircle className="text-2xl" />,
            description: 'Manage your account details and preferences'
        },
        {
            id: 'help',
            label: 'Help & Support',
            icon: <FiHelpCircle className="text-2xl" />,
            description: 'Get help and find answers to common questions'
        }
    ];


    return (
        <main className="w-full min-h-screen bg-[#f8fbfb]">
            <div className="max-w-7xl mx-auto p-6">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                             bg-white text-gray-700 hover:bg-gray-50 
                             flex items-center gap-2 transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm">
                            {settingsSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                                        activeSection === section.id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'hover:bg-gray-50 text-gray-700'
                                    } ${
                                        section.id !== settingsSections[settingsSections.length - 1].id
                                        ? 'border-b'
                                        : ''
                                    }`}
                                >
                                    {section.icon}
                                    <span className="font-medium">{section.label}</span>
                                </button>
                            ))}
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-red-50 text-red-600 border-t"
                            >
                                <FiLogOut className="text-2xl" />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {activeSection === 'account' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-medium text-gray-900 mb-1">Account Settings</h2>
                                        <p className="text-gray-600 text-sm">Manage your account details and preferences</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input 
                                                    type="text" 
                                                    name="name"
                                                    value={formData.name}
                                                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        errors.name ? 'border-red-500' : ''
                                                    }`}
                                                    placeholder="Your name"
                                                    onChange={handleInputChange}
                                                />
                                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                                                <input 
                                                    type="text" 
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        errors.lastName ? 'border-red-500' : ''
                                                    }`}
                                                    placeholder="Your surname"
                                                    onChange={handleInputChange}
                                                />
                                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Email</label>
                                                <input 
                                                    type="email" 
                                                    name="oldEmail"
                                                    value={formData.oldEmail}
                                                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        errors.oldEmail ? 'border-red-500' : ''
                                                    }`}
                                                    placeholder="current@email.com"
                                                    onChange={handleInputChange}
                                                />
                                                {errors.oldEmail && <p className="text-red-500 text-sm mt-1">{errors.oldEmail}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
                                                <input 
                                                    type="email" 
                                                    name="newEmail"
                                                    value={formData.newEmail}
                                                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        errors.newEmail ? 'border-red-500' : ''
                                                    }`}
                                                    placeholder="new@email.com"
                                                    onChange={handleInputChange}
                                                />
                                                {errors.newEmail && <p className="text-red-500 text-sm mt-1">{errors.newEmail}</p>}
                                            </div>
                                        </div>
                                        <div className="border-t pt-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Change Password</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                                    <input 
                                                        type="password" 
                                                        name="oldPassword"
                                                        value={formData.oldPassword}
                                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                            errors.oldPassword ? 'border-red-500' : ''
                                                        }`}
                                                        placeholder="••••••••"
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                    <input 
                                                        type="password" 
                                                        name="newPassword"
                                                        value={formData.newPassword}
                                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                            errors.newPassword ? 'border-red-500' : ''
                                                        }`}
                                                        placeholder="••••••••"
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t pt-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Session Management</h3>
                                            <button 
                                                onClick={handleSignOut}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                                            >
                                                <FiLogOut />
                                                Sign Out
                                            </button>
                                            <p className="text-sm text-gray-500 mt-2">This will log you out from your current session</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            onClick={handleSaveChanges}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {activeSection === 'help' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-medium text-gray-900 mb-1">Help & Support</h2>
                                        <p className="text-gray-600 text-sm">Find help and contact support</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                                                <h3 className="font-medium text-gray-900 mb-1">FAQs</h3>
                                                <p className="text-sm text-gray-500">Browse frequently asked questions</p>
                                            </button>
                                            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                                                <h3 className="font-medium text-gray-900 mb-1">Contact Support</h3>
                                                <p className="text-sm text-gray-500">Get help from our support team</p>
                                            </button>
                                            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                                                <h3 className="font-medium text-gray-900 mb-1">Documentation</h3>
                                                <p className="text-sm text-gray-500">Read our guides and documentation</p>
                                            </button>
                                            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                                                <h3 className="font-medium text-gray-900 mb-1">Report an Issue</h3>
                                                <p className="text-sm text-gray-500">Report bugs or technical issues</p>
                                            </button>
                                        </div>

                                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                            <h3 className="font-medium text-blue-900 mb-2">Need Immediate Help?</h3>
                                            <p className="text-sm text-blue-700 mb-4">Our support team is available 24/7 to assist you.</p>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                                Contact Support
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SettingsPage;