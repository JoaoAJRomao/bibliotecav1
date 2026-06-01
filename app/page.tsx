"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = Cookies.get("user_session");
    if (session) {
      router.push("/livros");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="animate-pulse text-sm text-neutral-500">
        Carregando sessão...
      </div>
    </div>
  );
}
