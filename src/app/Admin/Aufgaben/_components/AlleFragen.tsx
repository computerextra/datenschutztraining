"use client";

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
import type { Answer, Question } from "@prisma/client";
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

const columns: ColumnDef<Question & { anwers: Answer[] }>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <Link
          href={"/Admin/Aufgaben/Frage/" + x.id}
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
    accessorKey: "answer_type",
    header: "Aufgaben Typ",
  },
  {
    id: "anwtorten",
    header: "Anzahl Antworten",
    cell: ({ row }) => {
      const x = row.original;
      const y = x.anwers?.length;
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

export default function AlleFragen() {
  const Aufgaben = api.fragen.getAll.useQuery();

  if (Aufgaben.isLoading) return <>Loading</>;
  if (Aufgaben.isError) return <>Error</>;

  return (
    <>
      <h2>Alle Fragen</h2>
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
