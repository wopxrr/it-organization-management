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
    catch (e: any) { toast.error(e.response?.data?.message || "Failed to create"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 h-16 flex items-center">
        <button onClick={() => navigate("/dashboard")} className="btn-ghost"><ArrowLeft className="w-5 h-5" /> Back</button>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="animate-slideUp">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-gradient">Create Organization</h1>
            <p className="text-gray-500 mt-2">Set up your new IT organization</p>
          </div>
          <div className="card-glass p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Building2 className="w-4 h-4 text-primary-500" /> Organization Name</label>
                <input type="text" {...register("name", { required: "Name is required", minLength: { value: 3, message: "Min 3 characters" } })} className={`input-field ${errors.name ? "input-error" : ""}`} placeholder="e.g., Campus IT Community" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><FileText className="w-4 h-4 text-primary-500" /> Description (Optional)</label>
                <textarea {...register("description")} rows={4} className="input-field" placeholder="Describe your organization's purpose..." />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => navigate("/dashboard")} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}