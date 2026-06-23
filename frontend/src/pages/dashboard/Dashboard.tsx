import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Users, Building2, Bell, ArrowRight, LogOut, Loader2, Compass } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import type { Organization } from "../../types";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await api.get('/organizations');
        setOrgs(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load organizations");
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Kalkulasi total member (dummy fallback jika api belum support totalMember)
  const totalMembers = orgs.reduce((acc, org) => acc + (org.memberCount || 1), 0);

  const stats = [
    { name: "My Organizations", value: orgs.length.toString(), icon: Building2, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { name: "Total Members", value: totalMembers.toString(), icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { name: "Pending Invites", value: "0", icon: Bell, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30 font-sans pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-100">DevOrg</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 mr-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-indigo-400 uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight text-slate-200">{user?.name}</span>
                  <span className="text-xs text-slate-500 leading-tight">{user?.email}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors border border-slate-700 hover:border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Welcome Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-slate-800/50 border border-slate-700/50 p-8 sm:p-10 mb-8"
        >
          {/* Decorative blur blobs inside hero */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[200px] h-[200px] bg-violet-500/20 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">{user?.name?.split(' ')?.[0] || 'User'}</span>! 👋
              </h1>
              <p className="text-slate-400 text-lg">
                Manage your IT organizations, collaborate with your team, and grow your community seamlessly.
              </p>
            </div>
            <Link 
              to="/organizations/create" 
              className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              Create Organization
            </Link>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={item}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 flex items-center gap-5 hover:bg-slate-800/60 transition-colors group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Organizations Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-indigo-400" />
            Your Organizations
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Loading your workspaces...</p>
          </div>
        ) : orgs.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {orgs.map((org) => (
              <motion.div key={org.id} variants={item}>
                <Link 
                  to={`/organizations/${org.id}`}
                  className="block bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        org.role === 'OWNER' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {org.role}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{org.name}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                      {org.description || "No description provided for this organization."}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <Users className="w-4 h-4" />
                        <span>{org.memberCount || 1} Members</span>
                      </div>
                      <div className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-slate-800/20 border border-slate-700/50 rounded-3xl border-dashed"
          >
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Compass className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-2">No Organizations Yet</h3>
            <p className="text-slate-400 max-w-md mb-8">
              You haven't joined or created any organizations. Get started by creating your first IT community workspace!
            </p>
            <Link 
              to="/organizations/create" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Organization
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}