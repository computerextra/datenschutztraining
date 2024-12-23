/* eslint-disable @next/next/no-img-element */
"use client";

import { api } from "@/trpc/react";
import { FileBrowser, FileBrowserFile } from "../../_components/FileBrowser";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ImagePrev({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const deleteImage = api.image.delete.useMutation();

  const handleDelete = async () => {
    await deleteImage.mutateAsync({ fileName: alt });
    location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className="aspect-video h-auto w-full max-w-[150px] rounded-xl object-contain"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1500px]">
        <DialogTitle>
          <p className="line-clamp-1">{alt}</p>
        </DialogTitle>
        <img
          src={src}
          alt={alt}
          className="aspect-video h-auto w-full max-w-[1500px] rounded-xl object-contain"
        />
        <DialogFooter>
          <Button
            onClick={() =>
              navigator.clipboard.writeText(`/Upload/Images/${alt}`)
            }
          >
            Copy Path
          </Button>
          <Button size={"sm"} variant="secondary" onClick={handleDelete}>
            Löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ImageBrowser() {
  const images = api.image.getAll.useQuery();

  if (images.isLoading) return <>Loading</>;
  if (images.isError) return <>Error</>;

  return (
    <>
      <FileBrowser className="mt-12">
        {images.data?.map((img) => (
          <FileBrowserFile
            key={img.id}
            Content={<ImagePrev src={img.src} alt={img.name} />}
            Title={img.name}
          />
        ))}
      </FileBrowser>
    </>
  );
}
