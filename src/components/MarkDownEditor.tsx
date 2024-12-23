"use client";

import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  directivesPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import type { Dispatch, FC, SetStateAction } from "react";
import "@mdxeditor/editor/style.css";
import { api } from "@/trpc/react";
import { file2Base64 } from "@/Helper/ConvertFile";

interface EditorProps {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<unknown>>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const MarkdownEditor: FC<EditorProps> = ({ markdown, setMarkdown }) => {
  const uploader = api.image.create.useMutation();

  return (
    <MDXEditor
      className="rounded-xl bg-white text-black"
      onChange={(e) => setMarkdown(e)}
      markdown={markdown}
      plugins={[
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {" "}
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
              <ListsToggle />
            </>
          ),
        }),
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler: (image: File) => {
            const name = (async () => {
              const b64 = await file2Base64(image);
              await uploader.mutateAsync({ image: b64, name: image.name });
              return `/Upload/Images/${image.name}`;
            })();
            return name;
          },
        }),
        tablePlugin(),
        markdownShortcutPlugin(),
      ]}
    />
  );
};

export default MarkdownEditor;
