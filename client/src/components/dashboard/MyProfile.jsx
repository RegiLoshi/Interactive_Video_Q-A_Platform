import { useParams , Link} from "react-router";
import { FaComment, FaHeart, FaCamera } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import MyQustions from '../questions/MyQuestions'

const MyProfile = () => {
    const {id} = useParams();
    return(
        <div>
            <div className="h-full w-full p-16 bg-[#f8fbfb]">
                <div className="grid grid-cols-3 space-x-4">
                    <div className="flex flex-col justify-center items-start p-8 bg-white space-y-2">
                        <div className="flex justify-between items-center w-full">
                            <span className="text-[#939698] text-lg">Total Questions</span>
                            <FaCamera className="text-2xl"/>
                        </div>
                        <span className="text-2xl ">24</span>
                    </div>
                    <div className="flex flex-col justify-center items-start p-8 bg-white space-y-2">
                        <div className="flex justify-between items-center w-full">
                            <span className="text-[#939698] text-lg">Total Responses</span>
                            <FaComment className="text-2xl"/>
                        </div>
                        <span className="text-2xl ">156</span>
                    </div>
                    <div className="flex flex-col justify-center items-start p-8 bg-white space-y-2">
                        <div className="flex justify-between items-center w-full">
                            <span className="text-[#939698] text-lg">Total Likes</span>
                            <FaHeart className="text-2xl"/>
                        </div>
                        <span className="text-2xl ">894</span>
                    </div>
                </div>
                <div className="flex space-x-4 mt-6">
                    <div className="flex flex-col flex-3 space-y-4">
                        <MyQustions text={"My Questions"}/>
                        <MyQustions text={"Saved questions"}/>
                    </div>
                    <div className="w-72 bg-white rounded-lg p-6 h-[70%]">
                        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
                        <div className="flex flex-col space-y-3">
                            <Link to='askQuestion' className="w-full flex items-center justify-center gap-2 bg-[#101726] text-white py-3 px-4 rounded-lg hover:bg-[#1c2a43] transition-colors">
                                <IoAddOutline className="text-xl" />
                                New Question
                            </Link>
                            <Link to="settings" className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                <IoMdSettings className="text-xl" />
                                Settings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;