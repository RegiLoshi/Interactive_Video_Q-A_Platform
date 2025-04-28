import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiUsers, HiDocumentText, HiPlus, HiTrash, HiPencil, HiUserAdd, HiSearch } from 'react-icons/hi';
import useUserStore from '../../stores/userStore';
import axiosInstance from '../../api/axios';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const surveys = useUserStore((state) => state.surveys);
    const setSurvey = useUserStore((state) => state.setSurvey);
    
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isLoadingSurveys, setIsLoadingSurveys] = useState(true);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [surveySearchTerm, setSurveySearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSurveys: 0,
        totalResponders: 0,
        totalAskers: 0
    });

    useEffect(() => {
        if (!token || user?.role !== 'ADMIN') return;
        
        const fetchData = async () => {
            try {
                setIsLoadingUsers(true);
                setIsLoadingSurveys(true);
                
                const usersResponse = await axiosInstance.get('/users');
                setUsers(usersResponse.data || []);
                
                const responders = usersResponse.data.filter(u => u.role === 'RESPONDER').length;
                const askers = usersResponse.data.filter(u => u.role === 'ASKER').length;
                
                const surveysResponse = await axiosInstance.get('/surveys');
                setSurvey(surveysResponse.data || []);
                
                setStats({
                    totalUsers: usersResponse.data.length,
                    totalSurveys: surveysResponse.data.length,
                    totalResponders: responders,
                    totalAskers: askers
                });
            } catch (error) {
                console.error('Error fetching admin data:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to load administrative data. Please try again.',
                    icon: 'error',
                });
            } finally {
                setIsLoadingUsers(false);
                setIsLoadingSurveys(false);
            }
        };

        fetchData();
    }, [token, user, setSurvey]);

    const handleDeleteUser = async (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete this user and all their data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete user!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/users/${userId}`);
                    
                    const response = await axiosInstance.get('/users');
                    setUsers(response.data || []);
                    
                    Swal.fire(
                        'Deleted!',
                        'User has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting user:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to delete user.',
                        icon: 'error',
                    });
                }
            }
        });
    };

    const handleDeleteSurvey = async (surveyId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete('/surveys', { data: { surveyId } });
                    
                    const response = await axiosInstance.get('/surveys');
                    setSurvey(response.data || []);
                    
                    Swal.fire(
                        'Deleted!',
                        'Survey has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting survey:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to delete survey.',
                        icon: 'error',
                    });
                }
            }
        });
    };

    const handleChangeUserRole = async (userId, newRole) => {
        try {
            await axiosInstance.patch(`/users/${userId}/role`, { role: newRole });
            
            const response = await axiosInstance.get('/users');
            setUsers(response.data || []);
            
            Swal.fire({
                title: 'Success',
                text: `User role updated to ${newRole}`,
                icon: 'success',
            });
        } catch (error) {
            console.error('Error updating user role:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update user role.',
                icon: 'error',
            });
        }
    };

    const filteredUsers = users.filter(user => {
        const searchTerm = userSearchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.last_name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm)
        );
    });

    const filteredSurveys = surveys?.filter(survey => {
        const searchTerm = surveySearchTerm.toLowerCase();
        const authorName = users.find(u => u.user_id === survey.authorId)?.name || '';
        return (
            survey.title.toLowerCase().includes(searchTerm) ||
            authorName.toLowerCase().includes(searchTerm)
        );
    });

    if (user?.role !== 'ADMIN') {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600">You do not have permission to access the admin dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600 text-md">Welcome back, {user?.name} {user?.last_name}</p>
                </div>
                <Link 
                    to="/admin/create-user"
                    className="sm:px-5 bg-blue-600 text-white md:px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                >
                    <HiUserAdd className="text-xl" />
                    Create New User
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-2">Total Users</p>
                    <p className="text-2xl font-semibold">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-2">Total Surveys</p>
                    <p className="text-2xl font-semibold">{stats.totalSurveys}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-2">Responders</p>
                    <p className="text-2xl font-semibold">{stats.totalResponders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-2">Askers</p>
                    <p className="text-2xl font-semibold">{stats.totalAskers}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                            <HiUsers className="mr-2 text-blue-600" />
                            User Management
                        </h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>
                    
                    {isLoadingUsers ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.user_id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.name} {user.last_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                                                    user.role === 'ASKER' ? 'bg-green-100 text-green-800' : 
                                                    'bg-blue-100 text-blue-800'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <select 
                                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                                                        value={user.role}
                                                        onChange={(e) => handleChangeUserRole(user.user_id, e.target.value)}
                                                    >
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="ASKER">Asker</option>
                                                        <option value="RESPONDER">Responder</option>
                                                    </select>
                                                    
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.user_id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={user.user_id === useUserStore.getState().user?.user_id}
                                                    >
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    {userSearchTerm ? 'No users found matching your search' : 'No users found'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                            <HiDocumentText className="mr-2 text-blue-600" />
                            Survey Management
                        </h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search surveys..."
                                value={surveySearchTerm}
                                onChange={(e) => setSurveySearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>
                    
                    {isLoadingSurveys ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredSurveys?.map((survey) => (
                                <div key={survey.survey_id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{survey.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                Created on {survey.created_at?.slice(0,10)} • 
                                                {(survey.questions?.[0]?.answers?.length || 0)} responses
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Author: {users.find(u => u.user_id === survey.authorId)?.name || 'Unknown'}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Link 
                                                to={`/dashboard/surveys/${survey.survey_id}`}
                                                className="blue-button px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <HiPencil className="h-5 w-5" />
                                                View
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteSurvey(survey.survey_id)}
                                                className="red-button px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <HiTrash className="h-5 w-5" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!filteredSurveys || filteredSurveys.length === 0) && (
                                <div className="text-center py-8 text-gray-500">
                                    {surveySearchTerm ? 'No surveys found matching your search' : 'No surveys found'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 