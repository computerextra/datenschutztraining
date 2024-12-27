"use client";

import LoadingPage from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import type { Aufgabe, Question } from "@prisma/client";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

const columns: ColumnDef<Aufgabe & { questions: Question[] | null }>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <Link
          href={"/Admin/Aufgaben/" + x.id}
          className="text-primary underline"
        >
          {x.id}
        </Link>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Titel",
  },
  {
    accessorKey: "body",
    header: "Text",
    cell: ({ row }) => {
      const x = row.original;
      return <p className="line-clamp-1">{x.body}</p>;
    },
  },
  {
    id: "aufgaben",
    header: "Anzahl Fragen",
    cell: ({ row }) => {
      const x = row.original;
      const y = x.questions?.length ?? 0;
      return <p>{y}</p>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Erstellt",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <p className="line-clamp-1">{x.created_at.toLocaleDateString()}</p>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Letztes Update",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <p className="line-clamp-1">{x.updated_at?.toLocaleDateString()}</p>
      );
    },
  },
];

export default function All() {
  const Aufgaben = api.aufgaben.getAll.useQuery();

  if (Aufgaben.isLoading) return <LoadingPage />;
  // TODO: Error Poge
  if (Aufgaben.isError) return <>Error</>;

  return (
    <>
      <div className="mt-8 flex justify-around">
        <Button asChild className="mb-8">
          <Link href="/Admin/Aufgaben/Neu">Neue Aufgabe erstellen</Link>
        </Button>
        <Button asChild className="mb-8">
          <Link href="/Admin/Aufgaben/Frage/Neu">Neue Frage erstellen</Link>
        </Button>
        <Button asChild className="mb-8">
          <Link href="/Admin/Aufgaben/Antwort/Neu">Neue Antwort erstellen</Link>
        </Button>
      </div>
      <h2>Alle Aufgaben</h2>
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Suche nach namen..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
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
                  Keine Ergebisse.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
