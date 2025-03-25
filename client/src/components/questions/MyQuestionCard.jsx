import { CiHeart } from "react-icons/ci";
import { LiaCommentSolid } from "react-icons/lia";
import { IoEyeOutline } from "react-icons/io5";
import { BsPlayCircle, BsThreeDotsVertical } from "react-icons/bs";
import { FiShare2 } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";

const MyQuestionCard = ({ question = {} }) => {
    const {
        url = '',
        category = 'Uncategorized',
        title = '',
        likes = 0,
        answers = 0,
        timeCreated = '',
        response_type = 'text',
        isPublic = false
    } = question || {};

    if (!question) {
        return null;
    }

    console.log(question);

    return (
        <div className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b transition-colors">
            <div className="relative w-48 h-28 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {response_type === "video" ? (
                    <>
                        <video 
                            src={url} 
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                            controls
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <BsPlayCircle className="w-10 h-10 text-white" />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 space-y-2">
                        <HiOutlineDocumentText className="w-8 h-8" />
                        <span className="text-xs font-medium">Text Question</span>
                    </div>
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{title}</h3>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            <BiCategory className="text-gray-400" /> {category}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <CiHeart className="w-5 h-5" /> {likes}
                    </span>
                    <span className="flex items-center gap-1">
                        <LiaCommentSolid className="w-5 h-5" /> {answers}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                        {timeCreated}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            isPublic 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                            {isPublic ? 'Public' : 'Private'}
                        </span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiShare2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <BsThreeDotsVertical className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default MyQuestionCard;