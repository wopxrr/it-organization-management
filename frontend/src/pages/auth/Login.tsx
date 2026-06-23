import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { LoginCredentials } from "../../types";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); // ← TAMBAHKAN INI
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const onSubmit = async (d: LoginCredentials) => {
    setLoading(true);
    try {
      await login(d.email, d.password);
      toast.success("Welcome back!");
      navigate("/dashboard"); // ← TAMBAHKAN INI
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-md w-full relative z-10 animate-slideUp">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-2xl shadow-primary-500/30 mb-6 animate-float">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-gradient">Welcome Back</h1>
          <p className="text-gray-500 mt-2 font-medium">Sign in to your account</p>
        </div>
        <div className="card-glass p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" {...register("email", { required: "Email is required" })} className={`input-field pl-12 ${errors.email ? "input-error" : ""}`} placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={show ? "text" : "password"} {...register("password", { required: "Password is required" })} className={`input-field pl-12 pr-12 ${errors.password ? "input-error" : ""}`} placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</> : <><LogIn className="w-5 h-5" /> Sign In</>}
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}