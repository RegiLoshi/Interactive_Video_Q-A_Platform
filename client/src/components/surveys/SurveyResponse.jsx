import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import axiosInstance from '../../api/axios';
import useUserStore from '../../stores/userStore'; 

// Utility function to convert Google Drive URL to embeddable URL
const convertGoogleDriveUrl = (url) => {
    if (!url) return null;
    const fileId = url.match(/\/d\/(.+?)\//)?.[1];
    if (!fileId) return null;
    return `https://drive.google.com/file/d/${fileId}/preview?embedded=true`;
};

const SurveyResponse = () => {
    const { surveyId, userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const surveys = useUserStore((state) => state.surveys);
    const [survey, setSurvey] = useState(surveys.find((survey) => survey.survey_id == surveyId));
    const [responder, setResponder] = useState();
    const [videoUrl, setVideoUrl] = useState();
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const questions = survey.questions;
    const questionsAndAnswers = questions.map((question) => {
        const userAnswer = question.answers.find(answer => answer.authorId === userId);
        return {
            question: question,
            answer: userAnswer
        };
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if(!survey){
                    setSurvey(await axiosInstance.get(`/survey/${surveyId}`));
                    if(!survey){
                        setError("Survey Not Found!");
                    }
                }

                const responder = (await axiosInstance.get(`/users/${userId}`)).data;
                setResponder(responder);
                const videoUrl = await axiosInstance.get(`/survey/${surveyId}/responses/${responder.user_id}`);
                setVideoUrl(videoUrl.data);
                console.log(videoUrl.data);
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

    if (!survey) {
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
                    <h1 className="text-2xl font-semibold text-gray-800">{survey.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                                {responder.name.charAt(0)}{responder.last_name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-600">
                                {responder.name} {responder.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                                Submitted on {(() => {
                                    const firstAnswer = questionsAndAnswers.find(qa => qa.answer)?.answer;
                                    return firstAnswer ? new Date(firstAnswer.created_at).toLocaleDateString() : 'Not submitted yet';
                                })()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {questionsAndAnswers.map((qa, index) => (
                    <div key={qa.question.question_id} className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex flex-col space-y-3">
                            <h3 className="text-lg font-medium text-gray-800">
                                Question {index + 1}
                            </h3>
                            <p className="text-gray-600">
                                {qa.question.title || 'Question not available'}
                            </p>
                            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {qa.answer ? qa.answer.text : 'No answer provided'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {videoUrl && (
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        {isVideoLoading && (
                            <div className="flex items-center justify-center h-[480px] bg-gray-100 rounded-lg">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading video...</p>
                                </div>
                            </div>
                        )}
                        <iframe
                            src={convertGoogleDriveUrl(videoUrl)}
                            width="100%"
                            height="480"
                            allow="autoplay"
                            className="rounded-lg"
                            frameBorder="0"
                            allowFullScreen
                            onLoad={() => setIsVideoLoading(false)}
                            style={{ display: isVideoLoading ? 'none' : 'block' }}
                        />
                    </div>
                )}
            </div>

            {questionsAndAnswers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">No answers found for this user</p>
                </div>
            )}
        </div>
    );
};

export default SurveyResponse; 