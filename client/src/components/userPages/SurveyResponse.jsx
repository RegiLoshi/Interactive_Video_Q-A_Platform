import React from 'react';
import { useParams } from "react-router"
import { HiArrowLeft} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import video from '../../../assets/videoDummy1.mp4'
const defaultSurvey = {
    title: "Customer Feedback Survey",
    totalResponses: 1,
    submissionDate: "March 15, 2024",
    questions: [
        {
            id: 1,
            text: "How satisfied are you with our service?",
            answer: "Et sint adipisicing est magna id duis pariatur duis et excepteur nulla Lorem excepteur veniam. Mollit eu velit laborum voluptate aliquip qui. Irure ut nisi cupidatat exercitation dolore incididunt minim enim. Dolor pariatur enim exercitation aliquip incididunt eu aliqua anim. Anim cupidatat labore do tempor cillum laborum in. Enim minim et officia aliquip ad fugiat eu magna reprehenderit in in eiusmod. Ullamco cupidatat anim nisi ullamco.Officia occaecat aliquip quis mollit sit sunt nulla irure consequat. Occaecat duis id nisi ea enim eu consequat occaecat deserunt sunt eiusmod. Anim voluptate fugiat Lorem amet elit officia deserunt ut aliquip enim duis adipisicing et. Nisi laborum do laboris irure eiusmod deserunt labore. Irure minim aute cillum et exercitation dolor.Lorem quis cillum ipsum laborum consectetur quis. Reprehenderit excepteur elit proident quis pariatur id amet duis deserunt quis laborum. Cupidatat do aute ipsum sit tempor consectetur ex laboris aliquip. Proident anim ut veniam dolore sint occaecat elit. Ipsum eu ipsum ex Lorem velit dolore sint eiusmod qui enim. Mollit excepteur veniam est veniam et eiusmod sit irure ipsum ex eiusmod nostrud. Ad magna laboris id labore tempor est cupidatat.Enim cupidatat enim consectetur culpa cillum. In esse ex tempor minim sit magna consectetur voluptate labore exercitation id laboris. Exercitation commodo laborum labore et minim aliquip anim aute anim. Esse reprehenderit laboris minim ipsum occaecat dolor. Amet nisi aliquip veniam consectetur laborum nisi elit ut.Enim magna non non voluptate Lorem officia nisi elit exercitation proident veniam nostrud cupidatat. Consequat fugiat et do officia aute irure ea irure officia exercitation qui laborum. Esse voluptate occaecat ut eu incididunt ex Lorem Lorem. Excepteur ipsum occaecat aute aliqua commodo dolor eu do ut occaecat pariatur proident irure sit.Quis sit enim ullamco minim. Deserunt aute officia eu proident incididunt. Do quis amet cillum incididunt mollit ipsum ut nisi tempor veniam minim. Tempor laborum quis dolore anim velit in sint.Voluptate ea labore duis veniam nisi consequat deserunt. Id elit laborum irure veniam. Elit eu mollit et duis cillum ipsum laboris consectetur cillum ullamco nulla pariatur. Officia duis consequat adipisicing dolor magna proident aliqua consectetur officia.Aute minim nisi reprehenderit nulla excepteur ex fugiat occaecat nisi proident dolore. Magna mollit culpa excepteur voluptate culpa cillum aliqua amet labore reprehenderit. Aute nisi est labore dolore ad nulla dolore adipisicing nostrud. Ullamco ipsum nisi qui voluptate nulla ea do et laborum consequat dolor et ea.Enim reprehenderit velit anim sit ullamco laborum. Veniam culpa eiusmod proident laboris. Aute sunt ea minim ad quis veniam dolor sit in irure. Voluptate ex laboris laborum incididunt anim minim nulla eu voluptate pariatur exercitation. Tempor dolore proident adipisicing amet nostrud dolore ex veniam aliqua ullamco.Qui consequat enim do dolor esse magna est occaecat nisi deserunt labore nulla occaecat amet. Ipsum tempor eiusmod dolor id laboris ullamco Lorem. Quis nisi voluptate laboris in nostrud."
        },
        {
            id: 2,
            text: "How likely are you to recommend us to others?",
            answer: "Extremely Likely"
        },
        {
            id: 3,
            text: "What could we improve?",
            answer: "Faster response times"
        },
        {
            id: 4,
            text: "How often do you use our service?",
            answer: "Weekly"
        },
        {
            id: 5,
            text: "What features do you value most?",
            answer: "User-friendly interface and customer support"
        }
    ],
    video: video
};

const SurveyResponse = () => {
    const {surveyId} = useParams();
    const navigate = useNavigate();
    
    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex flex-col space-y-8">
            <div className="flex items-center mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                            bg-white text-gray-700 hover:bg-gray-50 
                            flex items-center gap-2 transition-colors duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="ml-6">
                    <h1 className="text-2xl font-semibold text-gray-800">{defaultSurvey.title}</h1>
                </div>
            </div>

            <span className='text-sm text-[#818488]'>Submitted on {defaultSurvey.submissionDate}</span>

            <div className='flex flex-col space-y-4'>
                <h2 className='text-md font-bold'>Survey Responses</h2>

                {defaultSurvey.questions.map(question => (
                    <div key={question.id} className='flex flex-col p-6 bg-white rounded-lg shadow-sm space-y-3'>
                        <span className="text-gray-700 font-bold">{question.text}</span>
                        <div className="p-4 bg-gray-50 rounded-lg shadow-lg">
                            <span className="text-gray-800">{question.answer}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                {defaultSurvey.video && (
                    <div className='w-full flex flex-col space-y-4 items-start'>
                        <h2 className='font-bold text-xl'>Video</h2>
                        <video controls className="w-full shadow-md">
                            <source src={defaultSurvey.video} type="video/mp4" />
                            </video>
                        </div>
                )}
            </div>


        </div>
    );
}

export default SurveyResponse;