"use client";

import { api } from "@/trpc/react";
import type { Aufgabe, Question } from "@prisma/client";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columns: ColumnDef<Aufgabe & { questions: Question[] | null }>[] = [
  {
    accessorKey: "title",
    header: "Titel",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <Link href={"/Aufgaben/" + x.id} className="text-primary underline">
          {x.title}
        </Link>
      );
    },
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

export default function Aufgaben({
  userName,
}: {
  userName: string | undefined | null;
}) {
  const Aufgaben = api.aufgaben.getUndone.useQuery();

  if (Aufgaben.isLoading) return <>Loading...</>;
  if (Aufgaben.isError) return <>Fehler</>;

  return (
    <>
      <h2>Offene Aufgaben {userName && <>für {userName}</>}</h2>
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
