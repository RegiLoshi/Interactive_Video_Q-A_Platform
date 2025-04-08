import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiEye, HiTrash, HiPlus } from 'react-icons/hi';

const Dashboard = () => {
    const [dashboardStats] = useState({
        totalSurveys: 24,
        totalResponses: 1234,
    });

    const [surveys] = useState([
        {
            id: 1,
            title: 'Customer Satisfaction Q1 2025',
            created_at: 'Jan 16, 2025',
            responses: 234
        },
        {
            id: 2,
            title: 'Employee Engagement Survey',
            created_at: 'Jan 14, 2025',
            responses: 89
        },
        {
            id: 3,
            title: 'Product Feedback Form',
            created_at: 'Jan 8, 2025',
            responses: 167
        }
    ]);

    const handleDelete = (surveyId) => {
        console.log('Deleting survey:', surveyId);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, Alex</p>
                </div>
                <Link 
                    to="/dashboard/create-survey"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                >
                    <HiPlus className="text-xl" />
                    Create New Survey
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-2">Total Surveys</p>
                    <p className="text-2xl font-semibold">{dashboardStats.totalSurveys}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-2">Total Responses</p>
                    <p className="text-2xl font-semibold">{dashboardStats.totalResponses}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Surveys</h2>
                    <div className="space-y-4">
                        {surveys.map((survey) => (
                            <div key={survey.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{survey.title}</h3>
                                        <p className="text-sm text-gray-500">Created on {survey.created_at} • {survey.responses} responses</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link 
                                            to={`/dashboard/surveys/${survey.id}`}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <HiEye className="h-5 w-5" />
                                            View
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(survey.id)}
                                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <HiTrash className="h-5 w-5" />
                                            Delete
                                        </button>
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