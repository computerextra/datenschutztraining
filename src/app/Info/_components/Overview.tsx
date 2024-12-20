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
import { calcReadtime } from "@/Helper/Readtime";

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
      <h2 className="mb-1 mt-12">Lezte Posts</h2>
      <div className="mb-24 grid grid-cols-2 gap-8">
        {latest.data?.map((info) => (
          <Card key={info.id}>
            <CardHeader>
              <div className="flex justify-between">
                <div>{info.title}</div>
                <small className="text-foreground/60">
                  Lesezeit: {calcReadtime(info.body)} min
                </small>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-5">{info.body}</p>
            </CardContent>
            <CardFooter>
              <div className="flex w-full flex-row justify-between">
                <Button asChild>
                  <Link href={`/Info/${info.id}`}>Lesen</Link>
                </Button>
                <div className="flex flex-col">
                  <small className="!m-0 !p-0 text-foreground/60">
                    Erstellt: {info.created_at.toLocaleDateString("de-DE")}
                  </small>
                  {info.updated_at && (
                    <small className="!m-0 !p-0 text-foreground/60">
                      Letztes Update:{" "}
                      {info.updated_at?.toLocaleDateString("de-DE")}
                    </small>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Table */}
      <h2>Alle Posts</h2>
      {infos.data && <InfoDataTable columns={columns} data={infos.data} />}
    </>
  );
}
