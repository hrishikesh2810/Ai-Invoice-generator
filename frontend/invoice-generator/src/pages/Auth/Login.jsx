import React, { useState } from 'react'
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  Zap,
  ArrowRight,
} from "lucide-react";

import {API_PATHS} from "../../utils/apiPaths";
import {useAuth} from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import{useNavigate} from "react-router-dom";
import { validateEmail, validatePassword } from '../../utils/helper';

const Login = () => {

  const {login} =useAuth();
  const navigate=useNavigate();

  const[formData,setFormData]=useState({
    email:"",
    password:"",

  });
  const [showPassword,setShowPassword]=useState(false);
  const[isLoading, setIsLoading]=useState(false);
  const[error,setError]=useState("");
  const[success,setSuccess]=useState("");
  const [fieldErrors,setFieldErrors]=useState({
    email:"",
    password:"",
  });

const [touched,setTouched]=useState({
  email:false,
  password:false,
});

const handleInputChange=(e)=>{
  const{name,value}=e.target;
  setFormData((prev)=>({
    ...prev,
    [name]:value,
  }));

  //Real time validation
  if(touched[name]){
    const newFieldErrors={...fieldErrors};
    if(name === "email"){
      newFieldErrors.email=validateEmail(value);

    }else if (name === "password"){
      newFieldErrors.password=validatePassword(value);
    }
    setFieldErrors(newFieldErrors);
  }
  if(error) setError("");
};


const handleBlur=(e)=>{
  const {name}=e.target;
  setTouched((prev)=>({
        ...prev,
    [name]:true,
  }));


  // validate on Blur
  const newFieldErrors={...fieldErrors};
  if(name === "email"){
    newFieldErrors.email=validateEmail(formData.email);
  }else if(name === "password"){
    newFieldErrors.password=validatePassword(formData.password)
  }
  setFieldErrors(newFieldErrors)
};

const isFormValid=()=>{
  const emailError=validateEmail(formData.email);
  const passwordError=validatePassword(formData.password);
  return !emailError && !passwordError && formData.email && formData.password
};

const handleSubmit= async()=>{
const emailError=validateEmail(formData.email);
const passwordError=validatePassword(formData.password);

if(emailError || passwordError){
  setFieldErrors({
    email:emailError,
    password:passwordError,
  });
  setTouched({
    email:true,
    password:true,
  });
  return;
}
setIsLoading(true)
setError("");
setSuccess("");

try{

  const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN,formData);

if(response.status === 200){
  const {token} = response.data;

  if(token){
    setSuccess("Login successful");
    login(response.data,token);

    //Redirect based on role
    setTimeout(()=>{
      window.location.href="/dashboard"
    },2000);
  }
}else{
  setError(response.data.message || "Invalid credentials");
}

}catch(err){
  if(err.response && err.response.data && err.response.data.message){
    setError(err.response.data.message);
  }else{
    setError("An error occurred during login.")
  }

}finally {
  setIsLoading(false);
}
}

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4'>
<div className='w-full max-w-sm'>
  {/* Header */}
  <div className='text-center mb-8'>
    <div className='relative inline-block mb-6'>
      <div className='w-16 h-16 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/50 transform hover:scale-110 hover:rotate-6 transition-all duration-300'>
        <Zap className='w-8 h-8 text-white fill-white'/>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 blur-md opacity-50" />
    </div>
    
    <h1 className='text-3xl font-bold text-white mb-2'>
      Welcome Back
    </h1>

    <p className='text-gray-400 text-sm'>
      Sign in to InvoiceFlow
    </p>
  </div>



  {/* Form */}
  <div className='bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl space-y-5'>
    {/* email */}
 <div>
<label className='block text-sm font-semibold text-gray-300 mb-2'>
  Email
</label>

<div className='relative'>
  <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 '/>
  <input
  name="email"
  type="email"
  required
  value={formData.email}
  onChange={handleInputChange}
  onBlur={handleBlur}
  className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 ${
    fieldErrors.email && touched.email
    ? "border-red-400 focus:ring-red-500"
    : "border-slate-600 focus:ring-cyan-500"
  }`}
  placeholder="Enter your email"
  />
</div>
{fieldErrors.email && touched.email && (
  <p className='mt-2 text-sm text-red-400'>{fieldErrors.email}</p>
)}

</div>





{/* Password */}
<div>
  <label className="block text-sm font-semibold text-gray-300 mb-2">
    Password
  </label>
  <div className='relative'>
    <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5'/>
    <input
    name="password"
    type={showPassword ? "text":"password"}
    required
    value={formData.password}
    onChange={handleInputChange}
    onBlur={handleBlur}
    className={`w-full pl-12 pr-12 py-3 bg-slate-900/50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 ${
      fieldErrors.password && touched.password
      ? "border-red-400 focus:ring-red-500"
      : "border-slate-600 focus:ring-cyan-500"
    }`}
    placeholder="Enter your password"
    />

<button 
type="button"
onClick={()=> setShowPassword(!showPassword)}
className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors'
>
  {showPassword ? (
    <EyeOff className='w-5 h-5'/>

  ):(
    <Eye className='w-5 h-5'/>
  )
}
</button>
  </div>

  {fieldErrors.password && touched.password && (
    <p className='mt-2 text-sm text-red-400'>
      {fieldErrors.password}
    </p>
  )}
</div>


{/* Error/Success Message */}
{
  error && (
    <div className='p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm'>
      <p className='text-red-400 text-sm font-medium'>{error}</p>
      </div>
  )}

  {success && (
    <div className='p-4 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm'>
      <p className='text-green-400 text-sm font-medium'>{success}</p>
      </div>
  )}

 

  {/* Sign In Button */}
  <button
  onClick={handleSubmit}
  disabled={isLoading || !isFormValid()}
  className='w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 px-4 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center group hover:scale-105 duration-300'
  >
    {isLoading ? (
      <>
      <Loader2 className='w-5 h-5 mr-2 animate-spin'/>
      Signing in...
      </>

    ):(
      <>
      Sign in
      <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform'/>

      </>
    ) }
  </button>
    </div>


    {/* // Footer */}
    <div className='mt-6 text-center'>
      <p className='text-sm text-gray-400'>
        Don't have an account?{" "}
        <button 
        className='text-cyan-400 font-semibold hover:text-cyan-300 transition-colors'
        onClick={()=> navigate("/signup")}
        >
          Sign up
        </button>
      </p>
    </div>
 </div>
   </div>
  )}
 
   

export default Login