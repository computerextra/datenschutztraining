"use client";

import LoadingPage from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string(),
  correct: z.boolean(),
});

export default function AntwortForm({ id }: { id: string | undefined }) {
  const Anlegen = api.antwort.create.useMutation();
  const Update = api.antwort.update.useMutation();
  const Delete = api.antwort.delete.useMutation();
  const Antwort = api.antwort.get.useQuery({ id: id ?? "" });

  useEffect(() => {
    if (Antwort.data == null) return;
    form.reset({
      title: Antwort?.data?.title,
      correct: Antwort?.data?.correct,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Antwort.data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: Antwort?.data?.title,
      correct: Antwort?.data?.correct ?? false,
    },
  });

  if (Antwort.isLoading) return <LoadingPage />;
  // TODO: Error Page
  if (Antwort.isError) return <>Error</>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (Antwort.data == null) {
      const res = await Anlegen.mutateAsync({
        title: values.title,
        correct: values.correct,
      });
      if (res) {
        redirect("/Admin/Aufgaben");
      }
    } else if (id != null && Antwort.data != null) {
      const res = await Update.mutateAsync({
        id: id,
        title: values.title,
        correct: values.correct,
      });
      if (res) {
        redirect("/Admin/Aufgaben");
      }
    }
  };

  const handleDelete = async () => {
    if (Antwort.data == null) return;
    if (id == null) return;

    await Delete.mutateAsync({ id });
    redirect("/Admin/Aufgaben");
  };

  return (
    <>
      {Antwort.data && <h1>Admin - {Antwort.data.title} bearbeiten</h1>}
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
            name="correct"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Ist das die korrekte Antwort?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {Antwort.data && (
        <Button variant="secondary" className="mt-8" onClick={handleDelete}>
          Antwort Löschen
        </Button>
      )}
    </>
  );
}
