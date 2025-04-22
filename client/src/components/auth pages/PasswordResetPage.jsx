import { useState } from 'react';
import { useSearchParams } from "react-router";
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { Link } from "react-router";
import axiosInstance from '../../api/axios';
import Swal from 'sweetalert2';

const PasswordResetPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [verifyPassword, setVerifyPassword] = useState("");
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [errors, setErrors] = useState({ password: "", verifyPassword: "" });
    const [resetSuccess, setResetSuccess] = useState(false);
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const toggleVerifyPasswordVisibility = () => {
        setShowVerifyPassword(!showVerifyPassword);
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }
        
        if (!verifyPassword) {
            newErrors.verifyPassword = "Please confirm your password";
        } else if (password !== verifyPassword) {
            newErrors.verifyPassword = "Passwords do not match";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            // const response = await fetch('http://localhost:3000/resetPassword', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ 
            //         id, 
            //         token, 
            //         password 
            //     }),
            // });

            const response = await axiosInstance.post('/auth/resetPassword',{id,token,password});
            
            if (response.status === 200) {
                setResetSuccess(true);
            } else {
                Swal.fire({
                    title: "Failure",
                    text: response.message,
                    icon: "error"
                  });
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            Swal.fire({
                title: "Failure",
                text: "Internal error",
                icon: "error"
              });
        }
    };
    
    if (resetSuccess) {
        return (
            <div className="w-full h-full flex flex-col space-y-4 justify-center items-center p-30">
                <FaLock className="text-5xl text-green-500 mb-4" />
                <h1 className="text-2xl font-semibold text-center mb-2">Password Reset Successful!</h1>
                <p className="text-center text-gray-600 mb-6">Your password has been successfully reset.</p>
                <Link to="/auth/login" className="w-full bg-[#101827] text-[#AAADB2] p-3 rounded text-center ">
                    Back to Login
                </Link>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full flex flex-col space-y-4 justify-start items-center p-30">
            <h1 className="!text-2xl font-semibold text-center mb-8">Reset Your Password</h1>
            
            <form onSubmit={handleSubmit} className="w-full">
                <div className="w-full mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FaEyeSlash className='cursor-pointer'/> : <FaEye className='cursor-pointer'/>}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1 p-2 rounded bg-red-100 border border-red-500">
                            {errors.password}
                        </p>
                    )}
                </div>
                
                <div className="w-full mb-6">
                    <label htmlFor="verifyPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showVerifyPassword ? "text" : "password"}
                            id="verifyPassword"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={toggleVerifyPasswordVisibility}
                        >
                            {showVerifyPassword ? <FaEyeSlash className='cursor-pointer'/> : <FaEye className='cursor-pointer'/>}
                        </button>
                    </div>
                    {errors.verifyPassword && (
                        <p className="text-red-500 text-sm mt-1 p-2 rounded bg-red-100 border border-red-500">
                            {errors.verifyPassword}
                        </p>
                    )}
                </div>
                
                <button 
                    type="submit"
                    className="w-full bg-[#101827] text-[#AAADB2] p-3 rounded !mb-10"
                >
                    Reset Password
                </button>
            </form>
            
            <div className="flex items-center justify-center space-x-2">
                <FaLock className="text-xl text-[#0F1828]" />
                <span>Remember your password?</span>
                <Link className="font-bold cursor-pointer" to="/auth/login">Back to login</Link>
            </div>
        </div>
    );
};

export default PasswordResetPage;