"use client";

import { api } from "@/trpc/react";
import type { Info } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { InfoDataTable } from "@/app/_components/InfoDataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingPage from "@/components/LoadingPage";

const columns: ColumnDef<Info>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const x = row.original;

      return (
        <Link href={`/Admin/Info/${x.id}`} className="text-primary underline">
          {x.id}
        </Link>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Erstellt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const x = row.original;
      return <p>{x.created_at.toLocaleDateString("de-DE")}</p>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Letztes Update",
    cell: ({ row }) => {
      const x = row.original;
      return (
        <p>{x.updated_at ? x.updated_at.toLocaleDateString("de-DE") : "-"}</p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const x = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* TODO: Action Links erstellen und einfügen */}
            <DropdownMenuItem asChild>
              <Link href={`/Admin/Info/${x.id}`}>Bearbeiten</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Overview() {
  const infos = api.info.getAll.useQuery();

  if (infos.isLoading) return <LoadingPage />;
  //   TODO: Error Page
  if (infos.isError) return <>Error</>;

  if (infos.data) return <InfoDataTable columns={columns} data={infos.data} />;
}
