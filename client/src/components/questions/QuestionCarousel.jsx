import VideoCard from "./VideoCard";
import TextCard from "./TextCard";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

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
    response_type: "video"
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
    response_type: "video"
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
    response_type: "video"
  },
  {
    id: 4,
    category: "Data Science",
    title: "Understanding Machine Learning Algorithms",
    likes: 340,
    dislikes: 15,
    answers: 75,
    timeCreated: "3 hours ago",
    response_type: "text"
  },
  {
    id: 5,
    title: "Best Practices in Cloud Computing",
    likes: 100,
    dislikes: 5,
    answers: 20,
    timeCreated: "2 days ago",
    response_type: "text",
    category: "Cloud Computing"
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
    response_type: "text"
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
    response_type: "text"
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
    response_type: "text"
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
    response_type: "text"
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

const QuestionCarousel = ({text = "Popular Questions", search = "", filter=""}) => {
  const filteredVideos = videos.filter(video => 
    (!search || video.title.toLowerCase().includes(search.toLowerCase())) && 
    (!filter || video.category.toLowerCase().includes(filter.toLowerCase()))
  );
  
  return (
    <div className="py-4 px-8">
      {filteredVideos.length < 4 ? (
        <>
          <span className="text-xl font-bold text-[#444444]">{text}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((item) => (
                item.response_type === "video" ? (
                  <VideoCard video={item} key={item.id} />
                ) : (
                  <TextCard text={item} key={item.id} />
                )
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No questions found matching your criteria
              </div>
            )}
          </div>
        </>
      ): 
        (
        <div>
        <span className="text-xl font-bold text-[#444444]">{text}</span>
        <CarouselProvider
          naturalSlideWidth={33.3}
          naturalSlideHeight={30}
          totalSlides={filteredVideos.length}
          visibleSlides={3}
          step={1}
          dragEnabled={true}
          infinite={true}
          className="w-full">
          <div className="relative">
            <Slider className="overflow-hidden">
              {filteredVideos.map((item, index) => (
                <Slide index={index} key={item.id} className="p-2">
                  <div>
                    {item.response_type === "video" ? (
                      <VideoCard video={item} />
                    ) : (
                      <TextCard text={item} />
                    )}
                  </div>
                </Slide>
              ))}
            </Slider>
            <ButtonBack className="blue-button absolute -left-5 top-[45%] bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-10 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </ButtonBack>
            <ButtonNext className="blue-button absolute -right-5 top-[45%] bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-10 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </ButtonNext>
          </div>
        </CarouselProvider>
        </div>
        )
      }
    </div>
  );
};

export default QuestionCarousel;
