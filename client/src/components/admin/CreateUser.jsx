import { useState } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import Swal from 'sweetalert2';
import useUserStore from '../../stores/userStore';

const CreateUser = () => {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        role: 'RESPONDER'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Admin check
    if (user?.role !== 'ADMIN') {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600">You do not have permission to access this page.</p>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Invalid email format';
            }
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await axiosInstance.post('/admin/users', formData);
            
            Swal.fire({
                title: 'Success!',
                text: 'User has been created successfully',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                navigate('/admin/dashboard');
            });
            
        } catch (error) {
            console.error('Error creating user:', error);
            
            const errorMessage = error.response?.data?.message || 'Failed to create user';
            
            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#3085d6'
            });
            
            if (error.response?.data?.field) {
                setErrors({
                    [error.response.data.field]: errorMessage
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#f8fbfb]">
            <div className="max-w-3xl mx-auto p-6">
                <button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                            bg-white text-gray-700 hover:bg-gray-50 
                            flex items-center gap-2 transition-colors duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    Back to Admin Dashboard
                </button>

                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create New User</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Password must be at least 6 characters long
                            </p>
                        </div>
                        
                        <div className="mb-8">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                User Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="ASKER">Asker</option>
                                <option value="RESPONDER">Responder</option>
                            </select>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Creating User...
                                </>
                            ) : (
                                'Create User'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUser; 