import { useState } from "react";
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { Link } from "react-router";
import { z } from "zod";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axios";

const resetPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
});

const RequestNewPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = resetPasswordSchema.safeParse({ email });
    
    if (!validation.success) {
      const errorMessages = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }
    
    setErrors({ email: '' });
    setIsSubmitting(true);
    
    try {
      // const response = await fetch('http://localhost:3000/requestPassword', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });

      const response = await axiosInstance.post('/auth/requestPassword',{email});

      console.log(response);
      
      if (response.status === 200) {
        setRequestSent(true);
      } else {
        Swal.fire({
          title: "Failure",
          text: response.message,
          icon: "error"
        });
      }
    } catch (error) {
      console.error('Error during password reset request:', error);
      Swal.fire({
        title: "Failure",
        text: "Internal error",
        icon: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (requestSent) {
    return (
      <div className="w-full h-full flex flex-col space-y-4 justify-center items-center p-30">
        <FaEnvelope className="text-5xl text-green-500 mb-4" />
        <h1 className="text-2xl font-semibold text-center mb-2">Check Your Email</h1>
        <p className="text-center text-gray-600 mb-6">
          We've sent password reset instructions to {email}. 
          Please check your inbox and spam folder.
        </p>
        <button 
          onClick={() => setRequestSent(false)} 
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          <FaArrowLeft /> Send to a different email
        </button>
        <Link to="/auth/login" className="w-full bg-[#101827] text-[#AAADB2] p-3 rounded text-center mt-4">
          Back to Login
        </Link>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex flex-col space-y-4 justify-start items-center p-30">
      <h1 className="!text-2xl font-semibold text-center mb-8">Reset Your Password</h1>
      <p className="text-gray-600 text-center mb-6">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center">
        <div className='w-full mb-6'>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="text"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="on"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaEnvelope />
            </span>
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 p-2 rounded bg-red-100 border border-red-500">
              {errors.email}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className='w-full bg-[#101827] text-[#AAADB2] p-3 rounded !mb-10 disabled:opacity-70'
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
        </button>
        
        <div className="flex items-center justify-center space-x-2">
          <FaArrowLeft className="text-xl text-[#0F1828]" />
          <span>Remember your password?</span>
          <Link className="font-bold cursor-pointer" to="/auth/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
};

export default RequestNewPassword;