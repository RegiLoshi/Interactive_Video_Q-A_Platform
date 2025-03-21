import { CiHeart } from "react-icons/ci";
import { LiaCommentSolid } from "react-icons/lia";
import { CiClock1 } from "react-icons/ci";
const PopularVideo = ({video}) => {
    return(
        <div className="flex flex-col space-y-3">
            <video src={video.url} title={video.title} controls autoPlay />
            <span className="text-[#646464]">{video.title}</span>
            <div className="flex space-x-2 items-center">
                <span className="flex items-center space-x-4 text-[#646464]"><CiHeart color="red"/>  {video.likes - video.dislikes}</span>
                <span className="flex items-center space-x-4 text-[#646464]"><LiaCommentSolid color="blue"/> {video.answers}</span>
                <span className="flex items-center space-x-4 text-[#646464]"><CiClock1 /> {video.timeCreated}</span>
            </div>
        </div>
    )
}

export default PopularVideo;