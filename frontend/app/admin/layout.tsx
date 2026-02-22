"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      {children}
    </div>
  );
}