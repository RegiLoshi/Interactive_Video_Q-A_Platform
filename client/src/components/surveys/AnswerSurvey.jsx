import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiCheckCircle } from 'react-icons/hi';
import useUserStore from '../../stores/userStore';
import WebcamStreamCapture from '../WebCam';
import axiosInstance from '../../api/axios.js'

const AnswerSurvey = () => {
    const { surveyId } = useParams();
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const surveys = useUserStore((state) => state.surveys);
    //const survey = surveys.find((s) => s.survey_id === surveyId);
    const [survey, setSurvey] = useState(null);
    
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [videoRecording, setVideoRecording] = useState(false);
    const [videoStep, setVideoStep] = useState(0);
    const [video, setVideo] = useState(null);
    const [alreadyAnswered, setAlreadyAnswered] = useState(false);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                if (!token) {
                    navigate('/dashboard');
                    return;
                }

                const response = await axiosInstance.get(`/survey/${surveyId}`);
                
                if (!response.data) {
                    throw new Error('No survey data received');
                }

                setSurvey(response.data);

                if (response.data.questions && user) {
                    const hasAnswered = response.data.questions.some(question => 
                        question.answers?.some(answer => answer.authorId === user.user_id)
                    );
                    setAlreadyAnswered(hasAnswered);
                }
                
                const savedProgress = localStorage.getItem(`survey_progress_${surveyId}_${user.user_id}`);
                if (savedProgress) {
                    try {
                        const { answers: savedAnswers, currentIndex } = JSON.parse(savedProgress);
                        setAnswers(savedAnswers);
                        setCurrentQuestionIndex(currentIndex);
                    } catch (error) {
                        console.error('Error loading saved progress:', error);
                    }
                } else if (response.data?.questions) {
                    const initialAnswers = {};
                    response.data.questions.forEach(question => {
                        initialAnswers[question.question_id] = '';
                    });
                    setAnswers(initialAnswers);
                }
            } catch (error) {
                console.error('Error fetching survey:', error);
                navigate('/dashboard');
            }
        };

        fetchSurvey();
    }, [surveyId, user, token, navigate]);

    useEffect(() => {
        if (survey && user && !submitted) {
            const progressData = {
                answers,
                currentIndex: currentQuestionIndex
            };
            localStorage.setItem(
                `survey_progress_${surveyId}_${user.user_id}`, 
                JSON.stringify(progressData)
            );
        }
    }, [answers, currentQuestionIndex, survey, user, surveyId, submitted]);

    if (!survey) return null;

    const questions = survey.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setVideoRecording(true);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (videoRecording) {
            setVideoRecording(false);
        } else {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            console.log(answers)      

            const formattedAnswers = Object.entries(answers).map(([questionId, text]) => ({
                questionId,
                text,
                surveyId: survey.survey_id,
                authorId: user.user_id,
            }));

            if (video) {
                formattedAnswers.append('video', video);
            }

            const response = await axiosInstance.post('/answer',formattedAnswers);

            if (response.status != 201) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            localStorage.removeItem(`survey_progress_${surveyId}_${user.user_id}`);
            
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting survey answers:', error);
            alert('Failed to submit answers. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 px-4">
                <div className="bg-white p-10 rounded-lg shadow-md max-w-2xl w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100">
                        <HiCheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Your responses to "{survey.title}" have been submitted successfully.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-[#101726] text-white rounded-lg hover:bg-[#1c2a43] transition-colors duration-200 font-medium"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (videoRecording) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <button
                            onClick={handlePrev}
                            className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-4 sm:mb-0"
                        >
                            <HiArrowLeft className="mr-2 h-5 w-5" />
                            Back to Questions
                        </button>
                        <div className="text-right">
                            <h1 className="text-xl font-bold text-gray-900 mt-1">Optional Video Response</h1>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-8 mb-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Record or Upload a Video (Optional)</h3>
                            <p className="text-gray-600 mb-4">
                                You can record a video response or skip this step. This helps provide more context to your answers.
                            </p>
                        </div>

                        <WebcamStreamCapture 
                            step={videoStep} 
                            setStep={setVideoStep} 
                            onVideoCapture={(videoBlob) => setVideo(videoBlob)}
                        />

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={handlePrev}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
                            >
                                <HiArrowLeft className="mr-2 h-5 w-5" />
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-[#101726] text-white rounded-lg hover:bg-[#1c2a43] transition-colors duration-200 flex items-center font-medium"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (alreadyAnswered) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">You have already answered this survey.</h1>
                <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 blue-button transition-colors duration-200 font-medium"
                    >
                        Return to Dashboard
                    </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-4 sm:mb-0"
                    >
                        <HiArrowLeft className="mr-2 h-5 w-5" />
                        Back to Dashboard
                    </button>
                    <div className="text-right">
                        <h2 className="text-sm font-semibold text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                        <h1 className="text-xl font-bold text-gray-900 mt-1">{survey.title}</h1>
                    </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                    <div
                        className="bg-[#101726] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-8 mb-8">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                            {currentQuestion?.category?.replace(/_/g, ' ')}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{currentQuestion?.title}</h3>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Answer (Optional)
                        </label>
                        <textarea
                            id="answer"
                            name="answer"
                            rows="6"
                            value={answers[currentQuestion?.question_id] || ''}
                            onChange={(e) => handleAnswerChange(currentQuestion.question_id, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101726] focus:border-transparent resize-none"
                            placeholder="Type your response here..."
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestionIndex === 0}
                            className={`px-6 py-3 rounded-lg flex items-center ${
                                currentQuestionIndex === 0
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } transition-colors duration-200`}
                        >
                            <HiArrowLeft className="mr-2 h-5 w-5" />
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-6 py-3 bg-[#101726] text-white rounded-lg hover:bg-[#1c2a43] transition-colors duration-200 flex items-center font-medium"
                        >
                            {isLastQuestion ? 'Continue' : 'Next Question'}
                            {<HiArrowRight className="ml-2 h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center space-x-2 flex-wrap">
                    {questions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                index === currentQuestionIndex
                                    ? 'bg-[#101726] text-white'
                                    : answers[questions[index]?.question_id]
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } transition-colors duration-200 text-sm font-medium`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnswerSurvey;