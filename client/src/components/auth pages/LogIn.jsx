import { useState } from 'react';
import { FaEye, FaEyeSlash, FaUserNinja, FaUserPlus } from 'react-icons/fa';
import useUserStore from '../../stores/userStore';
import loginSchema from '../../validations/loginSchema.js'
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import axiosInstance from '../../api/axios';

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
    
    try {
      const { data } = await axiosInstance.post('auth/login', { email, password });

      setUser(data.user);
      setToken(data.token);
      
      navigate('/dashboard');
      
      Swal.fire({
        title: "Success",
        text: "You have successfully logged in",
        icon: "success"
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failure",
        text: error.response?.data?.message || "An error occurred",
        icon: "error"
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">SurveyHub</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="text"
                id="email"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:text-sm"
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
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:text-sm"
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

            <div className="flex items-center justify-between">
              <Link className="text-sm font-medium text-blue-600 hover:text-blue-500" to="/auth/requestNewPassword">
                Forgot password?
              </Link>
            </div>

            <div>
              <button 
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#101827] hover:bg-[#0a0f1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm">
              <FaUserPlus className="text-xl text-[#0F1828]" />
              <span className="text-gray-600">Don't have an account?</span>
              <Link className="font-medium text-blue-600 hover:text-blue-500" to='/auth/signup'>Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
