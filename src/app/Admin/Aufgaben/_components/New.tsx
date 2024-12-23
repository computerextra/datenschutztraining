"use client";

import MarkdownEditor from "@/components/MarkDownEditor";
import {
  MultiSelect,
  type MultiSelectOptionProps,
} from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string(),
  body: z.string(),
  aufgaben: z.array(z.string()),
});

const FragenSchema = z.object({
  title: z.string(),
  question: z.string(),
  type: z.enum(["FREE", "MULTI", "ONE"]),
});

export default function New() {
  const create = api.aufgaben.create.useMutation();
  const createQuest = api.fragen.create.useMutation();
  const Fragen = api.fragen.getAll.useQuery();
  const router = useRouter();
  const [options, setOptions] = useState<MultiSelectOptionProps[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const Fragenform = useForm<z.infer<typeof FragenSchema>>({
    resolver: zodResolver(FragenSchema),
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

  const saveQuest = async (values: z.infer<typeof FragenSchema>) => {
    // TODO: Antworten Implementieren
    const res = await createQuest.mutateAsync({
      question: values.question,
      title: values.title,
      type: values.type,
    });
    if (res) {
      location.reload();
    }
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
      {/* TODO: In Eigene Seite einbauen, da auch Antworten angelegt werden müssen! */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="mt-12">Neue Frage anlegen</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Neue Frage anlegen</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Form {...Fragenform}>
                  <form
                    onSubmit={Fragenform.handleSubmit(saveQuest)}
                    className="space-y-8"
                  >
                    <FormField
                      control={Fragenform.control}
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
                      control={Fragenform.control}
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
                      control={Fragenform.control}
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
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
