"use client";

import { Button } from "@/components/ui/button";
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
import { useState } from "react";

export default function Aufgabe({ id }: { id: string }) {
  const A = api.aufgaben.get.useQuery({ id });
  const [correct, setCorrect] = useState<number>(0);
  const [current, setCurrent] = useState<number | undefined>(undefined);
  const [started, setStarted] = useState(false);

  if (A.isLoading) return <>Loading</>;
  if (A.isError) return <>Fehler</>;

  return (
    <>
      <h1 className="mb-8">{A.data?.title}</h1>
      {!started && (
        <>
          {A.data && (
            <MDXEditor
              contentEditableClassName="!text-foreground"
              readOnly
              markdown={A.data.body}
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
          <Button
            className="mt-2"
            onClick={() => {
              setStarted(true);
              setCurrent(0);
            }}
          >
            Aufgabe Starten
          </Button>
        </>
      )}
    </>
  );
}
