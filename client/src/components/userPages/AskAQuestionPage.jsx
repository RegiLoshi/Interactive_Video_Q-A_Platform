import { useState, useCallback } from "react";
import { useParams } from "react-router";
import { CiVideoOn, CiPen } from "react-icons/ci";
import WebcamStreamCapture from "../WebCam"
import { BsUpload } from 'react-icons/bs';
import CATEGORY_OPTIONS from "../../data/Categories.js";

const AskAQuestionPage = () => {
    const {id} = useParams();
    const [step, setStep] = useState(0);
    const [question, setQuestion] = useState("");
    const [isVideo, setIsVideo] = useState(true);
    const [privacyChosen, setPrivacyChosen] = useState(false);
    const [categoryChosen, setCategoryChosen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    
    const progress = (step / 4) * 100;

    const buttonBaseStyle = "w-full p-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 border-2";
    const activeButtonStyle = "bg-[#101726] text-white border-[#101726] shadow-md transform scale-[1.02]";
    const inactiveButtonStyle = "bg-white text-[#101726] border-[#101726] hover:bg-gray-50";

    const handleModeSwitch = useCallback((newIsVideo) => {
        if (isVideo !== newIsVideo) {
            setIsVideo(newIsVideo);
        }
    }, [isVideo]);

    const handleUpload = () => {

    }
    
  return (
        <main className="flex flex-col justify-center items-center p-8 space-y-6">
            <div className="w-[50%] space-y-2">
        <h1 className="text-[#6c6d6c] text-2xl font-bold">Ask a Question</h1>
        <h3 className="text-[#b2b7bc] text-sm">Create your question in just a few steps...</h3>
            </div>

            <div className="w-[50%] space-y-2">
                <div className="flex justify-between items-center">
        <h3 className="text-[#b2b7bc] text-sm">Question Details</h3>
                    <h3 className="text-[#b2b7bc] text-sm">Step {step} of 4</h3>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#101726] transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-center items-center space-y-8 w-[50%] ">
                    <div className="w-full flex flex-col justify-center items-center space-y-4">
                        <span className="text-start w-full text-lg text-[#6d7074]">Your Question</span>
                        <input 
                            type="text" 
                            className="w-full h-full p-2 border shadow-sm border-[#b2b7bc] rounded-lg focus:outline-none focus:border-[#101726] focus:ring-1 focus:ring-[#101726] transition-colors" 
                            placeholder="Type your question here..."
                            onChange={(e) => {
                                setQuestion(e.target.value); 
                                if(question != "" && step == 0) setStep(step + 1); 
                                if(e.target.value == "") setStep(0)
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <span className="text-start w-full text-lg text-[#6d7074]">Choose your question type</span>
                        <div className="w-full flex justify-between items-center space-x-4 mt-4">
                            <button 
                                type="button"
                                className={`${buttonBaseStyle} ${isVideo ? activeButtonStyle : inactiveButtonStyle}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleModeSwitch(true);
                                }}
                            >
                                <CiVideoOn className={`text-xl ${isVideo ? 'text-white' : 'text-[#101726]'}`} />
                                <span className="text-md">Video</span>
                            </button>
                            <button 
                                type="button"
                                className={`${buttonBaseStyle} ${!isVideo ? activeButtonStyle : inactiveButtonStyle}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleModeSwitch(false);
                                }}
                            >
                                <CiPen className={`text-xl ${!isVideo ? 'text-white' : 'text-[#101726]'}`} />
                                <span className="text-md">Text</span>
                            </button>
                        </div>
                    </div>

                    {isVideo && (
                        <WebcamStreamCapture 
                            step={step} 
                            setStep={setStep}
                        />
                    )}

                    {!isVideo && (
                        <div className="w-full h-full">
                            <textarea 
                                type="text" 
                                placeholder="(Optional) Describe your question..." 
                                className="p-4 min-h-[200px] border-2 w-full h-full"
                            />
                        </div>
                    )}

                    <div className="w-full flex flex-col justify-center items-start space-y-4">
                        <h3 className="text-start w-full text-lg text-[#6d7074]">Privacy Settings</h3>

                        <div className="flex items-center space-x-4 w-full p-3 rounded-lg border-2 border-[#101726] hover:bg-gray-50 transition-colors cursor-pointer">
                            <input 
                                type="radio" 
                                id="public" 
                                name="privacy" 
                                value="public"
                                className="w-4 h-4 text-[#101726] border-2 border-[#101726] focus:ring-[#101726]"
                                onClick={() => {if(!privacyChosen){setStep(step + 1);setPrivacyChosen(true)}}}
                            />
                            <label className="text-[#6d7074] text-md cursor-pointer" htmlFor="public">
                                Public so anyone can see it and comment on it
                            </label>
                        </div>

                        <div className="flex items-center space-x-4 w-full p-3 rounded-lg border-2 border-[#101726] hover:bg-gray-50 transition-colors cursor-pointer">
                            <input 
                                type="radio" 
                                id="private" 
                                name="privacy" 
                                value="private"
                                className="w-4 h-4 text-[#101726] border-2 border-[#101726] focus:ring-[#101726]"
                                onClick={() => {if(!privacyChosen){setStep(step + 1);setPrivacyChosen(true)}}}
                            />
                            <label className="text-[#6d7074] text-md cursor-pointer" htmlFor="private">
                                Private so only you and people you share it to can see it
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col w-full space-y-2">
                        <h3 className="text-start w-full text-lg text-[#6d7074]">Category</h3>
                        <div className="relative">
                            <select 
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    if (!categoryChosen && e.target.value !== "") {
                                        setStep(step + 1);
                                        setCategoryChosen(true);
                                    }
                                }}
                                className="w-full p-3 bg-white border-2 border-[#101726] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#101726] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                style={{ 
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23101726'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                <option value="" disabled>Select a category</option>
                                {CATEGORY_OPTIONS.map(category => (
                                    <option
                                        key={category.value}
                                        value={category.value}
                                        className="p-3 text-[#101726] hover:bg-gray-50 cursor-pointer"
                                    >
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button className="cursor-pointer blue-button p-4 rounded-2xl">
                        Publish the question
                    </button>
            </div>
    </main>
  );
};

export default AskAQuestionPage;