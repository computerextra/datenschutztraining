"use client";

import LoadingPage from "@/components/LoadingPage";
import MarkdownEditor from "@/components/MarkDownEditor";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export default function Edit({ id }: { id: string }) {
  const info = api.info.get.useQuery({ id });
  const update = api.info.update.useMutation();
  const deleter = api.info.delete.useMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: info.data?.body ?? "",
      title: info.data?.title ?? "",
    },
  });

  useEffect(() => {
    if (info.data == null) return;

    form.reset({
      body: info.data.body,
      title: info.data.title,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.data]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (info.data == null) return;
    const res = await update.mutateAsync({
      id: info.data.id,
      body: values.body,
      title: values.title,
    });
    if (res) router.push("/Admin/Info");
  };

  const handleDelete = async () => {
    await deleter.mutateAsync({ id });
    router.push("/Admin/Info");
  };

  if (info.isLoading) return <LoadingPage />;
  // TODO: Error Page
  if (info.isError) return <>Error</>;

  return (
    <>
      <h1>Admin - {} bearbeiten</h1>
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Button variant="secondary" onClick={handleDelete}>
        Info Löschen
      </Button>
    </>
  );
}
