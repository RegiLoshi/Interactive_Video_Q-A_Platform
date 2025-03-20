import { HiQuestionMarkCircle } from "react-icons/hi";
import { PiVideoCameraFill } from "react-icons/pi";
import { BsFillChatFill } from "react-icons/bs";

const information = [
    {
        logo: <HiQuestionMarkCircle className="text-7xl"/>,
        title: "Ask Questions",
        description: "Create engaging questions to share with your audience"
    },
    {
        logo: <PiVideoCameraFill className="text-7xl"/>,
        title: "Record Responses",
        description: "Share your knowledge through video or text responses"
    },
    {
        logo: <BsFillChatFill className="text-7xl"/>,
        title: "Engage & Learn",
        description: "Build meaningful conversations and share insights"
    },
]

const Information = () => {
    return(
        <section className="flex flex-col p-8 justify-center items-center bg-[#F8FAFB] w-full h-full space-y-4">
            <span className="text-2xl">How it works?</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4 w-full">
                {information.map(info => {
                    return(
                        <div className="flex flex-col justify-center items-center space-y-4">
                            {info.logo}
                            <span className="text-[#909191]">{info.title}</span>
                            <span className="text-[#BDC1C7] ">{info.description}</span>
                        </div>)
                })}
            </div>
        </section>
    )
}

export default Information;