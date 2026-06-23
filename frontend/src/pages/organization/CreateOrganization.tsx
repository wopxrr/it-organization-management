import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, Building2, FileText, Plus, Loader2 } from "lucide-react";
import { organizationsAPI } from "../../api/organizations.api";
import type { CreateOrganizationData } from "../../types";

export default function CreateOrganization() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateOrganizationData>();

  const onSubmit = async (d: CreateOrganizationData) => {
    setLoading(true);
    try { await organizationsAPI.create(d); toast.success("Organization created!"); navigate("/dashboard"); }
    catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 h-16 flex items-center">
        <button onClick={() => navigate("/dashboard")} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Back</button>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div style={{ animation: "slideUp 0.5s ease-out forwards" }}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4"><Building2 className="w-8 h-8 text-primary-600" /></div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Create Organization</h1>
            <p className="text-gray-500 mt-2">Set up your new IT organization</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/80 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Building2 className="w-4 h-4 text-primary-500" /> Name</label>
                <input type="text" {...register("name", { required: "Required", minLength: { value: 3, message: "Min 3 chars" } })} className={`w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all ${errors.name ? "border-red-300" : ""}`} placeholder="e.g., Campus IT Community" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><FileText className="w-4 h-4 text-primary-500" /> Description (Optional)</label>
                <textarea {...register("description")} rows={4} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all" placeholder="Describe your organization..." />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => navigate("/dashboard")} className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold border-2 border-primary-200 shadow-sm hover:shadow-md flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex-1 flex items-center justify-center gap-2">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}