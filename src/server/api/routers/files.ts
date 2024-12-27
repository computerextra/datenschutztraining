import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import path from "path";
import { readdir, unlink, writeFile } from "fs/promises";
import { createWriteStream, existsSync } from "fs";
import * as https from "node:https";

export type FileResponse = {
  id: string;
  name: string;
  src: string;
};

export const imageRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.admin) return null;
    const UploadFoler = path.resolve("./public", "Upload");
    const ImageFolder = path.join(UploadFoler, "Images");
    const fileNames = await readdir(ImageFolder);
    const images: FileResponse[] = [];
    fileNames.forEach((x, idx) => {
      if (x != ".gitkeep")
        images.push({
          id: idx.toString(),
          name: x,
          src: "/Upload/Images/" + x,
        });
    });
    return images;
  }),
  create: protectedProcedure
    .input(
      z.object({
        image: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;

      const UploadFoler = path.resolve("./public", "Upload");
      const ImageFolder = path.join(UploadFoler, "Images");

      const data = input.image.replace(/^data:image\/\w+;base64,/, "");
      const buf = new Buffer(data, "base64");
      await writeFile(ImageFolder + "/" + input.name, buf);

      // await writeFile(path.join(ImageFolder, input.name), buff);
      return true;
    }),
  createFromUrl: protectedProcedure
    .input(z.object({ url: z.string(), fileName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      const UploadFoler = path.resolve("./public", "Upload");
      const ImageFolder = path.join(UploadFoler, "Images");
      const output = createWriteStream(path.join(ImageFolder, input.fileName));
      https
        .get(input.url, (res) => {
          res.pipe(output);
        })
        .on("error", (e) => {
          return e.message;
        });
      return null;
    }),
  delete: protectedProcedure
    .input(z.object({ fileName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      const UploadFoler = path.resolve("./public", "Upload");
      const ImageFolder = path.join(UploadFoler, "Images");
      if (existsSync(path.join(ImageFolder, input.fileName))) {
        await unlink(path.join(ImageFolder, input.fileName));
        return true;
      } else {
        return false;
      }
    }),
});

export const fileRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.admin) return null;
    const UploadFoler = path.resolve("./public", "Upload");
    const FileFolder = path.join(UploadFoler, "Files");
    const fileNames = await readdir(FileFolder);
    const images: FileResponse[] = [];
    fileNames.forEach((x, idx) => {
      if (x != ".gitkeep")
        images.push({
          id: idx.toString(),
          name: x,
          src: "/Upload/Files/" + x,
        });
    });
    return images;
  }),
  create: protectedProcedure
    .input(
      z.object({
        file: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;

      const UploadFoler = path.resolve("./public", "Upload");
      const FileFolder = path.join(UploadFoler, "Files");

      const data = input.file.replace(/^data:application\/\w+;base64,/, "");
      const buf = new Buffer(data, "base64");
      await writeFile(FileFolder + "/" + input.name, buf);
      return true;
    }),
  delete: protectedProcedure
    .input(z.object({ fileName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      const UploadFoler = path.resolve("./public", "Upload");
      const FileFolder = path.join(UploadFoler, "Files");
      if (existsSync(path.join(FileFolder, input.fileName))) {
        await unlink(path.join(FileFolder, input.fileName));
        return true;
      } else {
        return false;
      }
    }),
});
