import { ReactNode } from "react";

export const metadata = {
  title: "IE Lung Admin Portal",
  description: "Secure administrative management for Inland Empire Lung & Sleep Institute",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {children}
    </div>
  );
}
