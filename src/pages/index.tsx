import { readFile } from "fs/promises";
import { type InferGetStaticPropsType, type GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

type HomeProps = {
  mdString: string;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const mdString = await readFile(
    "./public/code-syntax-highlighter.md",
    "utf-8"
  );
  return { props: { mdString } };
};

export default function Home({
  mdString,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Code syntax highlighter tailwindCSS DaisyUI</title>
        <meta
          name="description"
          content="Code syntax highlighter tailwindCSS DaisyUI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-prose">
        <article>
          <ReactMarkdown
            components={{
              code({ inline, className, ...props }) {
                const hasLang = /language-(\w+)/.exec(className || "");
                return !inline && hasLang ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={hasLang[1]}
                    PreTag="div"
                    className="mockup-code scrollbar-thin scrollbar-track-base-content/5 scrollbar-thumb-base-content/40 scrollbar-track-rounded-md scrollbar-thumb-rounded"
                    showLineNumbers={true}
                    useInlineStyles={true}
                  >
                    {String(props.children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props} />
                );
              },
              pre: (pre) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
                const codeChunk = (pre as any).node.children[0].children[0]
                  .value as string;

                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [copyTip, setCopyTip] = useState("Copy code");

                const language =
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
                  (pre as any).children[0]?.props.className.replace(
                    /language-/g,
                    ""
                  ) as string;

                return (
                  <div className="relative overflow-x-hidden">
                    <button
                      style={{
                        right: 0,
                      }}
                      className="tooltip tooltip-left absolute z-40 mr-2 mt-5"
                      data-tip={copyTip}
                    >
                      <CopyToClipboard
                        text={codeChunk}
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onCopy={async () => {
                          setCopyTip("Copied");
                          await new Promise((resolve) =>
                            setTimeout(resolve, 500)
                          );
                          setCopyTip(`Copy code`);
                        }}
                      >
                        <DocumentDuplicateIcon className="h-5 w-5 cursor-pointer hover:text-blue-600" />
                      </CopyToClipboard>
                    </button>
                    <span
                      style={{
                        bottom: 0,
                        right: 0,
                      }}
                      className="absolute z-40 mb-5 mr-1 rounded-lg bg-base-content/40 p-1 text-xs uppercase text-base-300 backdrop-blur-sm"
                    >
                      {language}
                    </span>
                    <pre {...pre}></pre>
                  </div>
                );
              },
            }}
          >
            {mdString}
          </ReactMarkdown>
        </article>
      </main>
    </>
  );
}
