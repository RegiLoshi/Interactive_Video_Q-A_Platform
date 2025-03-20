import { useState } from 'react';
import { Link } from "react-router";
import { FaEye, FaEyeSlash, FaUserNinja, FaUserPlus } from 'react-icons/fa';
import signUpSchema from '../../validations/signUpSchema';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import "react-datepicker/dist/react-datepicker.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" }); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = signUpSchema.safeParse({ name, lastName, email, password, dateOfBirth });
    console.log(validation.error)

    console.log(validation)
    
    if (!validation.success) {
      const errorMessages = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }


    const data = { name, lastName, email, password, dateOfBirth };
    
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      console.log(result);
      if (response.status == 200) {
        alert("Successful!");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col space-y-4 justify-start items-center p-30">
      <h1 className="!text-2xl font-semibold text-center mb-8">AnswerTube</h1>

      <div className='w-full'>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="on"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Doe"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="on"
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

      <div className='w-full'>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input 
          id="dateOfBirth"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="date" 
          value={dateOfBirth} 
          onChange={(e) => setDateOfBirth(e.target.value)} 
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-sm mt-1 p-2 rounded bg-red-100 border border-red-500">
            {errors.dateOfBirth}
          </p>
        )}
      </div>
      
      <button 
        type="submit"
        className='w-full bg-[#101827] text-[#AAADB2] p-3 rounded !mb-10 hover:text-white '
      >
        Sign Up
      </button>
      
      <div className='flex items-center justify-center space-x-2'>
        <FaUserPlus className="text-xl text-[#0F1828]" />
        <span>Already have an account?</span>
        <Link className='font-bold cursor-pointer' to='/auth/login'>Sign In</Link>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-gray-600 mt-4">
        <FaUserNinja className="text-xl text-[#0F1828]" />
        <span>Want to try first?</span>
        <p className="text-[#0F1828] font-bold cursor-pointer">Continue as guest</p>
      </div>
    </form>
  );
};

export default SignUp;
