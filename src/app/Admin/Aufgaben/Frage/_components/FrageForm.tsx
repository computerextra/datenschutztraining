"use client";

import LoadingPage from "@/components/LoadingPage";
import {
  MultiSelect,
  type MultiSelectOptionProps,
} from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string(),
  question: z.string(),
  type: z.enum(["FREE", "MULTI", "ONE"]),
  antwortenIds: z.array(z.string()),
  aufgabenId: z.string().optional(),
});

export default function FrageForm({ id }: { id: string | undefined }) {
  const Anlegen = api.fragen.create.useMutation();
  const Update = api.fragen.update.useMutation();
  const Delete = api.fragen.delete.useMutation();
  const [options, setOptions] = useState<MultiSelectOptionProps[]>([]);
  const Anworten = api.antwort.getAll.useQuery();
  const Frage = api.fragen.get.useQuery({ id: id ?? "" });

  const aufgabenIds: string[] = [];

  if (Frage?.data?.anwers) {
    Frage?.data?.anwers.map((x) => {
      aufgabenIds.push(x.id);
    });
  }

  useEffect(() => {
    if (Anworten.data == null) return;
    const options: MultiSelectOptionProps[] = [];
    Anworten.data.forEach((x) => {
      options.push({
        label: x.title,
        value: x.id,
      });
    });
    setOptions(options);
  }, [Anworten.data]);

  useEffect(() => {
    if (Frage.data == null) return;
    form.reset({
      title: Frage?.data?.title,
      question: Frage?.data?.question,
      antwortenIds: aufgabenIds,
      type: Frage?.data?.answer_type,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Frage.data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: Frage?.data?.title,
      question: Frage?.data?.question,
      antwortenIds: aufgabenIds,
      type: Frage?.data?.answer_type,
    },
  });

  if (Frage.isLoading || Anworten.isLoading) return <LoadingPage />;
  // TODO: Error Page
  if (Frage.isError) return <>Error</>;
  if (Anworten.isError) return <>Error</>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (Frage.data == null) {
      const res = await Anlegen.mutateAsync({
        antworten: values.antwortenIds,
        question: values.question,
        title: values.title,
        type: values.type,
      });
      if (res) {
        redirect("/Admin/Aufgaben");
      }
    } else if (id != null && Frage.data != null) {
      const res = await Update.mutateAsync({
        id: id,
        antworten: values.antwortenIds,
        question: values.question,
        title: values.title,
        type: values.type,
      });
      if (res) {
        redirect("/Admin/Aufgaben");
      }
    }
  };
  const handleDelete = async () => {
    if (Frage.data == null) return;
    if (id == null) return;

    await Delete.mutateAsync({ id: id });
    redirect("/Admin/Aufgaben");
  };

  return (
    <>
      {Frage.data && <h1>Admin - {Frage.data.title} bearbeiten</h1>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titel</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frage</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fragen Typ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FREE">Freitext</SelectItem>
                    <SelectItem value="MULTI">MultiChoice</SelectItem>
                    <SelectItem value="ONE">SingleChoice</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="antwortenIds"
            render={({ field }) => (
              <MultiSelect
                options={options}
                onValueChange={field.onChange}
                defaultValue={field.value}
                variant="inverted"
                animation={2}
                maxCount={5}
                placeholder="Wähle Anworten"
              />
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {Frage.data && (
        <Button variant="secondary" className="mt-8" onClick={handleDelete}>
          Frage Löschen
        </Button>
      )}
    </>
  );
}
