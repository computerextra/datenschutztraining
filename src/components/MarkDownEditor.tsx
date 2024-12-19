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

interface EditorProps {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<unknown>>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const MarkdownEditor: FC<EditorProps> = ({ markdown, setMarkdown }) => {
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
          imageUploadHandler: () => {
            // TODO: Image Uploader bauen
            return Promise.resolve("https://via.placeholder.com/150");
          },
        }),
        tablePlugin(),
        markdownShortcutPlugin(),
      ]}
    />
  );
};

export default MarkdownEditor;
