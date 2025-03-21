import Hero from "./Hero";
import PopularQuestions from "./PopularQuestions";
import Information from "./Information";
import CommunityHero from "./CommunityHero";
const Dashboard = () => {
    return(
        <div>
            <Hero />
            <PopularQuestions />
            <Information />
            <div className="flex flex-col justify-center items-center p-6">
                <CommunityHero />
            </div>
        </div>
    )
}

export default Dashboard;