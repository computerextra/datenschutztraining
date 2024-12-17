"use client";

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import axios, {
  type AxiosRequestConfig,
  type RawAxiosRequestHeaders,
} from "axios";

const config: AxiosRequestConfig = {
  headers: {
    Accept: "application/json",
  } as RawAxiosRequestHeaders,
};

export default function useAccept() {
  const [allowed, setAllowed] = useState<boolean | undefined>();
  const [done, setDone] = useState(false);
  const finder = api.accept.check.useMutation();

  useEffect(() => {
    const set = localStorage.getItem("Accept");
    if (set != null) {
      setAllowed(true);
      setDone(true);
      return;
    }
    const infos = new FormData();
    infos.set("UserAgent", navigator.userAgent);
    infos.set("CPU", navigator.hardwareConcurrency.toString());
    infos.set("Lang", navigator.language);
    axios
      .post<{
        ip: string;
      }>("https://computer-extra.de/php/check.php", infos, config)
      .then((res) => {
        const id = res.data.ip;
        finder
          .mutateAsync({ id })
          .then((res) => {
            if (res) {
              localStorage.setItem("Accept", "true");
              setAllowed(true);
              setDone(true);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allowed, done };
}
