import { readFile } from "fs/promises";
import { type InferGetStaticPropsType, type GetStaticProps } from "next";
import Head from "next/head";
import MarkdownRender from "~/components/markdown_render";

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
          <MarkdownRender mdString={mdString} />
        </article>
      </main>
    </>
  );
}
