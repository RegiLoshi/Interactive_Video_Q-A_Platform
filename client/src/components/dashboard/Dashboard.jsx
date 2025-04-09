import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiEye, HiTrash, HiPlus, HiPencil } from 'react-icons/hi';
import useUserStore from '../../stores/userStore';

const Dashboard = () => {
    const surveys = useUserStore((state) => state.surveys);
    const setSurvey = useUserStore((state) => state.setSurvey)
    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);

    useEffect(() => {
        const fetchSurveys = async () => {
            if (!token) return;
            
            try {
                const response = await fetch('http://localhost:3000/survey', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include', 
                  });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                const filteredSurveys = user?.role === 'ASKER' 
                    ? data.filter(survey => survey.authorId === user.user_id) 
                    : data;

                setSurvey(filteredSurveys);
            } catch (error) {
                console.error('Error fetching surveys:', error);
            }
        };

        fetchSurveys();
    }, [user, token]);

    const handleDelete = (surveyId) => {
        if (user?.role !== 'ASKER') return;
        console.log('Deleting survey:', surveyId);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name}</p>
                </div>
                {user?.role === 'ASKER' && (
                    <Link 
                        to="/dashboard/create-survey"
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                        <HiPlus className="text-xl" />
                        Create New Survey
                    </Link>
                )}
            </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p className="text-gray-600 text-sm mb-2">Total Surveys</p>
                        <p className="text-2xl font-semibold">{surveys.length}</p>
                    </div>
                </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {user?.role === 'ASKER' ? 'Your Surveys' : 'Available Surveys'}
                    </h2>
                    <div className="space-y-4">
                        {surveys.map((survey) => (
                            <div key={survey.survey_id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{survey.title}</h3>
                                        <p className="text-sm text-gray-500">Created on {survey.created_at.slice(0,10)} • {survey.responses > 0 ? survey.responses : 0} responses</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link 
                                            to={user?.role === 'ASKER' ? `/dashboard/surveys/${survey.survey_id}` : `/dashboard/surveys/${survey.survey_id}/answer`}
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;