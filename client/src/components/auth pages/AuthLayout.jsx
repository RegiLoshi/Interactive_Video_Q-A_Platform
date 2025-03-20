import { Outlet } from "react-router-dom";
import { FaShieldAlt , FaUsers, FaVideo } from 'react-icons/fa';

const AuthLayout = () => {

    return(
    <div className="flex w-full min-h-screen">
        <div className="bg-[#0F1828] min-h-screen w-[50%] flex flex-col justify-center px-16">
                <section className="flex flex-col space-y-8">
                    <h1 className="title text-4xl">AnswerTube</h1>
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
        <div className='w-[50%] h-full flex flex-col justify-between'>
            <Outlet />
            <footer className="color-[#0F1828] text-center py-4 mt-4">
                <p>&copy; {new Date().getFullYear()} AnswerTube All rights reserved.</p>
            </footer>
        </div>
    </div>
    )
}


export default AuthLayout;