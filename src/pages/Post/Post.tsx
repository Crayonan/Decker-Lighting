import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../contentfulClient";
import { FaLink } from "react-icons/fa";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, Block, Inline } from "@contentful/rich-text-types";
import { Options } from '@contentful/rich-text-react-renderer';
import "./post.css";

interface PostFields {
  title: string;
  date: string;
  content: any; // You might want to define a more specific type for the rich text content
}

const renderOptions: Options = {
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

const Post: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostFields | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    client
      .getEntries<PostFields>({
        content_type: "posts",
        "fields.slug": slug,
        limit: 1,
      })
      .then((response) => {
        if (response.items.length > 0) {
          setPost(response.items[0].fields);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return <p>Loading post...</p>;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div className="container page-post">
      <div className="post-header">
        <div className="post-info">
          <p>{post.title}</p>
          <p>{new Date(post.date).toLocaleDateString()}</p>
        </div>
        <div className="post-link">
          <FaLink size="14px" style={{ color: "hsl(0 0% 60%)" }} />
        </div>
      </div>

      <div className="post-content">
        {documentToReactComponents(post.content, renderOptions)}
      </div>
    </div>
  );
};

export default Post;