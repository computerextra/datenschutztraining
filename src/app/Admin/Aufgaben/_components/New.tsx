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
  aufgaben: z.array(z.string()),
});

export default function New() {
  const create = api.aufgaben.create.useMutation();

  const Fragen = api.fragen.getAll.useQuery();
  const router = useRouter();
  const [options, setOptions] = useState<MultiSelectOptionProps[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  if (Fragen.isLoading) return <>Loading</>;
  if (Fragen.isError) return <>Error</>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await create.mutateAsync({
      body: values.body,
      title: values.title,
      questions: values.aufgaben,
    });
    if (res) router.push("/Admin/Aufgaben");
  };

  return (
    <>
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
                <MarkdownEditor markdown={""} setMarkdown={field.onChange} />
              )}
            />
            <FormField
              control={form.control}
              name="aufgaben"
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
    </>
  );
}
