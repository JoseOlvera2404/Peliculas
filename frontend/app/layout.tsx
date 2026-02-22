"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return null;

  return (
    <div className="flex min-h-screen">
      {children}
    </div>
  );
}