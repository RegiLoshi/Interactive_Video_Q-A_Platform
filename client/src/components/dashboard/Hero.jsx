import { GoDeviceCameraVideo } from "react-icons/go";
import {Link} from 'react-router-dom'

const Hero = () => {
    return (
        <div className="flex flex-col justify-center items-center space-y-4 bg-[#F9F9FB] py-8 min-h-[30vw]">
            <p className="text-[#1C1C1C] text-4xl font-bold">Share Knowledge Through Video Q&A</p>
            <p className="text-[#777F89] w-[45%] text-center">Create engaging video questions, get thoughtful responses, and build meaningful conversations.</p>
            <div>
                <Link to="/user/12/askQuestion" className="flex items-center justify-around space-x-5 w-full border px-4 py-2 bg-[#101726] rounded-lg text-white hover:bg-[#1c2a43] transition-colors  cursor-pointer">
                <GoDeviceCameraVideo className="mr-4"/>
                Ask your question
                </Link>
            </div>
        </div>
    )
}

export default Hero;