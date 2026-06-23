import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, Plus, Building2, Users, Mail, LayoutDashboard, Loader2, ArrowUpRight, Zap, Globe, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { organizationsAPI } from "../../api/organizations.api";
import type { Organization } from "../../types";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);
  const loadData = async () => { try { const r = await organizationsAPI.getAll(); setOrganizations(r.data.data || []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const stats = [
    { icon: Building2, label: "Organizations", value: organizations.length, color: "from-blue-500 to-blue-600", bg: "bg-blue-100", iconColor: "text-blue-600" },
    { icon: Users, label: "Total Members", value: organizations.reduce((s, o) => s + (o.memberCount || 0), 0), color: "from-emerald-500 to-teal-600", bg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { icon: Mail, label: "Pending Invites", value: "0", color: "from-amber-500 to-orange-600", bg: "bg-amber-100", iconColor: "text-amber-600" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center">
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <Loader2 className="w-24 h-24 text-blue-500 animate-spin relative z-10" />
        </div>
        <p className="text-gray-500 font-semibold text-lg">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DevOrg</h1>
                <p className="text-xs text-gray-400 font-medium">Management Platform</p>
              </div>
            </div>

            {/* User Area */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 bg-white/80 rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => { logout(); toast.success("See you later! 👋"); navigate("/login"); }} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-blue-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">✨ Welcome back</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold">{user?.name}!</h2>
              <p className="text-blue-100 mt-2 text-lg">Ready to manage your organizations today?</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <div key={i} className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.color} opacity-5 rounded-bl-3xl transition-opacity group-hover:opacity-10`}></div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Organizations Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Your Organizations</h3>
              <p className="text-gray-500 text-sm mt-1">Manage all your IT communities</p>
            </div>
            <button 
              onClick={() => navigate("/organizations/create")} 
              className="btn-primary shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <Plus className="w-5 h-5" /> New Organization
            </button>
          </div>

          {organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <div 
                  key={org.id} 
                  onClick={() => navigate(`/organizations/${org.id}`)} 
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl shadow-md border border-blue-200/50">
                        🏢
                      </div>
                    </div>
                    <span className={org.role === "OWNER" ? "badge-owner" : "badge-member"}>
                      {org.role === "OWNER" ? "👑 Owner" : "👤 Member"}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{org.name}</h4>
                  {org.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{org.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {org.memberCount || 0} members</span>
                    <span>{new Date(org.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
              <div className="relative mx-auto w-28 h-28 mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border-2 border-blue-100">
                  <Building2 className="w-12 h-12 text-blue-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Organizations Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">Create your first organization and start building your IT community today!</p>
              <button 
                onClick={() => navigate("/organizations/create")} 
                className="btn-primary text-lg px-8 py-3 shadow-xl shadow-blue-500/20"
              >
                <Plus className="w-5 h-5" /> Create Your First Organization
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}