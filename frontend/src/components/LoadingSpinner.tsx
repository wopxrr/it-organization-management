import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ fullScreen = false, message = "Memuat..." }: { fullScreen?: boolean; message?: string }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 animate-fadeIn">
      <div className="relative">
        <div className="absolute inset-0 bg-primary-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <Loader2 className="w-14 h-14 text-primary-600 animate-spin relative z-10" />
      </div>
      <p className="text-gray-500 font-semibold tracking-wide">{message}</p>
    </div>
  );
  if (fullScreen) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50">{content}</div>;
  return <div className="flex items-center justify-center py-20">{content}</div>;
}