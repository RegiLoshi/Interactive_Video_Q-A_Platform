import { useState } from 'react';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import useUserStore from '../../stores/userStore';
import signUpSchema from '../../validations/signUpSchema.js';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const SignUp = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validation = signUpSchema.safeParse(formData);
    
    if (!validation.success) {
      const errorMessages = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }

    const { confirmPassword: _, ...dataToSend } = formData;
    
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
        credentials: 'include',
      });
      const result = await response.json();
      
      if (response.status === 201) {
        setUser(result.user);
        setToken(result.token);
        await Swal.fire({
          title: "Success",
          text: "Account created successfully!",
          icon: "success"
        });
        navigate('/dashboard');
      } else {
        await Swal.fire({
          title: "Error",
          text: result.message || "Something went wrong",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      await Swal.fire({
        title: "Error",
        text: "An error occurred while creating your account",
        icon: "error"
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col space-y-4 justify-start items-center p-30">
      <h1 className="!text-2xl font-semibold text-center mb-8">Create Account</h1>
      
      <div className='w-full'>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 p-2 rounded bg-red-100 border border-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div className='w-full'>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Doe"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1 p-2 rounded bg-red-100 border border-red-500">
            {errors.lastName}
          </p>
        )}
      </div>
      
      <div className='w-full'>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
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
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
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

      <div className='w-full'>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1 p-2 rounded bg-red-100 border border-red-500">
            {errors.confirmPassword}
          </p>
        )}
      </div>
      
      <button 
        type="submit"
        className='w-full bg-[#101827] text-[#AAADB2] p-3 rounded !mb-10 hover:text-white'
      >
        Sign up
      </button>
      
      <div className='flex items-center justify-center space-x-2'>
        <FaUserPlus className="text-xl text-[#0F1828]" />
        <span>Already have an account?</span>
        <Link className='font-bold cursor-pointer' to='/auth/login'>Sign in</Link>
      </div>
    </form>
  );
};

export default SignUp;
