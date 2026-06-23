import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import type { LoginCredentials } from "../../types";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const onSubmit = async (d: LoginCredentials) => {
    setLoading(true);
    try {
      await login(d.email, d.password);
      toast.success("Welcome back! 👋");
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#0f172a] text-slate-200">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 flex flex-col gap-8"
      >
        {/* Header section */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-violet-200">
              Welcome Back
            </h1>
            <p className="text-slate-400 font-medium">
              Sign in to continue to DevOrg
            </p>
          </div>
        </div>

        {/* Form section */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
              <div className={`flex items-center gap-3 bg-slate-900/80 border ${errors.email ? 'border-red-500/50 focus-within:border-red-500 focus-within:ring-red-500/20' : 'border-slate-700 focus-within:border-indigo-500 focus-within:ring-indigo-500/20'} rounded-xl px-4 py-3.5 transition-all focus-within:ring-4 group`}>
                <Mail className={`w-5 h-5 flex-shrink-0 ${errors.email ? 'text-red-400' : 'text-slate-500 group-focus-within:text-indigo-400'} transition-colors`} />
                <input 
                  type="email" 
                  {...register("email", { required: "Email is required" })} 
                  className="w-full bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-600 text-base" 
                  placeholder="you@example.com" 
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs ml-1 font-medium">
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-slate-300">Password</label>
                <a href="#" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <div className={`flex items-center gap-3 bg-slate-900/80 border ${errors.password ? 'border-red-500/50 focus-within:border-red-500 focus-within:ring-red-500/20' : 'border-slate-700 focus-within:border-indigo-500 focus-within:ring-indigo-500/20'} rounded-xl px-4 py-3.5 transition-all focus-within:ring-4 group`}>
                <Lock className={`w-5 h-5 flex-shrink-0 ${errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-indigo-400'} transition-colors`} />
                <input 
                  type={show ? "text" : "password"} 
                  {...register("password", { required: "Password is required" })} 
                  className="w-full bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-600 text-base" 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShow(!show)} className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors outline-none">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs ml-1 font-medium">
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="mt-2 w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-xl py-4 font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 group"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center flex justify-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors ml-1">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}