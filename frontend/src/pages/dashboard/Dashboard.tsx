import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, Plus, Building2, Users, Mail, ChevronRight, LayoutDashboard, Loader2, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { organizationsAPI } from "../../api/organizations.api";
import type { Organization } from "../../types";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { const r = await organizationsAPI.getAll(); setOrganizations(r.data.data || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const stats = [
    { icon: Building2, label: "Organizations", value: organizations.length, gradient: "from-primary-500 to-primary-600", bg: "bg-primary-100" },
    { icon: Users, label: "Total Members", value: organizations.reduce((s, o) => s + (o.memberCount || 0), 0), gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-100" },
    { icon: Mail, label: "Pending Invites", value: "0", gradient: "from-amber-500 to-orange-600", bg: "bg-amber-100" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
        <p className="text-gray-500 font-semibold">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar-lg"><LayoutDashboard className="w-8 h-8" /></div>
            <div>
              <h1 className="text-xl font-bold text-gradient">IT Org Manager</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
              <div><p className="text-sm font-semibold">{user?.name}</p><p className="text-xs text-gray-400">{user?.email}</p></div>
            </div>
            <button onClick={() => { logout(); toast.success("Logged out"); navigate("/login"); }} className="btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="animate-slideUp">
          <h2 className="text-4xl font-extrabold text-gradient">Welcome back, {user?.name}! 👋</h2>
          <p className="text-gray-500 mt-2 text-lg">Here's what's happening with your organizations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="card-stat group cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${s.bg}`}>
                  <s.icon className={`w-6 h-6 bg-gradient-to-br ${s.gradient} bg-clip-text text-transparent`} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition-colors" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mt-4">{s.value}</p>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="animate-slideUp" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Organizations</h3>
            <button onClick={() => navigate("/organizations/create")} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Organization
            </button>
          </div>

          {organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <div key={org.id} onClick={() => navigate(`/organizations/${org.id}`)} className="card cursor-pointer group hover:border-primary-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">🏢</div>
                    <span className={org.role === "OWNER" ? "badge-owner" : "badge-member"}>{org.role}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{org.name}</h4>
                  {org.description && <p className="text-gray-500 text-sm line-clamp-2 mb-4">{org.description}</p>}
                  <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {org.memberCount || 0} members</span>
                    <span>{new Date(org.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-glass text-center py-20">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Organizations Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Create your first organization to start managing members and sending invitations.</p>
              <button onClick={() => navigate("/organizations/create")} className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Create First Organization
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}