import { Layout } from "components";
import { getAllDocs, getDocBySlug, markdownToHtml } from "lib";

import type { NextPage } from "next";

interface Props {
  meta: string;
  content: string;
}

const Post: NextPage<Props> = ({ meta, content }) => {
  return <Layout meta={meta}>{content}</Layout>;
};

export async function getStaticProps({ params }) {
  const doc = getDocBySlug(params.slug);
  const content = await markdownToHtml(doc.content || "");

  return {
    props: {
      ...doc,
      content,
    },
  };
}

export async function getStaticPaths() {
  const docs = getAllDocs();

  return {
    paths: docs.map((doc) => {
      return {
        params: {
          slug: doc.slug,
        },
      };
    }),
    fallback: "blocking",
  };
}

export default Post;
