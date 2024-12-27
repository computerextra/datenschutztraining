"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Answer, Question } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";

export default function Frage({
  Question,
  Answers,
  setSelectedAnswers,
}: {
  Question: Question | undefined | null;
  Answers: Answer[] | undefined | null;
  setSelectedAnswers: Dispatch<SetStateAction<Answer[] | undefined>>;
}) {
  if (Question == null) return <>Frage wurde nicht gefunden</>;
  if (Answers == null) return <>Antwortmöglichkeiten wurden nicht gefunden</>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{Question.question}</CardTitle>
        <CardDescription>
          {Question.answer_type === "ONE"
            ? "Diese Frage erfordert genau eine Antwort"
            : Question.answer_type === "MULTI"
              ? "Diese Frage ist Multiple Choice"
              : "Diese Frage setzt auf Freitext"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Question.answer_type === "ONE" && (
          <RadioGroup
            onValueChange={(e) => {
              const x = Answers.find((y) => y.id === e);
              if (x) {
                setSelectedAnswers([x]);
              }
            }}
          >
            {Answers.map((x) => (
              <div key={x.id} className="flex items-center space-x-2">
                <RadioGroupItem value={x.id} id={x.id} />
                <Label htmlFor={x.id}>{x.title}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {Question.answer_type === "MULTI" && (
          <div className="space-y-2">
            {Answers.map((x) => (
              <div className="flex items-center space-x-2" key={x.id}>
                <Checkbox
                  id={x.id}
                  onCheckedChange={() =>
                    setSelectedAnswers((prev) => {
                      if (prev == null) return [x];
                      else return [...prev, x];
                    })
                  }
                />
                <label
                  htmlFor={x.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {x.title}
                </label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
