import { useState } from 'react';
import { FaEye, FaEyeSlash, FaUserNinja, FaUserPlus } from 'react-icons/fa';
import useUserStore from '../../stores/userStore';
import loginSchema from '../../validations/loginSchema.js'
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const LogIn = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" }); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = loginSchema.safeParse({ email, password });
    
    if (!validation.success) {
      const errorMessages = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }

    const data = { email, password };
    
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', 
      });
      
      const result = await response.json();
      
      if (response.status === 200) {
        setUser(result.user);
        setToken(result.token);
        
        navigate('/dashboard');
        
        Swal.fire({
          title: "Success",
          text: "You have successfully logged in",
          icon: "success"
        });
      } else {
        Swal.fire({
          title: "Failure",
          text: result.message,
          icon: "error"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failure",
        text: `Internal error: ${error.message || 'Unknown error'}`,
        icon: "error"
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col space-y-4 justify-start items-center p-30">
      <h1 className="!text-2xl font-semibold text-center mb-8">AnswerTube</h1>
      
      <div className='w-full'>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="text"
          id="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="on"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 p-2 rounded bg-red-100 border border-red-500">
            {errors.email}
          </p>
        )}
      </div>
      
      <div className='w-full'>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="on"
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
      
      <Link className='flex w-full justify-end font-bold cursor-pointer' to="/auth/requestNewPassword">
        Forgot password?
      </Link>
      
      <button 
        type="submit"
        className='w-full bg-[#101827] text-[#AAADB2] p-3 rounded !mb-10 hover:text-white'
      >
        Sign in
      </button>
      
      <div className='flex items-center justify-center space-x-2'>
        <FaUserPlus className="text-xl text-[#0F1828]" />
        <span>Don't have an account?</span>
        <Link className='font-bold cursor-pointer' to='/auth/signup'>Sign up</Link>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-gray-600 mt-4">
        <FaUserNinja className="text-xl text-[#0F1828]" />
        <span>Want to try first?</span>
        <p className="text-[#0F1828] font-bold cursor-pointer">Continue as guest</p>
      </div>
    </form>
  );
};

export default LogIn;
