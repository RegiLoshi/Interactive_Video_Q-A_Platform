import { CiHeart } from "react-icons/ci";
import { LiaCommentSolid } from "react-icons/lia";
import { BsReply } from "react-icons/bs";
import { CiClock1 } from "react-icons/ci";
import CATEGORY_OPTIONS from "../../data/Categories";
import { useNavigate } from "react-router-dom";
import QuestionPage from "./QuestionPage";



const VideoCard = ({video}) => {
    const categoryOption = CATEGORY_OPTIONS.find(cat => 
        cat.label.toLowerCase() === video.category.toLowerCase()
    ) || CATEGORY_OPTIONS[0];
    let navigate = useNavigate();

    const handleNavigation = () => {
        navigate(`/question/${video.id}`)
    }

    return(
        <div className="flex flex-col space-y-3 border-1 p-2 shadow-xl bg-[#FEFEFE]">
            <video src={video.url} title={video.title} controls />
            <div className="flex justify-between items-start">
                <span className="text-[#646464]">{video.title}</span>
                <span 
                    className="text-sm px-2 py-1 rounded-full"
                    style={{
                        backgroundColor: categoryOption.colors.bg,
                        color: categoryOption.colors.text
                    }}
                >
                    {video.category}
                </span>
            </div>
            <div className="flex space-x-2 items-center">
                <span className="flex items-center space-x-4 text-[#646464]"><CiHeart color="red"/>  {video.likes - video.dislikes}</span>
                <span className="flex items-center space-x-4 text-[#646464]"><LiaCommentSolid color="blue"/> {video.answers}</span>
                <span className="flex items-center space-x-4 text-[#646464]"><CiClock1 /> {video.timeCreated}</span>
            </div>
            <button className="flex justify-center items-center bg-[#101726] p-3 text-white hover:bg-[#1c2a43] transition-colors cursor-pointer"
            onClick={handleNavigation}
            >
                <div className="flex space-x-6 justify-center items-center">
                    <BsReply />
                    Respond
                </div>
            </button>
        </div>
    )
}

export default VideoCard;