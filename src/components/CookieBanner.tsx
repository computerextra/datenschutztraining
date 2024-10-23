"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasCookie, setCookie } from "cookies-next";

export default function CookieBanner() {
  const [showConsent, setShowConsent] = useState(true);

  useEffect(() => {
    setShowConsent(hasCookie("CookieZustimmung"));
  }, []);

  const acceptCookie = () => {
    setShowConsent(true);
    setCookie("CookieZustimmung", "Zugestimmt", {});
  };

  if (showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-700 bg-opacity-70">
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-gray-100 px-4 py-8">
        <span className="text-dark mr-16 text-base">
          Bitte beachten Sie, dass diese Webseite Cookies nutzt. Diese sind
          Technisch Notwendig, sodass eine Zustimmung nicht erforderlich ist.
          Weitere Informationen finden Sie in unserer{" "}
          <Link href="/Datenschutz" className="text-blue-600 underline">
            Datenschutzerklärung
          </Link>
        </span>
        <button
          className="rounded bg-green-500 px-8 py-2 text-white"
          onClick={acceptCookie}
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}
