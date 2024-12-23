"use client";

import { Button } from "@/components/ui/button";
import { file2Base64 } from "@/Helper/ConvertFile";
import { api } from "@/trpc/react";
import { FileImage, Upload } from "lucide-react";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";

export default function UploadFile() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const saveFile = api.file.create.useMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (selectedFiles.length > 0) {
      const files = [...selectedFiles];
      files.forEach((file) => {
        void (async () => {
          const b64 = await file2Base64(file);
          await saveFile.mutateAsync({
            file: b64,
            name: file.name,
          });
        })();
        setSelectedFiles([]);
        location.reload();
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files == null) return;
    const newFilesArray = Array.from(files);
    processFiles(newFilesArray);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (filesArray: File[]) => {
    const newSelectedFiles = [...selectedFiles];
    let hasError = false;
    filesArray.forEach((file) => {
      if (newSelectedFiles.some((f) => f.name === file.name)) {
        setError("Filenames must be unique");
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });
    if (!hasError) {
      setError("");
      setSelectedFiles(newSelectedFiles);
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current == null) return;
    fileInputRef.current.click();
  };

  const handleFileDelete = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-5xl rounded-lg p-8 shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            className="flex min-h-[23rem] flex-col items-center justify-center space-y-4 rounded-3xl border-4 border-dashed p-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e)}
          >
            <Upload className="mb-2 h-24 w-24" />

            <p className="text-lg font-semibold">Drag and Drop the files</p>
            <p className="text-lg font-bold">or</p>
            <Button onClick={handleFileButtonClick}>Upload Files</Button>
            <input
              type="file"
              id="files"
              name="files"
              multiple
              accept="pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              onClick={(event) => {
                // Reset the input value to allow selecting the same file again
                // @ts-expect-error just test
                event.target.value = null;
              }}
            />
          </div>

          <div className="max-h-[23rem] overflow-auto rounded-3xl border-2 border-gray-300 py-4">
            {selectedFiles.length > 0 ? (
              <ul className="px-4">
                {selectedFiles.map((file, index) => (
                  <li
                    key={file.name}
                    className="flex items-center justify-between border-b py-2"
                  >
                    <div className="flex items-center">
                      <FileImage className="mr-2 h-8 w-8" />
                      <span className="text-base">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileDelete(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-6 w-6"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M6 4l8 8M14 4l-8 8"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-lg font-semibold text-gray-500">
                  No Files Uploaded Yet
                </p>
              </div>
            )}
          </div>
        </div>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <div className="mt-8 flex justify-center">
          <Button onClick={handleSubmit}>Hochladen</Button>
        </div>
      </div>
    </div>
  );
}
