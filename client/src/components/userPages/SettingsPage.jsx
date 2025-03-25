import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlinePrivacyTip, MdOutlineAccountCircle } from "react-icons/md";
import { FiHelpCircle } from "react-icons/fi";

const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState('account');
    const [notifications, setNotifications] = useState({
        emailNotifs: true,
        questionResponses: true
    });

    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const settingsSections = [
        {
            id: 'account',
            label: 'Account Settings',
            icon: <MdOutlineAccountCircle className="text-2xl" />,
            description: 'Manage your account details and preferences'
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: <CiUser className="text-2xl" />,
            description: 'Update your profile information'
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: <IoNotificationsOutline className="text-2xl" />,
            description: 'Configure your notification preferences'
        },
        {
            id: 'privacy',
            label: 'Privacy',
            icon: <MdOutlinePrivacyTip className="text-2xl" />,
            description: 'Control your privacy settings'
        },
        {
            id: 'help',
            label: 'Help & Support',
            icon: <FiHelpCircle className="text-2xl" />,
            description: 'Get help and find answers to common questions'
        }
    ];

    const renderToggleButton = (enabled, onClick) => (
        <button
            onClick={onClick}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    return (
        <main className="w-full min-h-screen bg-[#f8fbfb]">
            <div className="max-w-7xl mx-auto p-6">
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="username"
                                                />
                                            </div>
                                        </div>
                                        <div className="border-t pt-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Password</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                                    <input 
                                                        type="password" 
                                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                    <input 
                                                        type="password" 
                                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'profile' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-medium text-gray-900 mb-1">Profile Settings</h2>
                                        <p className="text-gray-600 text-sm">Update your profile information</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                            <textarea 
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="4"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'notifications' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-medium text-gray-900 mb-1">Notification Preferences</h2>
                                        <p className="text-gray-600 text-sm">Choose what you want to be notified about</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                                <p className="text-sm text-gray-500">Receive notifications via email</p>
                                            </div>
                                            {renderToggleButton(notifications.emailNotifs, () => handleNotificationToggle('emailNotifs'))}
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-t">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Question Responses</h3>
                                                <p className="text-sm text-gray-500">When someone answers your question</p>
                                            </div>
                                            {renderToggleButton(notifications.questionResponses, () => handleNotificationToggle('questionResponses'))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'privacy' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-medium text-gray-900 mb-1">Privacy Settings</h2>
                                        <p className="text-gray-600 text-sm">Control your privacy and security preferences</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Show Email Address</h3>
                                                <p className="text-sm text-gray-500">Display your email on your profile</p>
                                            </div>
                                            {renderToggleButton(false, () => {})}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                            Save Changes
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