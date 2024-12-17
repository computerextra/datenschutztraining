"use client";

import useAccept from "@/hooks/useAccept";

export default function AcceptTestPage() {
  const { allowed, done } = useAccept();

  if (!allowed && done) {
    window.location.replace("https://datenschutz.computer-extra.com/");
  }
  if (allowed && done) return <></>;
}
