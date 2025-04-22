import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiSearch, HiChevronDown, HiEye } from 'react-icons/hi';
import axiosInstance from '../../api/axios';

const SurveyRespondents = () => {
    const { surveyId } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('All Dates');
    const [surveyData, setSurveyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get(`/surveys/${surveyId}`);
                setAuthors((await axiosInstance.get(`answers/survey/${surveyId}/responses`)).data);
                setSurveyData(data);
                setError(null);
            } catch (err) {
                setError('Failed to load survey data');
                console.error('Error fetching survey:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSurveyData();
    }, [surveyId]);

    const filteredResponses = useMemo(() => {
        if (!authors) return [];
        
        return authors.filter(response => {
            const matchesSearch = response.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
            
            let matchesDate = true;
            const responseDate = new Date(response.created_at);
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
    }, [authors, searchQuery, dateFilter]);

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
                    <p className="text-gray-600">Total Respondents: {authors.length}</p>
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
                                    key={response.author.user_id} 
                                    className={`
                                        transition-colors duration-200
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                        hover:bg-blue-50
                                    `}
                                    onClick={() => navigate(`/dashboard/surveys/${surveyId}/${response.author.user_id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">
                                                    {response.author?.name?.charAt(0)}{response.author?.last_name?.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {response.author?.name} {response.author?.last_name}
                                                </div>
                                                <div className="text-sm text-gray-500">{response.author?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(response.created_at).toLocaleDateString()}
                                        </div>
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
                        <p className="text-gray-500 text-sm">No respondents found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurveyRespondents; 