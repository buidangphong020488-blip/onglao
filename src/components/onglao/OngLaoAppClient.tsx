"use client";
import React from "react";
import dynamic from "next/dynamic";

const OngLaoAppShell = dynamic(() => import("./OngLaoAppShell"), {
  ssr: false
});

export default function OngLaoAppClient({
  initialPoems = [],
  pageRoute
}: {
  initialPoems?: any[];
  pageRoute?: 'home' | 'livestream' | 'ke-phap' | 'xuong-phim' | 'kich-ban' | 'tao-video';
}) {
  return <OngLaoAppShell initialPoems={initialPoems} pageRoute={pageRoute} />;
}
