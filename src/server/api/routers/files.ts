import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import path from "path";
import { readdir, unlink, writeFile } from "fs/promises";
import { createWriteStream, existsSync } from "fs";
import * as https from "node:https";

const MAX_FILE_SIZE = 1000000 * 100; // Number of byts in a megabyte
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const fileSchema = z.instanceof(File).superRefine((f, ctx) => {
  // First, add an issue if the mime type is wrong
  if (!ACCEPTED_FILE_TYPES.includes(f.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `File must be one of ${ACCEPTED_FILE_TYPES.join(", ")} but was ${f.type}`,
    });
  }
  if (f.size > MAX_FILE_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      type: "array",
      message: `The file must not be larger than ${MAX_FILE_SIZE / 1000000} MB! but was ${f.size / 1000000} MB`,
      maximum: MAX_FILE_SIZE,
      inclusive: true,
    });
  }
});

// TODO: Hier alles einmal durchtesten

type ImageResponse = {
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
    const images: ImageResponse[] = [];
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
      console.log("Start Image Upload");
      const UploadFoler = path.resolve("./public", "Upload");
      const ImageFolder = path.join(UploadFoler, "Images");
      console.log("Write File");

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
    return await readdir(FileFolder);
  }),
  create: protectedProcedure
    .input(
      z.object({
        file: fileSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      const buf = await input.file.arrayBuffer();
      const UploadFoler = path.resolve("./public", "Upload");
      const FileFolder = path.join(UploadFoler, "Files");
      await writeFile(path.join(FileFolder, input.file.name), Buffer.from(buf));
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
