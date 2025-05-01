import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axiosInstance from '../../api/axios';
import useUserStore from '../../stores/userStore';
import { IoStatsChart } from "react-icons/io5";
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

function countByField(array, fieldName) {
  const counts = array.reduce((acc, item) => {
    const key = item[fieldName];
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([key, count]) => ({
    [fieldName]: key,
    count
  }));
}

function formatDate(dateStr) {
  const [year, month] = dateStr.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function countByDateField(array, fieldName, granularity = "day") {
  const counts = array.reduce((acc, item) => {
    const dateObj = new Date(item[fieldName]);
    let key;

    switch (granularity) {
      case "day":
        key = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
        break;
      case "month":
        key = dateObj.toISOString().slice(0, 7);    // YYYY-MM
        break;
      case "year":
        key = dateObj.getFullYear().toString();     // YYYY
        break;
      default:
        throw new Error("Unsupported granularity: " + granularity);
    }

    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([key, count]) => ({
      [fieldName]: key,
      formattedDate: formatDate(key),
      count
    }))
    .sort((a, b) => a[fieldName].localeCompare(b[fieldName]));
}

function getAnswerCountRanges(surveys) {
  const ranges = {
    '0': 0,
    '1-10': 0,
    '11-50': 0,
    '51-100': 0,
    '101-500': 0,
    '501-1000': 0,
    '1000+': 0
  };

  surveys.forEach(survey => {
    const answerCount = survey?.questions[0]?.answers?.length || 0;
    if (answerCount === 0) ranges['0']++;
    else if (answerCount <= 10) ranges['1-10']++;
    else if (answerCount <= 50) ranges['11-50']++;
    else if (answerCount <= 100) ranges['51-100']++;
    else if (answerCount <= 500) ranges['101-500']++;
    else if (answerCount <= 1000) ranges['501-1000']++;
    else ranges['1000+']++;
  });

  return Object.entries(ranges).map(([range, count]) => ({
    range,
    count
  }));
}

function getTopSurveys(surveys, limit = 5) {
  return surveys
    .map(survey => ({
      title: survey.title,
      count: survey?.questions[0]?.answers?.length || 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

const AdminStatistics = () => {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [users, setUsers] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersData, surveysData] = await Promise.all([
          axiosInstance.get('users'),
          axiosInstance.get('surveys')
        ]);
        
        setUsers(usersData.data);
        setSurveys(surveysData.data);
        console.log(usersData.data);
        console.log(surveysData.data)
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [token, user]);

  const usersByRole = countByField(users, 'role');
  const usersByMonth = countByDateField(users, 'created_at', 'month');
  const surveysByMonth = countByDateField(surveys, 'created_at', 'month');
  const surveysByAnswerRanges = getAnswerCountRanges(surveys);
  const topSurveys = getTopSurveys(surveys);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access the statistics page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                    bg-white text-gray-700 hover:bg-gray-50 
                    flex items-center gap-2 transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Admin Dashboard
          </button>
        </div>
        <div className="flex items-center gap-2 text-purple-600">
          <IoStatsChart className="text-2xl" />
          <span className="font-medium">Analytics Overview</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Roles Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersByRole}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Number of Users" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Growth Over Time</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ fill: '#82ca9d', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#82ca9d' }}
                    name="New Users" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Survey Creation Over Time</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={surveysByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    dot={{ fill: '#ffc658', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#ffc658' }}
                    name="New Surveys" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Survey Answer Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={surveysByAnswerRanges}
                  margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="range"
                    height={50}
                    label={{ 
                      value: 'Number of Answers', 
                      position: 'bottom', 
                      offset: 20
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Number of Surveys', 
                      angle: -90, 
                      position: 'insideLeft',
                      offset: -40
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`${value} surveys`, 'Count']}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#8884d8" 
                    name="Number of Surveys" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Most Answered Surveys</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topSurveys}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 200, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number"
                    label={{ 
                      value: 'Number of Answers', 
                      position: 'bottom', 
                      offset: 0 
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={180}
                    tick={{ 
                      fontSize: 12,
                      width: 170,
                      wordBreak: 'break-word'
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`${value} answers`, 'Count']}
                  />
                  <Bar
                    dataKey="count"
                    fill="#82ca9d"
                    name="Number of Answers"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStatistics;