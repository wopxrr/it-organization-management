import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { invitationsAPI } from "../../api/invitations.api";

export default function JoinOrganization() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (token) check(); }, [token]);
  const check = async () => { try { const r = await invitationsAPI.getByToken(token!); setOrgName(r.data?.data?.organization?.name || "Organization"); } catch { setError("Invalid or expired invitation"); } finally { setLoading(false); } };
  const accept = async () => { if (!isAuthenticated) { navigate(`/login?redirect=/join/${token}`); return; } setLoading(true); try { await invitationsAPI.accept(token!); toast.success("Successfully joined!"); navigate("/dashboard"); } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); } finally { setLoading(false); } };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4"><div className="text-center max-w-md"><XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" /><h1 className="text-2xl font-extrabold text-gray-900">Invalid Invitation</h1><p className="text-gray-500 mt-2 mb-8">{error}</p><Link to="/dashboard" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg inline-flex items-center gap-2">Go to Dashboard <ArrowRight className="w-4 h-4" /></Link></div></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50 px-4">
      <div className="max-w-md w-full text-center" style={{ animation: "slideUp 0.5s ease-out forwards" }}>
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/80 p-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mb-6"><CheckCircle className="w-10 h-10 text-emerald-500" /></div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Organization Invitation</h1>
          <p className="text-gray-500 mb-8">You've been invited to join <strong className="text-primary-600">{orgName}</strong></p>
          {isAuthenticated ? (
            <button onClick={accept} className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg w-full flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5" /> Accept Invitation</button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Sign in to accept</p>
              <Link to={`/login?redirect=/join/${token}`} className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg w-full block text-center">Sign In</Link>
              <Link to="/register" className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold border-2 border-primary-200 shadow-sm w-full block text-center">Create Account</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}