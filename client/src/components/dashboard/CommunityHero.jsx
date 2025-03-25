import { IoIosArrowForward } from "react-icons/io";
import {Link} from "react-router-dom"
const CommunityHero = () => {
    return(
        <section className="bg-[#101726] h-[50%] w-[80%] flex flex-col justify-center items-center space-y-6 p-8 rounded-2xl">
            <h1 className="text-white">Want to view community's questions?</h1>
            <span className="text-[#707681]">Join our community of knowledge sharers and start meaningful conversations today.</span>
            <button className="bg-[#bfc2c3] p-5 hover:bg-white transition-colors cursor-pointer rounded-xl">
                <Link to="explore" className="text-black flex space-x-2 items-center ">
                    <IoIosArrowForward />
                    Get Started Now
                </Link>
            </button>
        </section>
    )
}

export default CommunityHero;