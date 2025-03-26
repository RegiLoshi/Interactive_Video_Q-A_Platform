import { useState } from 'react';
import MyQuestionCard from './MyQuestionCard';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import CATEGORY_OPTIONS from '../../data/Categories.js'

const ITEMS_PER_PAGE = 5;

const videos = [
    {
      id: 1,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      category: "Travel",
      title: "Exploring the Mountains of Switzerland",
      likes: 120,
      dislikes: 10,
      answers: 35,
      timeCreated: "2 days ago",
      response_type: "video",
      isPublic: true 
    },
    {
      id: 2,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      category: "Programming",
      title: "Beginner's Guide to React Development",
      likes: 500,
      dislikes: 25,
      answers: 120,
      timeCreated: "1 week ago",
      response_type: "video",
      isPublic: true 
    },
    {
      id: 3,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      category: "Technology",
      title: "Top 10 JavaScript Performance Tips",
      likes: 340,
      dislikes: 15,
      answers: 75,
      timeCreated: "3 hours ago",
      response_type: "video",
      isPublic: true 
    },
    {
      id: 4,
      category: "Data Science",
      title: "Understanding Machine Learning Algorithms",
      likes: 340,
      dislikes: 15,
      answers: 75,
      timeCreated: "3 hours ago",
      response_type: "text",
      isPublic: true 
    },
    {
      id: 5,
      title: "Best Practices in Cloud Computing",
      likes: 100,
      dislikes: 5,
      answers: 20,
      timeCreated: "2 days ago",
      response_type: "text",
      category: "Cloud Computing",
      isPublic: true 
    },
    {
      id: 6,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      category: "Cooking",
      title: "Traditional Italian Pasta Making",
      likes: 890,
      dislikes: 30,
      answers: 145,
      timeCreated: "5 days ago",
      response_type: "video"
    },
    {
      id: 7,
      category: "Mathematics",
      title: "Solving Complex Calculus Problems",
      likes: 230,
      dislikes: 12,
      answers: 45,
      timeCreated: "1 day ago",
      response_type: "text"
    },
    {
      id: 8,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      category: "Physical Fitness",
      title: "Perfect Form for Deadlifts",
      likes: 670,
      dislikes: 18,
      answers: 89,
      timeCreated: "4 days ago",
      response_type: "video",
      isPublic: true 
    },
    {
      id: 9,
      category: "Mental Health",
      title: "Managing Anxiety in the Workplace",
      likes: 445,
      dislikes: 8,
      answers: 92,
      timeCreated: "6 hours ago",
      response_type: "text",
      isPublic: false 
    },
    {
      id: 10,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      category: "Music",
      title: "Beginner Guitar Chord Progressions",
      likes: 780,
      dislikes: 25,
      answers: 156,
      timeCreated: "3 days ago",
      response_type: "video",
      isPublic: true 
    },
    {
      id: 11,
      category: "Cybersecurity",
      title: "Understanding Common Security Threats",
      likes: 520,
      dislikes: 13,
      answers: 78,
      timeCreated: "12 hours ago",
      response_type: "text",
      isPublic: false 
    },
    {
      id: 12,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      category: "Photography",
      title: "Mastering Portrait Lighting",
      likes: 890,
      dislikes: 22,
      answers: 134,
      timeCreated: "1 week ago",
      response_type: "video",
      isPublic: true 
    },
    {
      id: 13,
      category: "Business",
      title: "Starting Your First Startup",
      likes: 670,
      dislikes: 28,
      answers: 98,
      timeCreated: "2 days ago",
      response_type: "text"
    },
    {
      id: 14,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      category: "Gaming",
      title: "Advanced Minecraft Redstone Circuits",
      likes: 1200,
      dislikes: 45,
      answers: 245,
      timeCreated: "5 days ago",
      response_type: "video"
    },
    {
      id: 15,
      category: "Environmental Science",
      title: "Impact of Climate Change on Ecosystems",
      likes: 430,
      dislikes: 17,
      answers: 86,
      timeCreated: "8 hours ago",
      response_type: "text",
      isPublic: false 
    },
    {
      id: 16,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      category: "DIY And Crafts",
      title: "Building a Custom Wooden Desk",
      likes: 560,
      dislikes: 12,
      answers: 94,
      timeCreated: "6 days ago",
      response_type: "video",
      isPublic: true 
    },
    {
      id: 17,
      category: "Psychology",
      title: "Understanding Cognitive Biases",
      likes: 780,
      dislikes: 23,
      answers: 156,
      timeCreated: "4 hours ago",
      response_type: "text",
      isPublic: false 
    },
    {
      id: 18,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      category: "Artificial Intelligence",
      title: "Building Your First Neural Network",
      likes: 890,
      dislikes: 34,
      answers: 167,
      timeCreated: "3 days ago",
      response_type: "video",
      isPublic: true 
    },
    {
      id: 19,
      category: "Literature",
      title: "Analyzing Modern Poetry Techniques",
      likes: 340,
      dislikes: 15,
      answers: 67,
      timeCreated: "1 day ago",
      response_type: "text",
      isPublic: false 
    },
    {
      id: 20,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      category: "Nutrition",
      title: "Meal Prep for Muscle Gain",
      likes: 670,
      dislikes: 19,
      answers: 123,
      timeCreated: "4 days ago",
      response_type: "video",
      isPublic: true 
    }
  ];

const MyQuestions = ({text}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [questionsList, setQuestionsList] = useState(videos);

    const handleDeleteQuestion = (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            setQuestionsList(prevQuestions => 
                prevQuestions.filter(q => q.id !== questionId)
            );
            
            const remainingQuestions = questionsList.length - 1;
            const maxPages = Math.ceil(remainingQuestions / ITEMS_PER_PAGE);
            if (currentPage > maxPages) {
                setCurrentPage(Math.max(1, maxPages));
            }
        }
    };

    const filteredQuestions = questionsList.filter(question => {
        const matchesType = filter === 'all' || question.response_type === filter;
        const matchesSearch = search === '' || 
            question.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === '' || 
            question.category === category;
        
        return matchesType && matchesSearch && matchesCategory;
    });

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setCurrentPage(1);
        setIsDropdownOpen(false);
    };

    const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.category-dropdown')) {
            setIsDropdownOpen(false);
        }
    };

    useState(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium">{text}</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleFilterChange('all')}
                            className={`px-4 py-2 rounded-lg text-sm ${
                                filter === 'all' 
                                ? 'bg-gray-100 text-gray-900' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => handleFilterChange('video')}
                            className={`px-4 py-2 rounded-lg text-sm ${
                                filter === 'video' 
                                ? 'bg-gray-100 text-gray-900' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Video
                        </button>
                        <button 
                            onClick={() => handleFilterChange('text')}
                            className={`px-4 py-2 rounded-lg text-sm ${
                                filter === 'text' 
                                ? 'bg-gray-100 text-gray-900' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Text
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative category-dropdown">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <span className="text-gray-700">
                                {category || 'All Categories'}
                            </span>
                            <MdOutlineKeyboardArrowDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border overflow-hidden z-10">
                                <div className="max-h-64 overflow-y-auto">
                                    <button
                                        onClick={() => handleCategoryChange('')}
                                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                                            category === '' ? 'bg-gray-100' : ''
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                    {CATEGORY_OPTIONS.map((cat) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => handleCategoryChange(cat.label)}
                                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                                                category === cat.label ? 'bg-gray-100' : ''
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="divide-y">
                {paginatedQuestions.length > 0 ? (
                    paginatedQuestions.map(question => (
                        <MyQuestionCard 
                            key={question.id} 
                            question={question}
                            onDelete={handleDeleteQuestion}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No questions found matching your filters
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredQuestions.length)} of {filteredQuestions.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${
                                currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <IoChevronBack className="w-5 h-5" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 rounded-lg text-sm ${
                                    currentPage === page
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg ${
                                currentPage === totalPages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <IoChevronForward className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyQuestions;