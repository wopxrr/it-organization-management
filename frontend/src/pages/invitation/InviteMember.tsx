import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Send, Mail, Loader2 } from "lucide-react";
import { invitationsAPI } from "../../api/invitations.api";

export default function InviteMembers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const list = emails.split(/[\n,;]+/).map((x) => x.trim()).filter((x) => x);
    if (!list.length) return toast.error("Enter at least 1 email");
    setLoading(true);
    try {
      const r = await invitationsAPI.invite(Number(id), list);
      const ok = r.data.data.filter((x: any) => x.status === "SUCCESS").length;
      if (ok) { toast.success(`${ok} invitation(s) sent!`); navigate(`/organizations/${id}`); }
      else toast.error("No invitations sent");
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 h-16 flex items-center">
        <button onClick={() => navigate(`/organizations/${id}`)} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Back</button>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div style={{ animation: "slideUp 0.5s ease-out forwards" }}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4"><Mail className="w-8 h-8 text-primary-600" /></div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Invite Members</h1>
            <p className="text-gray-500 mt-2">Send invitations to join your organization</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/80 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Mail className="w-4 h-4 text-primary-500" /> Email Addresses</label>
                <textarea value={emails} onChange={(e) => setEmails(e.target.value)} rows={6} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all" placeholder={"john@example.com\njane@example.com"} required />
                <p className="text-xs text-gray-400 mt-2">Separate multiple emails with commas, semicolons, or new lines</p>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => navigate(-1)} className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold border-2 border-primary-200 shadow-sm hover:shadow-md flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex-1 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send Invites
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}