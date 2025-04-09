import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiSearch, HiChevronDown, HiEye } from 'react-icons/hi';
import useUserStore from '../../stores/userStore';
const SurveyResponses = () => {
    const {surveyId} = useParams();
    const surveys = useUserStore((state) => state.surveys);
    const survey = surveys.filter(survey => survey.survey_id === surveyId);
    console.log(survey)
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('All Dates');

    const [surveyData] = useState({
        title: 'Customer Satisfaction Survey 2025',
        totalResponses: 247,
        responses: Array.from({ length: 50 }, (_, index) => ({
            id: index + 1,
            respondent: {
                name: index % 2 === 0 ? 'John Cooper' : 'Sarah Miller',
                avatar: `https://ui-avatars.com/api/?name=${index % 2 === 0 ? 'John+Cooper' : 'Sarah+Miller'}&background=random`
            },
            submissionDate: `Jan ${15 - (index % 7)}, 2025 ${14 - (index % 12)}:${30 - (index % 30)}`
        }))
    });

    const filteredResponses = useMemo(() => {
        return surveyData.responses.filter(response => {
            const matchesSearch = response.respondent.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            let matchesDate = true;
            const responseDate = new Date(response.submissionDate);
            const today = new Date();
            
            if (dateFilter === 'Last 7 Days') {
                const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
                matchesDate = responseDate >= sevenDaysAgo;
            } else if (dateFilter === 'Last 30 Days') {
                const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
                matchesDate = responseDate >= thirtyDaysAgo;
            }

            return matchesSearch && matchesDate;
        });
    }, [surveyData.responses, searchQuery, dateFilter]);

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
                    <p className="text-gray-600">Total Responses: {filteredResponses.length}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiSearch className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by respondent name..."
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="relative min-w-[180px]">
                        <select
                            className="appearance-none w-full border rounded-lg px-4 py-2 bg-white pr-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <option>All Dates</option>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <HiChevronDown className="w-5 h-5" />
                        </div>
                    </div>
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
                            {filteredResponses.map((response, index) => (
                                <tr 
                                    key={response.id} 
                                    className={`
                                        transition-colors duration-200
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                        hover:bg-blue-50
                                    `}
                                    onClick={() => navigate(`/dashboard/surveys/${surveyId}/${response.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={response.respondent.avatar} 
                                                alt={response.respondent.name}
                                                className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">{response.respondent.name}</div>
                                                <div className="text-sm text-gray-500">Respondent #{response.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{response.submissionDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 
                                                     rounded-lg hover:bg-blue-100 transition-colors duration-200
                                                     font-medium text-sm focus:outline-none focus:ring-2 
                                                     focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            <HiEye className="w-4 h-4" />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredResponses.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">No responses found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurveyResponses; 