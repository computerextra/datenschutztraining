"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function DeletePage({
  user,
  aufgabe,
}: {
  user: string;
  aufgabe: string;
}) {
  const Delete = api.zertifiakte.delete.useMutation();
  const Aufgabe = api.aufgaben.get.useQuery({ id: aufgabe });
  const User = api.user.getAdmin.useQuery({ id: user });

  console.log("user", user);
  console.log("aufgabe", aufgabe);

  //   TODO: Page: Loading
  if (User.isLoading || Aufgabe.isLoading) return <>Loading</>;
  //   TODO: Page: Error
  if (User.isError || Aufgabe.isError)
    return (
      <>
        {User.isError && <>User Fehler: {User.error.message}</>}
        {Aufgabe.isError && <>Aufgabe Fehler: {Aufgabe.error.message}</>}
      </>
    );

  const handleConfirm = async () => {
    await Delete.mutateAsync({
      aufgabeId: aufgabe,
      userId: user,
    });
    redirect("/Admin/Benutzer");
  };

  return (
    <>
      <h1>Zertifikat Löschen</h1>
      <p className="mb-8 text-center text-3xl font-bold">
        Soll das Zertifkat von {User.data?.name} für {Aufgabe.data?.title}{" "}
        wirklich gelöscht werden?
      </p>
      <div className="flex justify-around">
        <Button asChild>
          <Link href="/Admin/Benutzer">Nein</Link>
        </Button>
        <Button variant="secondary" onClick={handleConfirm}>
          Ja
        </Button>
      </div>
    </>
  );
}
