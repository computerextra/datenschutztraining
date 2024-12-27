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
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Aufgabe, AufgabeOnUser } from "@prisma/client";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TRISTAN | Benuter",
};

const formSchema = z.object({
  name: z.string(),
});

export default function User({ userId }: { userId: string }) {
  const user = api.user.get.useQuery();
  const updater = api.user.update.useMutation();
  const deleter = api.user.delete.useMutation();
  const Aufgaben = api.aufgaben.getByUser.useQuery({ id: undefined });

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
  if (user.isLoading || Aufgaben.isLoading) return <>Loading</>;
  //   TODO: Page: Error
  if (user.isError || Aufgaben.isError) return <>Error</>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await updater.mutateAsync({ name: values.name });
    if (res) location.reload();
  };

  const onDelete = async () => {
    const res = await deleter.mutateAsync();
    localStorage.removeItem("Accept");
    if (res) redirect("/");
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
        const y = x.completed_by?.find((z) => z.userId === userId);
        return (
          <p className="line-clamp-1">{y?.created_at.toLocaleDateString()}</p>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Zertifikat",
      cell: ({ row }) => {
        const x = row.original;
        return (
          <Button asChild size="sm">
            {/* TODO: Link erstellen */}
            <Link href="/">Zertifikat herunterladen</Link>
          </Button>
        );
      },
    },
  ];

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
        {/* TODO: Sektion - UVM */}
        Hier kommen noch sachen: <br />- UVM
      </p>
      <h2>Abgeschlossene Aufgaben</h2>
      {Aufgaben.data && <DataTable columns={columns} data={Aufgaben.data} />}
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
