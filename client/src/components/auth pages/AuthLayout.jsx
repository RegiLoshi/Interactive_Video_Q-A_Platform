import { Outlet } from "react-router-dom";
import { FaShieldAlt , FaUsers, FaVideo } from 'react-icons/fa';

const AuthLayout = () => {
    return(
        <div className="flex flex-col lg:flex-row w-full min-h-screen">
            {/* Left side - Hidden on mobile, shown on lg screens */}
            <div className="hidden lg:flex bg-[#0F1828] min-h-screen w-full lg:w-[50%] flex-col justify-center px-16">
                <section className="flex flex-col space-y-8">
                    <h1 className="title text-4xl">SurveyHub</h1>
                    <h3 className="secondary-text text-lg">Join our community of knowledge sharers and start meaningful conversations today.</h3>
                    <ul className="space-y-6 mt-4">
                        <li className="flex items-center space-x-4 text-[#9297A0]">
                            <div className="bg-[#1c2430] p-3 rounded-full">
                                <FaShieldAlt className="text-white" />
                            </div>
                            <span className="third-text">Enterprise-grade security</span>
                        </li>
                        <li className="flex items-center space-x-4 text-[#9297A0]">
                            <div className="bg-[#1c2430] p-3 rounded-full">
                                <FaUsers className="text-white" />
                            </div>
                            <span className="third-text">Join 10,000+ creators</span>
                        </li>
                        <li className="flex items-center space-x-4 text-[#9297A0]">
                            <div className="bg-[#1c2430] p-3 rounded-full">
                                <FaVideo className="text-white" />
                            </div>
                            <span className="third-text">Create engaging content</span>
                        </li>
                    </ul>
                </section>
            </div>

            {/* Right side - Full width on mobile, half width on lg screens */}
            <div className='w-full lg:w-[50%] min-h-screen flex flex-col justify-between'>
                <div className="flex-1 flex items-center justify-center">
                    <Outlet />
                </div>
                <footer className="text-[#0F1828] text-center py-4">
                    <p>&copy; {new Date().getFullYear()} SurveyHub All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}

export default AuthLayout;