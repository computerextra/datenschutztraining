"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
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
  // const deleteImage = api.image.delete.useMutation();
  // const deleteFile = api.file.delete.useMutation();
  // const router = useRouter();

  // const handleDelete = async () => {
  //   if (!props.file && !props.image) return;

  //   if (props.file) {
  //     await deleteFile.mutateAsync({ fileName: props.fileName });
  //     router.push("/Admin/Medien/Dateien");
  //   }

  //   if (props.image) {
  //     await deleteImage.mutateAsync({ fileName: props.fileName });
  //     router.push("/Admin/Medien/Bilder");
  //   }
  // };

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
