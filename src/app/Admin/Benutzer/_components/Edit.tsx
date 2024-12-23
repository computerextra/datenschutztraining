"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
  name: z.string(),
  admin: z.boolean(),
});

export default function BenutzerBearbeiten({ id }: { id: string }) {
  const user = api.user.getAdmin.useQuery({ id });
  const update = api.user.updateAdmin.useMutation();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      admin: user.data?.admin ?? false,
      name: user.data?.name ?? "",
    },
  });

  useEffect(() => {
    if (user.data == null) return;

    form.reset({
      name: user.data.name ?? "",
      admin: user.data.admin,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.data]);

  // TODO: Loading Page
  if (user.isLoading) return <>Loading</>;
  // TODO: Error Page
  if (user.isError) return <>Error</>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (user.data == null) return;
    const res = await update.mutateAsync({
      admin: values.admin,
      name: values.name,
      id: user.data.id,
    });
    if (res) router.push("/Admin/Benutzer");
  };

  return (
    <>
      <h1>Admin - {user.data?.name} Bearbeiten</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admin"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Admin</FormLabel>
                  <FormDescription>
                    Wenn dieser Haken gesetzt wird, bekommt der Benutzer
                    Administrative Rechte im Portal
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit">Speichern</Button>
        </form>
      </Form>
    </>
  );
}
