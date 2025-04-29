import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiEye, HiTrash, HiPlus, HiPencil } from 'react-icons/hi';
import useUserStore from '../../stores/userStore';
import axiosInstance from '../../api/axios';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const surveys = useUserStore((state) => state.surveys);
    const setSurvey = useUserStore((state) => state.setSurvey)
    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const [isLoading, setIsLoading] = useState(true);
    const [surveyPage, setSurveyPage] = useState(1);
    const [surveyOffset, setSurveyOffset] = useState(0);
    const [surveyLimit, setSurveyLimit] = useState(5);
    const [totalSurveys, setTotalSurveys] = useState(0);

    useEffect(() => {
        const fetchSurveys = async () => {
            if (!token) return;
            
            try {
                setIsLoading(true);
                const endpoint = user?.role === 'ASKER' 
                    ? `/surveys/pagination/${surveyLimit}/${surveyOffset}/${user.user_id}`
                    : `/surveys/pagination/${surveyLimit}/${surveyOffset}`;
                
                const { data } = await axiosInstance.get(endpoint);
                setSurvey(data.surveys || []);
                setTotalSurveys(data.total || 0);
            } catch (error) {
                console.error('Error fetching surveys:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to load surveys. Please try again.',
                    icon: 'error',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSurveys();
    }, [user, token, setSurvey, surveyLimit, surveyOffset]);

    const handlePageChange = (newPage) => {
        setSurveyPage(newPage);
        setSurveyOffset((newPage - 1) * surveyLimit);
    };

    const handleLimitChange = (newLimit) => {
        setSurveyLimit(newLimit);
        setSurveyPage(1);
        setSurveyOffset(0);
    };

    const handleDelete = async (surveyId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete('/surveys', { data: { surveyId, userId: user.user_id } });
                    
                    const endpoint = user?.role === 'ASKER' 
                        ? `/surveys/pagination/${surveyLimit}/${surveyOffset}/${user.user_id}`
                        : `/surveys/pagination/${surveyLimit}/${surveyOffset}`;
                    
                    const { data } = await axiosInstance.get(endpoint);
                    setSurvey(data.surveys || []);
                    setTotalSurveys(data.total || 0);
                } catch (error) {
                    console.error('Error deleting survey:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Error deleting survey',
                        icon: 'error',
                    });
                }
            }
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 text-md">Welcome back, {user?.name + " " + user?.last_name}</p>
                </div>
                {user?.role === 'ASKER' && (
                    <Link 
                        to="/dashboard/create-survey"
                        className="sm:px-5 bg-blue-600 text-white md:px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                        <HiPlus className="text-xl" />
                        Create New Survey
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-2">Total Surveys</p>
                    <p className="text-2xl font-semibold">{totalSurveys}</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {user?.role === 'ASKER' ? 'Your Surveys' : 'Available Surveys'}
                        </h2>
                        <div className="space-y-4">
                            {surveys?.map((survey) => (
                                <div key={survey.survey_id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{survey.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                Created on {survey.created_at?.slice(0,10)} • 
                                                {(survey.questions?.[0]?.answers?.length || 0)} responses
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Link 
                                                to={user?.role === 'ASKER' ? 
                                                    `/dashboard/surveys/${survey.survey_id}` : 
                                                    `/dashboard/surveys/${survey.survey_id}/answer`}
                                                className="blue-button px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200 flex items-center gap-2"
                                            >
                                                {user?.role === 'ASKER' ? 
                                                    (<>
                                                        <HiEye className="h-5 w-5" />
                                                        View
                                                    </>) : (
                                                        <>
                                                            <HiPencil className="h-5 w-5" />
                                                            Answer
                                                        </>
                                                    )}
                                            </Link>
                                            {user?.role === 'ASKER' && (
                                                <button 
                                                    onClick={() => handleDelete(survey.survey_id)}
                                                    className="red-button px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center gap-2"
                                                >
                                                    <HiTrash className="h-5 w-5" />
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Show:</span>
                                    <select 
                                        value={surveyLimit}
                                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span className="text-sm text-gray-600">per page</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(surveyPage - 1)}
                                        disabled={surveyPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Page {surveyPage} of {Math.ceil(totalSurveys / surveyLimit)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(surveyPage + 1)}
                                        disabled={surveyPage >= Math.ceil(totalSurveys / surveyLimit)}
                                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;