import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiTrash, HiArrowLeft } from 'react-icons/hi';
import useUserStore from '../../stores/userStore';

const CreateSurveyPage = () => {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        {
            id: 1,
            text: '',
            category: 'TECHNOLOGY'
        }
    ]);

    const categories = [
        'TECHNOLOGY',
        'PROGRAMMING',
        'WEB_DEVELOPMENT',
        'MOBILE_DEVELOPMENT',
        'DATA_SCIENCE',
        'ARTIFICIAL_INTELLIGENCE',
        'MACHINE_LEARNING',
        'CYBERSECURITY',
        'CLOUD_COMPUTING',
        'MEDICINE'
    ];

    const addQuestion = () => {
        const newQuestion = {
            id: questions.length + 1,
            text: '',
            category: 'TECHNOLOGY'
        };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (id) => {
        if (questions.length > 1) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q => {
            if (q.id === id) {
                return { ...q, [field]: value };
            }
            return q;
        }));
    };

    const handleSubmit = async (e) => {
       e.preventDefault();
       try {
           const res = await fetch('http://localhost:3000/survey', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify({
                   title,
                   description,
                   questions,
                   authorId: user?.user_id
               }),
               credentials: 'include', 
           });
           
           if (!res.ok) {
               throw new Error(`HTTP error! status: ${res.status}`);
           }
           
           const data = await res.json();
           console.log("Survey created:", data);
           navigate('/dashboard');
       } catch (error) {
           console.error("Error creating survey:", error);
       }
    };

    return (
        <main className="w-full min-h-screen bg-[#f8fbfb] py-8">
            <div className="max-w-4xl mx-auto px-4">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                             bg-white text-gray-700 hover:bg-gray-50 
                             flex items-center gap-2 transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Survey</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Survey Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter survey title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter survey description"
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-xl font-medium text-gray-900">Questions</h2>
                            
                            {questions.map((question, index) => (
                                <div key={question.id} className="p-4 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-medium text-gray-500">
                                            Question {index + 1}
                                        </span>
                                        {questions.length > 1 && question.id !== 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(question.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <HiTrash className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Question Text
                                            </label>
                                            <input
                                                type="text"
                                                value={question.text}
                                                onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your question"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category
                                            </label>
                                            <select
                                                value={question.category}
                                                onChange={(e) => updateQuestion(question.id, 'category', e.target.value)}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {categories.map(category => (
                                                    <option key={category} value={category}>
                                                        {category.replace(/_/g, ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addQuestion}
                                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg
                                         text-gray-600 hover:text-gray-700 hover:border-gray-400
                                         flex items-center justify-center gap-2 transition-colors"
                            >
                                <HiPlus className="w-5 h-5" />
                                Add Question
                            </button>
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                                         transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Create Survey
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default CreateSurveyPage; 