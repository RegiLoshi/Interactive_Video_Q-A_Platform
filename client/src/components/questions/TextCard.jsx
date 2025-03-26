import { CiHeart } from "react-icons/ci";
import { LiaCommentSolid } from "react-icons/lia";
import { BsReply } from "react-icons/bs";
import { CiClock1 } from "react-icons/ci";
import CATEGORY_OPTIONS from "../../data/Categories";
import { useNavigate } from "react-router-dom";

const TextCard = ({ text }) => {
    const categoryOption = CATEGORY_OPTIONS.find(cat => 
        cat.label.toLowerCase() === text.category.toLowerCase()
    ) || CATEGORY_OPTIONS[0]; // fallback to NO_FILTER if not found
    let navigate = useNavigate();

    const handleNavigation = () => {
        navigate(`/question/${text.id}`)
    }

    return(
        <div className="flex flex-col space-y-3 border-1 p-4 shadow-xl bg-[#FEFEFE] rounded-lg h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[#646464] text-lg font-medium">{text.title}</p>
                    <span 
                        className="text-sm px-2 py-1 rounded-full"
                        style={{
                            backgroundColor: categoryOption.colors.bg,
                            color: categoryOption.colors.text
                        }}
                    >
                        {text.category}
                    </span>
                </div>
                <p className="text-[#646464] text-sm mb-4">{text.title}</p>
            </div>
            <div className="flex space-x-4 items-center">
                <span className="flex items-center space-x-2 text-[#646464]">
                    <CiHeart color="red"/> {text.likes}
                </span>
                <span className="flex items-center space-x-2 text-[#646464]">
                    <LiaCommentSolid color="blue"/> {text.answers}
                </span>
                <span className="flex items-center space-x-2 text-[#646464]">
                    <CiClock1 /> {text.timeCreated}
                </span>
            </div>
            <button onClick={handleNavigation} className="flex justify-center items-center bg-[#101726] p-3 text-white hover:bg-[#1c2a43] transition-colors cursor-pointer rounded-md">
                <div className="flex space-x-6 justify-center items-center">
                    <BsReply />
                    <span>Respond</span>
                </div>
            </button>
        </div>
    )
}

export default TextCard;