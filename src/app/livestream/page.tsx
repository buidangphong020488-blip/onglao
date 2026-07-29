"use client";

import React from "react";
import dynamic from "next/dynamic";

const OngLaoAppShell = dynamic(() => import("@/components/onglao/OngLaoAppShell"), {
  ssr: false
});

export default function LivestreamRoute() {
  return <OngLaoAppShell pageRoute="livestream" />;
}
