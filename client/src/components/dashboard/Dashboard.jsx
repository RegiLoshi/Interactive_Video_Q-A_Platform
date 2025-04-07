import { useState } from 'react';
import { Link } from 'react-router-dom';

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
                    <span className="text-xl leading-none mb-0.5">+</span>
                    Create New Survey
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 j">
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
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                            View
                                        </Link>
                                        <Link 
                                            to={`/dashboard/surveys/${survey.id}/edit`}
                                            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Edit
                                        </Link>
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