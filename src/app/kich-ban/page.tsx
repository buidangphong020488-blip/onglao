"use client";

import React from "react";
import dynamic from "next/dynamic";

const OngLaoAppShell = dynamic(() => import("@/components/onglao/OngLaoAppShell"), {
  ssr: false
});

export default function KichBanRoute() {
  return <OngLaoAppShell pageRoute="kich-ban" />;
}
