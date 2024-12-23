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
import type { FileResponse } from "@/server/api/routers/files";
import { FilePenLine } from "lucide-react";

function FilePrev({ src }: { src: FileResponse }) {
  const [open, setOpen] = useState(false);
  const deleteFile = api.file.delete.useMutation();

  const handleDelete = async () => {
    await deleteFile.mutateAsync({ fileName: src.name });
    location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-center">
          <FilePenLine className="h-20 w-20" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1500px]">
        <DialogTitle>
          <p className="line-clamp-1">{src.name}</p>
        </DialogTitle>
        <embed
          src={src.src}
          type="application/pdf"
          className="h-[75vh] w-full"
        />
        <DialogFooter>
          <Button
            size={"sm"}
            onClick={() => navigator.clipboard.writeText(src.src)}
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

export default function Browser() {
  const files = api.file.getAll.useQuery();

  if (files.isLoading) return <>Loading</>;
  if (files.isError) return <>Error</>;

  return (
    <>
      <FileBrowser className="mt-12">
        {files.data?.map((file) => (
          <FileBrowserFile
            key={file.id}
            Content={<FilePrev src={file} />}
            Title={file.name}
          />
        ))}
      </FileBrowser>
    </>
  );
}
