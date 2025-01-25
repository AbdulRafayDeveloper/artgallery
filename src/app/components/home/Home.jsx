"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/gallery/image/list");
  }, [router]);

  return null;
}

export default Page;
