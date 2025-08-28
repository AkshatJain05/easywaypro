import ScrollReveal from "../../component/ScllorAnimation";
import { FcGoogle } from "react-icons/fc"
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function SignUp() {
    return (
        <ScrollReveal from="bottom">
        <div className="h-[90vh] w-full px-5 flex justify-center items-center">
             <form className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-5 sm:px-8 bg-gradient-to-bl from-slate-950 to-slate-900 shadow-sm shadow-slate-600">
            <h1 className="text-gray-100 font-semibold text-3xl mt-10 ">Sign Up</h1>
            <p className="text-gray-200 text-sm mt-2">Please sign up to continue</p>
            
            <div className="flex items-center w-full mt-10 bg-slate-100 border border-yellow-500 h-11 rounded-full overflow-hidden pl-4 gap-2">
                <FaUser className="text-gray-800 h-4 w-5"/>
                   
                <input type="email" placeholder="Name" className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[16px] w-full h-full" required />                 
            </div>

            <div className="flex items-center w-full mt-4 bg-slate-100 border border-yellow-500 h-11 rounded-full overflow-hidden pl-4 gap-2">
                <MdEmail className="text-gray-800 h-9 w-5"/>
                   
                <input type="email" placeholder="Email id" className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[16px] w-full h-full" required />                 
            </div>
        
            <div className="flex items-center mt-4 w-full bg-slate-100 border border-yellow-500 h-11 rounded-full overflow-hidden pl-4 gap-2 mb-5">
               <RiLockPasswordFill className="text-gray-800 h-8 w-5"/>
                <input type="password" placeholder="Password" className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm w-full h-full" required />                 
            </div>
            
        
            <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-slate-950 hover:opacity-90  border-1 border-slate-300 active:scale-[0.96] transition-all">
                Sign Up
            </button>
            <p className="text-gray-200 text-sm mt-3 ">Already have an account?
                 <NavLink className="text-indigo-500 px-2" to="/login">Login</NavLink></p>

            <h1 className="my-5 text-slate-100">OR</h1>
            <button type="button" className="w-full flex items-center gap-2 justify-center my-3 mb-10 bg-white border border-gray-900 py-2.5 rounded-full text-gray-800 active:scale-[0.96] transition-all">
                <FcGoogle className="h-6 w-6"/>
                Log in with Google
            </button>
             </form>
        </div>
        </ScrollReveal>
    );
};

export default SignUp