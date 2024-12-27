"use client";

import { LoaderPinwheel } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function LoadingPage() {
  return (
    <Alert className="text-primary">
      <LoaderPinwheel className="h-6 w-6 animate-spin" />
      <AlertTitle>Laden ...</AlertTitle>
      <AlertDescription>Dieser Inhalt lädt gerade.</AlertDescription>
    </Alert>
  );
}
