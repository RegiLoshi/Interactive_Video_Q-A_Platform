import VideoCard from "./VideoCard";
import TextCard from "./TextCard";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

const videos = [
  {
    id: 1,
    url: "/Users/regiloshi/Downloads/videoDummy1.mp4",
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
    url: "/Users/regiloshi/Downloads/videoDummy2.mp4",
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
    url: "/Users/regiloshi/Downloads/videoDummy3.mp4",
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
