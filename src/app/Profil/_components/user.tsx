"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/trpc/react";
import type { Metadata } from "next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "TRISTAN | Benuter",
};

const formSchema = z.object({
  name: z.string(),
});

export default function User() {
  const user = api.user.get.useQuery();
  const updater = api.user.update.useMutation();
  const deleter = api.user.delete.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.data?.name ?? "",
    },
  });

  useEffect(() => {
    if (user.data == null) return;

    form.reset({
      name: user.data.name ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.data]);

  //   TODO: Page: Loading
  if (user.isLoading) return <>Loading</>;
  //   TODO: Page: Error
  if (user.isError) return <>Error</>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await updater.mutateAsync({ name: values.name });
    if (res) location.reload();
  };

  const onDelete = async () => {
    const res = await deleter.mutateAsync();
    localStorage.removeItem("Accept");
    if (res) redirect("/");
  };

  return (
    <>
      <h1 className="mb-8 mt-8">{user.data?.name}</h1>
      {!user.data?.name && (
        <Alert variant="destructive">
          <AlertTitle className="text-3xl">Kein Name</AlertTitle>
          <AlertDescription className="text-xl">
            Du hast noch gar keinen Namen hinterlegt. <br />
            Das sollte nachgeholt werden. Ein Name ist wichtig, damit die <br />
            Zertifikate, die du über diese Platform erhälst auf korrekt erstellt
            werden können.
          </AlertDescription>
        </Alert>
      )}
      <div className="mb-8 max-w-[60%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dein Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Speichern</Button>
          </form>
        </Form>
      </div>
      <p className="my-8">
        {/* TODO: Sektion - Tests */}
        {/* TODO: Sektion - Zertifikate */}
        {/* TODO: Sektion - UVM */}
        Hier kommen noch sachen: <br />- Aktuelle Tests <br />- Erhaltene
        Zertifikate <br />- UVM
      </p>
      <Button
        className="mt-8"
        variant="secondary"
        onClick={(e) => {
          e.preventDefault();
          void onDelete();
        }}
      >
        Account Löschen
      </Button>
    </>
  );
}
