import { useParams } from "react-router-dom"
import { FiShare2 } from "react-icons/fi";
import { CiHeart, CiClock1 } from "react-icons/ci";
import { LiaCommentSolid } from "react-icons/lia";
import { categoryColors } from "../../data/Categories";
import { BsCameraVideo } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { AiOutlineDislike } from "react-icons/ai";
import { useState } from "react";
import WebcamStreamCapture from "../WebCam";

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
      replies: [
        {
          id: "r1",
          isVideo: true,
          url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          text: "Here's my experience hiking in Switzerland!",
          author: "John Doe",
          likes: 45,
          timeCreated: "1 day ago"
        },
        {
          id: "r2",
          isVideo: false,
          text: "I recommend visiting in the summer months for the best experience. The trails are well-maintained and the weather is perfect for hiking.",
          author: "Jane Smith",
          likes: 32,
          timeCreated: "2 days ago"
        }
      ]
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
      replies: [
        {
          id: "r3",
          isVideo: true,
          url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          text: "Here's a practical example of React hooks!",
          author: "Mike Johnson",
          likes: 89,
          timeCreated: "5 days ago"
        },
        {
          id: "r4",
          isVideo: false,
          text: "Great tutorial! I would also recommend learning about React Context API as it's essential for state management.",
          author: "Sarah Wilson",
          likes: 67,
          timeCreated: "6 days ago"
        }
      ]
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
      replies: [
        {
          id: "r5",
          isVideo: false,
          text: "I've implemented these tips in my project and saw a 40% improvement in load times!",
          author: "Alex Brown",
          likes: 56,
          timeCreated: "2 hours ago"
        },
        {
          id: "r6",
          isVideo: true,
          url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          text: "Here's a demonstration of the performance optimization techniques",
          author: "Chris Davis",
          likes: 78,
          timeCreated: "1 hour ago"
        }
      ]
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
      text: "I found this explanation of neural networks particularly helpful. The step-by-step breakdown made it much clearer.",
      replies: [
        {
          id: "r7",
          isVideo: false,
          text: "I found this explanation of neural networks particularly helpful. The step-by-step breakdown made it much clearer.",
          author: "Emma Wilson",
          likes: 45,
          timeCreated: "2 hours ago"
        },
        {
          id: "r8",
          isVideo: true,
          url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          text: "Here's a visual explanation of how backpropagation works",
          author: "David Lee",
          likes: 67,
          timeCreated: "1 hour ago"
        }
      ]
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
      text: "I've been working with AWS for 5 years, and these practices have saved me countless hours of debugging.",
      replies: [
        {
          id: "r9",
          isVideo: false,
          text: "I've been working with AWS for 5 years, and these practices have saved me countless hours of debugging.",
          author: "Lisa Chen",
          likes: 34,
          timeCreated: "1 day ago"
        },
        {
          id: "r10",
          isVideo: true,
          url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          text: "Here's a demonstration of proper cloud resource management",
          author: "Tom Anderson",
          likes: 45,
          timeCreated: "12 hours ago"
        }
      ]
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
      response_type: "text",
      text: "I've been working with AWS for 5 years, and these practices have saved me countless hours of debugging.",
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
      response_type: "video"
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
      text: "I've been working with AWS for 5 years, and these practices have saved me countless hours of debugging.",
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
      response_type: "video"
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
      text: "I've been working with AWS for 5 years, and these practices have saved me countless hours of debugging.",
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
      response_type: "video"
    },
    {
      id: 13,
      category: "Business",
      title: "Starting Your First Startup",
      likes: 670,
      dislikes: 28,
      answers: 98,
      timeCreated: "2 days ago",
      response_type: "text",
      text: "I've been working with AWS for 5 years, and these practices have saved me countless hours of debugging.",
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
      response_type: "text"
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
      response_type: "video"
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
      text: "I've been working with AWS for 5 years, and these practices have saved me countless hours of debugging.",
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
      response_type: "video"
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
      text: "I've been working with AWS for 5 years, and these practices have saved me countless hours of debugging.",
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
      response_type: "video"
    }
  ];

const QuestionPage = () => {
    const {id} = useParams();
    const video = videos.filter(video => video.id == id)[0];
    const [mainVideoLiked, setMainVideoLiked] = useState(false);
    const [mainVideoDisliked, setMainVideoDisliked] = useState(false);
    const [likedReplies, setLikedReplies] = useState({});
    const [dislikedReplies, setDislikedReplies] = useState({});
    const [isRecordingVideo, setIsRecordingVideo] = useState(false);
    const [isWritingResponse, setIsWritingResponse] = useState(false);
    const [sortBy, setSortBy] = useState('recent');
    const [filterType, setFilterType] = useState('all');

    const handleMainLike = () => {
        if (mainVideoDisliked) setMainVideoDisliked(false);
        setMainVideoLiked(!mainVideoLiked);
    };

    const handleMainDislike = () => {
        if (mainVideoLiked) setMainVideoLiked(false);
        setMainVideoDisliked(!mainVideoDisliked);
    };

    const handleReplyLike = (replyId) => {
        if (dislikedReplies[replyId]) {
            setDislikedReplies(prev => ({
                ...prev,
                [replyId]: false
            }));
        }
        setLikedReplies(prev => ({
            ...prev,
            [replyId]: !prev[replyId]
        }));
    };

    const handleReplyDislike = (replyId) => {
        if (likedReplies[replyId]) {
            setLikedReplies(prev => ({
                ...prev,
                [replyId]: false
            }));
        }
        setDislikedReplies(prev => ({
            ...prev,
            [replyId]: !prev[replyId]
        }));
    };

    const handleResponseTypeSelect = (type) => {
        if (type === 'video') {
            setIsRecordingVideo(true);
            setIsWritingResponse(false);
        } else {
            setIsWritingResponse(true);
            setIsRecordingVideo(false);
        }
    };

    const getSortedAndFilteredReplies = () => {
        if (!video.replies) return [];
        
        let filteredReplies = [...video.replies];
        
        if (filterType !== 'all') {
            const isVideoType = filterType === 'video';
            filteredReplies = filteredReplies.filter(reply => reply.isVideo === isVideoType);
        }

        const getTimeInHours = (timeStr) => {
            const num = parseInt(timeStr);
            if (timeStr.includes('week')) return num * 168;
            if (timeStr.includes('day')) return num * 24;
            if (timeStr.includes('hour')) return num;
            return 0;
        };

        return filteredReplies.sort((a, b) => {
            let aLikes, bLikes;
            
            switch (sortBy) {
                case 'recent':
                    return getTimeInHours(b.timeCreated) - getTimeInHours(a.timeCreated);
                case 'liked':
                    aLikes = a.likes + (likedReplies[a.id] ? 1 : 0);
                    bLikes = b.likes + (likedReplies[b.id] ? 1 : 0);
                    return bLikes - aLikes;
                case 'oldest':
                    return getTimeInHours(a.timeCreated) - getTimeInHours(b.timeCreated);
                default:
                    return 0;
            }
        });
    };

    return(
        <div className="bg-white p-8 flex flex-col items-center space-y-5">
            <div className="w-[50%] flex justify-start items-center space-x-4">
                <img 
                    className="object-cover cursor-pointer w-10 h-10 rounded-full overflow-hidden"
                    src="https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="profile picture" 
                />
                <div className="flex flex-col justify-center items-start">
                    <span>Sarah Mitchell</span>
                    <span className="text-sm text-[#5d5d5d]">{video.timeCreated}</span>
                </div>
            </div>

            <div className="w-[50%]">
                <span className="text-2xl font-bold">
                    {video.title}
                </span>
            </div>

            {video.response_type == 'video' && (
                <div className="w-[50%]">
                    <video src={video.url} className="shadow-lg" controls />
                </div>
            )}

            {video.response_type == 'text' && (
                <div className="w-[50%]">
                    <p>{video.text}</p>
                </div>
            )}

            <div className="flex items-center justify-between w-[50%]">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleMainLike}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors ${
                                mainVideoLiked 
                                ? 'border-red-200 bg-red-50 text-red-500' 
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                            <CiHeart size={20} className={mainVideoLiked ? 'text-red-500' : ''}/> 
                            <span className="text-sm font-medium">
                                {video.likes + (mainVideoLiked ? 1 : 0)}
                            </span>
                        </button>
                        <button 
                            onClick={handleMainDislike}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors ${
                                mainVideoDisliked 
                                ? 'border-red-200 bg-red-50 text-red-500' 
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                            <AiOutlineDislike size={20} className={mainVideoDisliked ? 'text-red-500' : ''}/> 
                        </button>
                    </div>
                    <span className="flex items-center space-x-2">
                        <LiaCommentSolid color="blue" />
                        <span>{video.answers} answers</span>
                    </span>
                    <span className="flex items-center space-x-2 border-2 rounded-full px-3 py-1 text-sm font-medium" 
                          style={{ 
                            backgroundColor: categoryColors[video.category]?.bg || '#F3F4F6',
                            color: categoryColors[video.category]?.text || '#6B7280',
                            borderColor: categoryColors[video.category]?.text || '#6B7280'
                          }}>
                        {video.category.replace(/_/g, ' ').toLowerCase()
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                    </span>
                </div>
                <div>
                    <span className="flex items-center space-x-2">
                        <FiShare2 color="green"/>
                        <span>Share</span>
                    </span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-8 px-4">
                <div className="flex gap-3">
                    <button 
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${
                            isRecordingVideo 
                            ? 'bg-[#1a1a1a] text-white' 
                            : 'bg-white text-[#1a1a1a] border border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleResponseTypeSelect('video')}
                    >
                        <BsCameraVideo size={20} /> Record Video
                    </button>
                    <button 
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${
                            isWritingResponse 
                            ? 'bg-[#1a1a1a] text-white' 
                            : 'bg-white text-[#1a1a1a] border border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleResponseTypeSelect('text')}
                    >
                        <MdOutlineEdit size={20} /> Write Response
                    </button>
                </div>

                {(isRecordingVideo || isWritingResponse) && (
                    <div className="mt-6 w-full">
                        {isRecordingVideo ? (
                            <WebcamStreamCapture />
                        ) : isWritingResponse ? (
                            <div className="w-full">
                                <textarea 
                                    placeholder="Write your response here..." 
                                    className="w-full min-h-[200px] p-4 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-[#101726] focus:ring-1 focus:ring-[#101726] transition-colors"
                                />
                                <div className="flex justify-end mt-4">
                                    <button className="bg-[#101726] text-white px-6 py-2 rounded-lg hover:bg-[#1c2a43] transition-colors">
                                        Submit Response
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-[#1a1a1a]">{video.answers} Responses</h2>
                        <div className="flex gap-3">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-1.5 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-600"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="liked">Most Liked</option>
                                <option value="oldest">Oldest</option>
                            </select>
                            <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-1.5 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-600"
                            >
                                <option value="all">All Types</option>
                                <option value="video">Video</option>
                                <option value="text">Text</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {getSortedAndFilteredReplies().map((reply) => (
                            <div key={reply.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                        <div>
                                            <h3 className="font-medium text-[#1a1a1a]">{reply.author}</h3>
                                            <p className="text-sm text-gray-500">{reply.timeCreated}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${reply.isVideo ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                                        {reply.isVideo ? 'Video' : 'Text'}
                                    </span>
                                </div>
                                
                                {reply.isVideo ? (
                                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                                        <video src={reply.url} className="w-full h-full rounded-lg" controls />
                                    </div>
                                ) : (
                                    <p className="text-gray-700 mb-4">{reply.text}</p>
                                )}
                                
                                <div className="flex items-center gap-4 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleReplyLike(reply.id)}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors ${
                                                likedReplies[reply.id] 
                                                ? 'border-red-200 bg-red-50 text-red-500' 
                                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                            }`}
                                        >
                                            <CiHeart size={20} className={likedReplies[reply.id] ? 'text-red-500' : ''}/> 
                                            <span className="text-sm font-medium">
                                                {reply.likes + (likedReplies[reply.id] ? 1 : 0)}
                                            </span>
                                        </button>
                                        <button 
                                            onClick={() => handleReplyDislike(reply.id)}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors ${
                                                dislikedReplies[reply.id] 
                                                ? 'border-red-200 bg-red-50 text-red-500' 
                                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                            }`}
                                        >
                                            <AiOutlineDislike size={20} className={dislikedReplies[reply.id] ? 'text-red-500' : ''}/> 
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionPage