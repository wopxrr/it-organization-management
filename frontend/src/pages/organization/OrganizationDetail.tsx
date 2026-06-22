import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Users, Mail, Calendar, Shield, Loader2, UserPlus } from "lucide-react";
import { organizationsAPI } from "../../api/organizations.api";
import type { Organization } from "../../types";

export default function OrganizationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) loadData(); }, [id]);

  const loadData = async () => {
    try {
      const [o, m] = await Promise.all([organizationsAPI.getById(Number(id)), organizationsAPI.getMembers(Number(id))]);
      setOrg(o.data.data); setMembers(m.data.data);
    } catch { toast.error("Failed to load"); navigate("/dashboard"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;
  if (!org) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate("/dashboard")} className="btn-ghost"><ArrowLeft className="w-5 h-5" /> Back</button>
        {org.role === "OWNER" && (
          <button onClick={() => navigate(`/organizations/${id}/invite`)} className="btn-primary flex items-center gap-2 text-sm"><UserPlus className="w-4 h-4" /> Invite Members</button>
        )}
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="card-glass p-8 animate-slideUp">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-4xl shadow-lg">🏢</div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900">{org.name}</h1>
              {org.description && <p className="text-gray-500 mt-2">{org.description}</p>}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Created {new Date(org.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {org.memberCount || members.length} members</span>
              </div>
            </div>
            <span className={org.role === "OWNER" ? "badge-owner text-sm px-4 py-2" : "badge-member text-sm px-4 py-2"}><Shield className="w-3 h-3 inline mr-1" />{org.role}</span>
          </div>
        </div>

        <div className="card-glass p-8 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-primary-500" /> Members ({members.length})</h2>
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="avatar">{m.name?.charAt(0)?.toUpperCase() || "?"}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{m.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</p>
                  </div>
                </div>
                <span className={m.role === "OWNER" ? "badge-owner" : "badge-member"}>{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}