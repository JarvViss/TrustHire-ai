import AuthGuard from "@/components/auth/AuthGuard";
import UploadBox from "@/components/upload/UploadBox";
import Navbar from "@/components/layout/Navbar";

export default function UploadPage() {
  return (
    <AuthGuard>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <UploadBox />
      </main>
    </AuthGuard>
  );
}
