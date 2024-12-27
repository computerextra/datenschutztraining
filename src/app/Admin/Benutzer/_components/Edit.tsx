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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Aufgabe, AufgabeOnUser } from "@prisma/client";
import Link from "next/link";

const formSchema = z.object({
  name: z.string(),
  admin: z.boolean(),
});

export default function BenutzerBearbeiten({ id }: { id: string }) {
  const user = api.user.getAdmin.useQuery({ id });
  const update = api.user.updateAdmin.useMutation();
  const Aufgaben = api.aufgaben.getByUser.useQuery({ id });
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
  if (user.isLoading || Aufgaben.isLoading) return <>Loading</>;
  // TODO: Error Page
  if (user.isError || Aufgaben.isError) return <>Error</>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (user.data == null) return;
    const res = await update.mutateAsync({
      admin: values.admin,
      name: values.name,
      id: user.data.id,
    });
    if (res) router.push("/Admin/Benutzer");
  };

  const columns: ColumnDef<
    Aufgabe & { completed_by: AufgabeOnUser[] | null }
  >[] = [
    {
      accessorKey: "title",
      header: "Titel",
    },
    {
      accessorKey: "created_at",
      header: "Abgeschlossen am",
      cell: ({ row }) => {
        const x = row.original;
        const y = x.completed_by?.find((z) => z.userId === id);
        return (
          <p className="line-clamp-1">{y?.created_at.toLocaleDateString()}</p>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Löschen",
      cell: ({ row }) => {
        const x = row.original;
        const comp = x.completed_by?.find((z) => z.userId === id);
        return (
          <Button asChild size="sm">
            <Link
              href={`/Admin/Zertifikate/Delete/${comp?.userId}/${comp?.aufgabeId}`}
            >
              Zertifikat Löschen
            </Link>
          </Button>
        );
      },
    },
  ];

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
      {Aufgaben.data && <DataTable columns={columns} data={Aufgaben.data} />}
    </>
  );
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Keine Ergebnisse.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
