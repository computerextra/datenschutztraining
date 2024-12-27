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
import type { Question } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Aufgabe({ id }: { id: string }) {
  const A = api.aufgaben.get.useQuery({ id });
  const [correct, setCorrect] = useState<number>(0);
  const [fragen, setFragen] = useState<Question[] | undefined>(undefined);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (A.data == null) return;

    // Shuffle Questions
    const newArr = A.data.questions.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand]!, newArr[i]!];
    }
    setFragen(newArr);
  }, [A.data]);

  if (A.isLoading) return <>Loading</>;
  if (A.isError) return <>Fehler</>;

  return (
    <>
      <h1 className="mb-8">{A.data?.title}</h1>
      <h2 className="mb-2 font-semibold text-primary">
        Achtung: Beim aktualisieren oder verlassen der Seite wird der
        Fortschritt nicht gespeichert. Bitte immer die komplette Aufgabe mit
        allen Fragen machen, damit gespeichert wird.
      </h2>
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
            }}
          >
            Aufgabe Starten
          </Button>
        </>
      )}
    </>
  );
}
