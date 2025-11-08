import React, { useState } from 'react'
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  Zap,
  ArrowRight,
  User
} from "lucide-react";

import {API_PATHS} from "../../utils/apiPaths";
import {useAuth} from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import{useNavigate} from "react-router-dom";
import { validateEmail, validatePassword } from '../../utils/helper';

const SignUp = () => {

const {login} = useAuth();
const navigate = useNavigate();

  const[formData,setFormData]=useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",

  });
  const [showPassword,setShowPassword]=useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);
  const[isLoading, setIsLoading]=useState(false);
  const[error,setError]=useState("");
  const[success,setSuccess]=useState("");
  const [fieldErrors,setFieldErrors]=useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
  });

  const [touched,setTouched]=useState({
    name:false,
    email:false,
    password:false,
    confirmPassword:false,
  });

  //Validation functions
  const validateName=(name)=>{
if(!name) return "Name is required";
if(name.length <2) return "Name must be at least 2 characters";
if(name.length >50) return "Name must be less than 50 characters";
return "";
  };

  const validateConfirmPassword = (confirmPassword,password)=>{
    if (!confirmPassword) return "Please confirm your password";
    if(confirmPassword !== password) return "Passwords do not match";
    return "";

  };

  const handleInputChange=(e)=>{
    const {name,value}=e.target;
    setFormData((prev)=>({
      ...prev,
      [name]:value,
    }));

    //Real-time validation
    if(touched[name]){
      const newFieldErrors={...fieldErrors};
      if(name === "name"){
        newFieldErrors.name= validateName(value);
      }else if (name ==="email"){
        newFieldErrors.email=validateEmail(value);

      }else if(name === "password"){
        newFieldErrors.password = validatePassword(value);
        //Also revalidate confirm password if it's been touched
        if(touched.confirmPassword){
          newFieldErrors.confirmPassword= validateConfirmPassword(
            formData.confirmPassword,
            value
          );
        }
      } else if (name === "confirmPassword"){
        newFieldErrors.confirmPassword=validateConfirmPassword(
          value,
          formData.password
        )
      }
 setFieldErrors(newFieldErrors);
    }
    if(error) setError("");
  };

  const handleBlur=(e)=>{
    const {name} = e.target;
    setTouched((prev)=>({
      ...prev,
      [name]:true,
    }));


    //Validate on blur
    const newFieldErrors={...fieldErrors};
    if(name === "name"){
      newFieldErrors.name=validateName(formData.name);
    }else if(name ==="email"){
      newFieldErrors.email =validateEmail(formData.email);
    }else if(name === "password"){
      newFieldErrors.password=validatePassword(formData.password);
    }else if (name === "confirmPassword"){
      newFieldErrors.confirmPassword=validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      );
    }
    setFieldErrors(newFieldErrors);
  };




  const isFormValid=()=>{
    const nameError=validateName(formData.name);
    const emailError=validateEmail(formData.email);
    const passwordError=validatePassword(formData.password);
    const confirmPasswordError=validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    return (
      !nameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    );
  };

  const handleSubmit = async()=>{
//Validate all fields before submission
const nameError=validateName(formData.name);
const emailError=validateEmail(formData.email);
const passwordError=validatePassword(formData.password);
const confirmPasswordError=validateConfirmPassword(
  formData.confirmPassword,
  formData.password
);

if(nameError || emailError || passwordError || confirmPasswordError){
  setFieldErrors({
    name:nameError,
    email:emailError,
    password:passwordError,
    confirmPassword:confirmPasswordError,
  });

  setTouched({
    name:true,
    email:true,
    password:true,
    confirmPassword:true,
  });
  return;
}

setIsLoading(true);
setError("");
setSuccess("");

try{

  const response=await axiosInstance.post(
    API_PATHS.AUTH.REGISTER,
    {
      name:formData.name,
      email:formData.email,
      password:formData.password,
    }
  );
  const data=response.data;
  const {token}=data;

  if(response.status === 201){
    setSuccess("Account created successfully");

    //Reset form
    setFormData({
      name:"",
      email:"",
      password:"",
      confirmPassword:"",
    });

    setTouched({
      name:false,
      email:false,
      password:false,
      confirmPassword:false,
    });

    //Login the user immediately after successful registration
    login(data,token);
    navigate("/dashbaord");
  }
}catch(err){
if(err.response && err.response.data && err.response.data.message){
  setError(err.response.data.message);
}else{
  setError("Registration failed,Please try again.");
}
console.error("API error:",err.response || err);
} finally{
  setIsLoading(false);
}
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8 '>
<div className='w-full max-w-sm'>
  {/* header */}
  <div className='text-center mb-8'>
    <div className='relative inline-block mb-6'>
      <div className='w-16 h-16 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/50 transform hover:scale-110 hover:rotate-6 transition-all duration-300'>
        <Zap className='w-8 h-8 text-white fill-white'/>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 blur-md opacity-50" />
    </div>
    <h1 className='text-3xl font-bold text-white mb-2'>
      Create Account
    </h1>
    <p className='text-gray-400 text-sm'>Join InvoiceFlow today</p>
  </div>


  {/* form */}
  <div className='bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl space-y-4'>
    {/* name */}
    <div>
      <label className='block text-sm font-semibold text-gray-300 mb-2'>
        Full Name
      </label>
      <div className='relative'>
        <User className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5  '/>
        <input 
        name="name"
        type="text"
        required
        value={formData.name}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 ${
          fieldErrors.name && touched.name
?"border-red-400 focus:ring-red-500 "
: "border-slate-600 focus:ring-cyan-500 "
        }`}
        placeholder='Enter your full name'
        />

      </div>
      {
        fieldErrors.name && touched.name && (
          <p className='mt-2 text-sm text-red-400'>{fieldErrors.name}</p>
        )
      }
    </div>


    {/* Email */}
    <div>
      <label className='block text-sm font-semibold text-gray-300 mb-2 '>
        Email
      </label>
      <div className='relative'>
        <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5'/>
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
        placeholder='Enter your email'
        />
      </div>
      {fieldErrors.email && touched.email && (
        <p className='mt-2 text-sm text-red-400'>{fieldErrors.email}</p>
      )}
    </div>

    {/* Password */}
    <div>
      <label className='block text-sm font-semibold text-gray-300 mb-2'>
        Password
      </label>
      <div className='relative'>
        <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5'/>
        <input
        name="password"
        type={showPassword ? "text" : "password"}
        required
        value={formData.password}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`w-full pl-12 pr-12 py-3 bg-slate-900/50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 ${
          fieldErrors.password && touched.password
          ? "border-red-400 focus:ring-red-500"
          : "border-slate-600 focus:ring-cyan-500"
        }`}
        placeholder='Create a password'
        />
        <button
        type="button"
        onClick={()=> setShowPassword(!showPassword)}
        className='absolute right-4  top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors'
        >
          {showPassword ? (
            <EyeOff className='w-5 h-5'/>
          ):(
            <Eye className='w-5 h-5'/>
          )}
        </button>
      </div>

      {fieldErrors.password && touched.password && (
        <p className='mt-2 text-sm text-red-400'>
          {fieldErrors.password}
        </p>
      )}
    </div>


    {/* confirm Password */}
    <div>
      <label className='block text-sm font-semibold text-gray-300 mb-2 '>
        Confirm Password
      </label>
      <div className='relative'>
        <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5'/>
        <input
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        required
        value={formData.confirmPassword}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className= {`w-full pl-12 pr-12 py-3 bg-slate-900/50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 ${
         fieldErrors.confirmPassword && touched.confirmPassword
          ? "border-red-400 focus:ring-red-500"
          : "border-slate-600 focus:ring-cyan-500"
        }`}
        placeholder='Confirm your password'
        />
        <button
        type="button"
        onClick={()=> setShowConfirmPassword(!showConfirmPassword)}
        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors '
        >
          {showConfirmPassword ? (
            <EyeOff className='w-5 h-5'/>
          ):(
            <Eye className='w-5 h-5'/>
          )}
        </button>
      </div>
      {fieldErrors.confirmPassword && touched.confirmPassword && (
        <p className='mt-2 text-sm text-red-400'>
          {fieldErrors.confirmPassword}
        </p>
      )}
    </div>

    {/* Error /Success Messages */}

    {
      error && (
        <div className='p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm'>
          <p className='text-red-400 text-sm font-medium'>{error}</p>
          </div>
      )
    }

    {success && (
      <div className='p-4 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm'>
        <p className='text-green-400 text-sm font-medium'>{success}</p>
        </div>
    )}

    {/* Terms & Conditions */}
    <div className='flex items-start pt-2'>
      <input
      type="checkbox"
      id="terms"
      className='w-4 h-4 text-cyan-500 bg-slate-900/50 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2 mt-1 '
      required
      />
      <label htmlFor='terms' className='ml-2 text-sm text-gray-400'>
        I agree to the {" "}
        <button className='text-cyan-400 hover:text-cyan-300 transition-colors '>
          Terms of Service
        </button>{" "}
        and{" "}
        <button className='text-cyan-400 hover:text-cyan-300 transition-colors'>
          Privacy Policy
        </button>
      </label>

    </div>


    {/*Sign Up Button  */}
    <button
    onClick={handleSubmit}
    disabled={isLoading || !isFormValid()}
    className='w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 px-4 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center group hover:scale-105 duration-300'
    >
      {isLoading ? (
        <>
        <Loader2 className='w-5 h-5 mr-2 animate-spin'/>
        Creating account...
        </>
      ):(
        <>
        Create Account
        <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform '/>
        </>
      )}
    </button>
  </div>


  {/* Footer */}
  <div className='mt-6 text-center'>
    <p className='text-sm text-gray-400'>
      Already have an account?{" "}
      <button
      className='text-cyan-400 font-semibold hover:text-cyan-300 transition-colors'
      onClick={()=> navigate("/login")}
      >
        Sign in
      </button>
    </p>
  </div>
</div>
    </div>
  )
}

export default SignUp