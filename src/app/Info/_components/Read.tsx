"use client";

import BackButton from "@/components/BackButton";
import LoadingPage from "@/components/LoadingPage";
import { api } from "@/trpc/react";
import {
  AdmonitionDirectiveDescriptor,
  directivesPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export default function Read({ id }: { id: string }) {
  const info = api.info.get.useQuery({ id });

  if (info.isLoading) return <LoadingPage />;
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
          markdown={info.data.body}
          plugins={[
            imagePlugin({
              imageUploadHandler: () => {
                return Promise.resolve("https://picsum.photos/200/300");
              },
            }),
            directivesPlugin({
              directiveDescriptors: [AdmonitionDirectiveDescriptor],
            }),
            headingsPlugin(),
            quotePlugin(),
            listsPlugin(),
            thematicBreakPlugin(),
            linkDialogPlugin(),
            tablePlugin(),
            markdownShortcutPlugin(),
          ]}
        />
      )}
    </>
  );
}
