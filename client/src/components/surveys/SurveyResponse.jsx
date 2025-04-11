import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import axiosInstance from '../../api/axios';

const SurveyResponse = () => {
    const { surveyId, userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [surveyData, setSurveyData] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const surveyResponse = await axiosInstance.get(`/survey/${surveyId}`);
                setSurveyData(surveyResponse.data);

                const answersResponse = await axiosInstance.get(`/answer/${surveyId}/${userId}`);
                setUserAnswers(answersResponse.data);

                const userResponse = await axiosInstance.get(`/user/${userId}`);
                setUserInfo(userResponse.data);

                setError(null);
            } catch (err) {
                setError('Failed to load survey data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [surveyId, userId]);

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading survey responses...</p>
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

    if (!surveyData || !userInfo) {
        return (
            <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Data not found</p>
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
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
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
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                                {userInfo.name.charAt(0)}{userInfo.last_name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-600">
                                {userInfo.name} {userInfo.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                                Submitted on {new Date(userAnswers[0]?.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {userAnswers.map((answer, index) => (
                    <div key={answer.answer_Id} className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex flex-col space-y-3">
                            <h3 className="text-lg font-medium text-gray-800">
                                Question {index + 1}
                            </h3>
                            <p className="text-gray-600">
                                {answer.question?.title || 'Question not available'}
                            </p>
                            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {answer.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {userAnswers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">No answers found for this user</p>
                </div>
            )}
        </div>
    );
};

export default SurveyResponse; 