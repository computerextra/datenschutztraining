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
import type { Answer, Question } from "@prisma/client";
import { useEffect, useState } from "react";
import Frage from "./Frage";

export default function Aufgabe({ id }: { id: string }) {
  const A = api.aufgaben.get.useQuery({ id });
  const Done = api.aufgaben.markDone.useMutation();
  const [correct, setCorrect] = useState<number>(0);
  const [fragen, setFragen] = useState<
    (Question & { anwers: Answer[] | null })[] | undefined
  >(undefined);
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[] | undefined>(
    undefined,
  );

  useEffect(() => {
    if (A.data == null) return;
    setLoading(true);

    // Shuffle Questions
    const newArr = A.data.questions.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand]!, newArr[i]!];
    }
    setFragen(newArr);
    setLoading(false);
  }, [A.data]);

  if (A.isLoading) return <>Loading</>;
  if (A.isError) return <>Fehler</>;

  const handleCheck = () => {
    if (fragen == null) return;
    if (selectedAnswers == null) return;

    let correct = false;
    selectedAnswers.forEach((x) => {
      if (x.correct) correct = true;
      else correct = false;
    });

    if (correct) {
      setCorrect((prev) => (prev += 1));
    }

    // Go to next Question
    if (current < fragen?.length - 1) {
      setCurrent((prev) => (prev += 1));
    } else {
      setFinished(true);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setStarted(false);
    const res = await Done.mutateAsync({ id });
    if (res) {
      setDone(true);
    }
    setLoading(false);
  };

  const handleCertificate = async () => {
    setLoading(true);
    // TODO: Zertifikat generieren und Download starten
    setLoading(false);
  };

  return (
    <>
      <h1 className="mb-8">{A.data?.title}</h1>
      {loading ? (
        <>Loading</>
      ) : (
        <>
          <h2 className="mb-2 font-semibold text-primary">
            Achtung: Beim aktualisieren oder verlassen der Seite wird der
            Fortschritt nicht gespeichert. Bitte immer die komplette Aufgabe mit
            allen Fragen machen, damit gespeichert wird. Der Zurückknopf im
            Browser funktioniert hier nicht und bricht die Aufgabe komplett ab!
          </h2>
          {!started && !done && !finished && (
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
          {started && !done && !finished && fragen && (
            <div className="mx-20 my-6">
              <p>
                Frage {current + 1} von {fragen?.length}
              </p>
              <Frage
                Answers={fragen[current]!.anwers}
                Question={fragen[current]}
                setSelectedAnswers={setSelectedAnswers}
              />
              <Button onClick={handleCheck} className="mt-3">
                Antwort Absenden
              </Button>
            </div>
          )}
          {finished && !done && (
            <>
              <h2 className="mt-4">
                Du hast {correct} von {fragen?.length} Antworten richtig
              </h2>
              {correct == fragen?.length ? (
                <>
                  <h3 className="mt-4">
                    Herzlichen Glückwunsch, du hast bestanden.
                  </h3>
                  <Button className="mt-4" onClick={handleSave}>
                    Fortschritt speichern
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="mt-4">Du hast leider nicht Bestanden.</h3>
                  <Button className="mt-4" onClick={() => location.reload()}>
                    Neu Starten
                  </Button>
                </>
              )}
            </>
          )}
          {done && (
            <Button onClick={handleCertificate}>Zertifikat runterladen</Button>
          )}
        </>
      )}
    </>
  );
}
