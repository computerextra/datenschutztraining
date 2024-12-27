"use client";

import MarkdownEditor from "@/components/MarkDownEditor";
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
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string(),
  body: z.string(),
  fragen: z.array(z.string()),
});

export default function AufgabenForm({ id }: { id: string | undefined }) {
  const Create = api.aufgaben.create.useMutation();
  const Update = api.aufgaben.update.useMutation();
  const Delete = api.aufgaben.delete.useMutation();
  const Aufgabe = api.aufgaben.get.useQuery({ id: id ?? "" });

  const FragenIds: string[] = [];

  if (Aufgabe?.data?.questions) {
    Aufgabe?.data?.questions.map((x) => {
      FragenIds.push(x.id);
    });
  }

  const Fragen = api.fragen.getAll.useQuery();
  const router = useRouter();
  const [options, setOptions] = useState<MultiSelectOptionProps[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: Aufgabe.data?.title,
      fragen: FragenIds,
      body: Aufgabe.data?.body,
    },
  });

  useEffect(() => {
    if (Fragen.data == null) return;
    const options: MultiSelectOptionProps[] = [];
    Fragen.data.forEach((x) => {
      options.push({
        label: x.title,
        value: x.id,
      });
    });
    setOptions(options);
  }, [Fragen.data]);

  useEffect(() => {
    if (Aufgabe.data == null) return;
    form.reset({
      title: Aufgabe.data?.title,
      fragen: FragenIds,
      body: Aufgabe.data?.body,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Aufgabe.data]);

  if (Fragen.isLoading) return <>Loading</>;
  if (Fragen.isError) return <>Error</>;
  // TODO: Loading Page
  if (Aufgabe.isLoading) return <>Loading</>;
  // TODO: Error Page
  if (Aufgabe.isError) return <>Error</>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (Aufgabe.data == null) {
      const res = await Create.mutateAsync({
        body: values.body,
        title: values.title,
        questions: values.fragen,
      });
      if (res) router.push("/Admin/Aufgaben");
    } else if (Aufgabe.data != null && id != null) {
      const res = await Update.mutateAsync({
        body: values.body,
        title: values.title,
        questions: values.fragen,
        id: id,
      });
      if (res) router.push("/Admin/Aufgaben");
    }
  };

  const handleDelete = async () => {
    if (Aufgabe.data == null) return;
    if (id == null) return;

    await Delete.mutateAsync({ id });
    router.push("/Admin/Aufgaben");
  };

  return (
    <>
      {Aufgabe.data && <h1>Admin - {Aufgabe.data.title} bearbeiten</h1>}
      {Fragen.data && (
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
              name="body"
              render={({ field }) => (
                <MarkdownEditor
                  markdown={field.value}
                  setMarkdown={field.onChange}
                />
              )}
            />
            <FormField
              control={form.control}
              name="fragen"
              render={({ field }) => (
                <MultiSelect
                  options={options}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  variant="inverted"
                  animation={2}
                  maxCount={5}
                  placeholder="Wähle fragen"
                />
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}

      {Aufgabe.data && (
        <Button variant="secondary" className="mt-8" onClick={handleDelete}>
          Aufgabe Löschen
        </Button>
      )}
    </>
  );
}
