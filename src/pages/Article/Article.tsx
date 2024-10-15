import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../contentfulClient";
import { FaLink } from "react-icons/fa";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, Block, Inline } from "@contentful/rich-text-types";
import "./article.css";

interface ArticleFields {
  title: string;
  date: string;
  content: any; // You might want to define a more specific type for the rich text content
}

const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: Block) => {
      const { file, title } = (node.data.target as any).fields;
      return (
        <div className="embedded-image">
          <img src={file.url} alt={title} />
        </div>
      );
    },
    [BLOCKS.QUOTE]: (node: Block) => {
      return <blockquote>{(node.content[0] as any).content[0].value}</blockquote>;
    },
    [INLINES.HYPERLINK]: (node: Inline) => {
      return (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
          {(node.content[0] as any).value}
        </a>
      );
    },
  },
};

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleFields | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    client
      .getEntries<ArticleFields>({
        content_type: "article",
        "fields.slug": slug,
        limit: 1,
      })
      .then((response) => {
        if (response.items.length > 0) {
          setArticle(response.items[0].fields);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return <p>Loading article...</p>;
  }

  if (!article) {
    return <p>Article not found</p>;
  }

  return (
    <div className="container page-article">
      <div className="article-header">
        <div className="article-info">
          <p>{article.title}</p>
          <p>{new Date(article.date).toLocaleDateString()}</p>
        </div>
        <div className="article-link">
          <FaLink size="14px" style={{ color: "hsl(0 0% 60%)" }} />
        </div>
      </div>

      <div className="article-content">
        {documentToReactComponents(article.content, renderOptions)}
      </div>
    </div>
  );
};

export default Article;