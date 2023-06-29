import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import lua from "react-syntax-highlighter/dist/cjs/languages/prism/lua";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("lua", lua);

interface MarkdownRenderProps {
  mdString: string;
}

export default function MarkdownRender({ mdString }: MarkdownRenderProps) {
  return (
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
                    await new Promise((resolve) => setTimeout(resolve, 500));
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
  );
}
