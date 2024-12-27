"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import React from "react";

type FileBrowserProps = {
  children: React.ReactNode;
  className?: string;
};

function FileBrowser({ children, className = "" }: FileBrowserProps) {
  return (
    <div className={cn(className, "grid grid-cols-6 gap-12")}>{children}</div>
  );
}

type FileBrowserFileProps = {
  Title: string;
  Content: React.ReactNode;
};

function FileBrowserFile(props: FileBrowserFileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1">{props.Title}</CardTitle>
      </CardHeader>
      <CardContent>{props.Content}</CardContent>
    </Card>
  );
}

export { FileBrowser, FileBrowserFile };
