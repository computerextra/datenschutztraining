"use client";

import BackButton from "@/components/BackButton";
import { api } from "@/trpc/react";
import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export default function Read({ id }: { id: string }) {
  const info = api.info.get.useQuery({ id });

  // TODO: Loading Page
  if (info.isLoading) return <>Loading</>;
  // TODO: Error Page
  if (info.isError) return <>Error</>;

  return (
    <>
      <BackButton href="/Info" />
      <h1 className="mb-8">{info.data?.title}</h1>
      {info.data && (
        <MDXEditor
          contentEditableClassName="!text-foreground"
          readOnly
          markdown={info.data?.body}
        />
      )}
    </>
  );
}
