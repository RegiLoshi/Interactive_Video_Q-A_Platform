import React, { useState, useEffect } from 'react';
import { useParams } from "react-router"
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import video from '../../../assets/videoDummy1.mp4'

const SurveyResponse = () => {
    const { surveyId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [surveyData, setSurveyData] = useState(null);
    const [respondents, setRespondents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch survey data
                const surveyResponse = await axiosInstance.get(`/survey/${surveyId}`);
                setSurveyData(surveyResponse.data);

                // Fetch respondents
                const respondentsResponse = await axiosInstance.get(`/answer/${surveyId}`);
                setRespondents(respondentsResponse.data);
            } catch (err) {
                setError('Failed to load survey data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [surveyId]);

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading survey data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!surveyData) {
        return (
            <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Survey not found</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex flex-col space-y-8">
            <div className="flex items-center mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                            bg-white text-gray-700 hover:bg-gray-50 
                            flex items-center gap-2 transition-colors duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="ml-6">
                    <h1 className="text-2xl font-semibold text-gray-800">{surveyData.title}</h1>
                    <p className="text-gray-600">Total Respondents: {respondents.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th scope="col" className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Respondent</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Submission Date</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {respondents.map((respondent, index) => (
                                <tr 
                                    key={respondent.author.user_id} 
                                    className={`
                                        transition-colors duration-200
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                        hover:bg-blue-50
                                    `}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">
                                                    {respondent.author.name.charAt(0)}{respondent.author.last_name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {respondent.author.name} {respondent.author.last_name}
                                                </div>
                                                <div className="text-sm text-gray-500">{respondent.author.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(respondent.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => navigate(`/dashboard/surveys/${surveyId}/${respondent.author.user_id}`)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 
                                                     rounded-lg hover:bg-blue-100 transition-colors duration-200
                                                     font-medium text-sm focus:outline-none focus:ring-2 
                                                     focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            View Responses
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {respondents.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">No respondents found</p>
                    </div>
                )}
            </div>

            {surveyData.surveyVideos && surveyData.surveyVideos.length > 0 && (
                <div className='w-full flex flex-col space-y-4 items-start'>
                    <h2 className='font-bold text-xl'>Video</h2>
                    <video controls className="w-full shadow-md">
                        <source src={video} type="video/mp4" />
                    </video>
                </div>
            )}
        </div>
    );
}

export default SurveyResponse;