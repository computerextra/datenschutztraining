"use client";

import { api } from "@/trpc/react";
import type { Info } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { InfoDataTable } from "@/app/_components/InfoDataTable";

const columns: ColumnDef<Info>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const x = row.original;

      return (
        <Link href={`/Info/${x.id}`} className="text-primary underline">
          {x.title}
        </Link>
      );
    },
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
];

export default function Overview() {
  const infos = api.info.getAll.useQuery();
  const latest = api.info.getLatest.useQuery();

  //   TODO: Loading Page
  if (infos.isLoading || latest.isLoading) return <>Loading</>;
  //   TODO: Error Page
  if (infos.isError || latest.isError) return <>Error</>;

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {latest.data?.map((info) => (
          <Card key={info.id}>
            <CardHeader>{info.title}</CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Link href={`/Info/${info.id}`}>Mehr</Link>
              Erstellt: {info.created_at.toLocaleDateString("de-DE")}
              Letztes Update: {info.updated_at?.toLocaleDateString("de-DE")}
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Table */}
      {infos.data && <InfoDataTable columns={columns} data={infos.data} />}
    </>
  );
}
