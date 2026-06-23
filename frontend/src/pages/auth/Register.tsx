import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { RegisterFormData } from "../../types";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate(); // ← TAMBAHKAN INI
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

  const onSubmit = async (d: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(d.name, d.email, d.password);
      toast.success("Account created!");
      navigate("/dashboard"); // ← TAMBAHKAN INI
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-md w-full relative z-10 animate-slideUp">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-primary-600 text-white shadow-2xl shadow-purple-500/30 mb-6 animate-float">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-gradient">Create Account</h1>
          <p className="text-gray-500 mt-2 font-medium">Join the IT community</p>
        </div>
        <div className="card-glass p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })} className={`input-field pl-12 ${errors.name ? "input-error" : ""}`} placeholder="John Doe" />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" } })} className={`input-field pl-12 ${errors.email ? "input-error" : ""}`} placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={show ? "text" : "password"} {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: "Need uppercase, lowercase & number" } })} className={`input-field pl-12 pr-12 ${errors.password ? "input-error" : ""}`} placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" {...register("confirmPassword", { required: "Please confirm", validate: (v) => v === watch("password") || "Passwords don't match" })} className={`input-field pl-12 ${errors.confirmPassword ? "input-error" : ""}`} placeholder="••••••••" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</> : <><UserPlus className="w-5 h-5" /> Create Account</>}
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}