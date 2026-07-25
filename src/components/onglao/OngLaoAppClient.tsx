"use client";
import React from "react";
import dynamic from "next/dynamic";

const OngLaoAppShell = dynamic(() => import("./OngLaoAppShell"), {
  ssr: false
});

export default function OngLaoAppClient({ initialPoems = [] }: { initialPoems?: any[] }) {
  return <OngLaoAppShell initialPoems={initialPoems} />;
}
