import PopularVideo from "./PopularVideo";

const fakeVideos = [
    {
        url: "/Users/regiloshi/Desktop/videoDummy1.mp4",
        title: "Exploring the Mountains",
        likes: 120,
        dislikes: 10,
        answers: 35,
        timeCreated: "2 days ago"
    },
    {
        url: "/Users/regiloshi/Desktop/videoDummy2.mp4",
        title: "Beginner's Guide to React",
        likes: 500,
        dislikes: 25,
        answers: 120,
        timeCreated: "1 week ago"
    },
    {
        url: "/Users/regiloshi/Desktop/videoDummy3.mp4",
        title: "Top 10 JavaScript Tricks",
        likes: 340,
        dislikes: 15,
        answers: 75,
        timeCreated: "3 hours ago"
    }
];

const PopularQuestions = () => {
    return (
        <div className="py-4 px-8">
            <span className="text-xl font-bold text-[#444444]">Popular Answers</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4">
                {fakeVideos.map((video) => {
                    return (
                        <PopularVideo video={video} key={video.url} />
                    );
                })}
            </div>
        </div>
    );
};

export default PopularQuestions;
