// app/components/RichTextRenderer.tsx

import React from "react";
import { StyleSheet, Text, Image, View, Linking } from "react-native";
import RenderHtml from "react-native-render-html";
import { RichTextDocument } from "../types/RichText";
import { Dimensions } from "react-native";

interface RichTextRendererProps {
  content: RichTextDocument;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
  const { width } = Dimensions.get("window");

  const richTextToHtml = (richText: RichTextDocument): string => {
    try {
      const convertNode = (node: any): string => {
        switch (node.nodeType) {
          case "paragraph":
            return `<p>${node.content.map(convertNode).join("")}</p>`;
          case "heading-1":
            return `<h1>${node.content.map(convertNode).join("")}</h1>`;
          case "heading-2":
            return `<h2>${node.content.map(convertNode).join("")}</h2>`;
          case "unordered-list":
            return `<ul>${node.content.map(convertNode).join("")}</ul>`;
          case "ordered-list":
            return `<ol>${node.content.map(convertNode).join("")}</ol>`;
          case "list-item":
            return `<li>${node.content.map(convertNode).join("")}</li>`;
          case "hyperlink":
            return `<a href="${node.data.uri}">${node.content.map(convertNode).join("")}</a>`;
          case "text":
            let text = node.value;
            if (node.marks) {
              node.marks.forEach((mark: any) => {
                if (mark.type === "bold") {
                  text = `<strong>${text}</strong>`;
                }
                if (mark.type === "italic") {
                  text = `<em>${text}</em>`;
                }
              });
            }
            return text;
          default:
            return "";
        }
      };
      return richText.content.map(convertNode).join("");
    } catch (error) {
      console.error("Error converting rich text to HTML:", error);
      return "";
    }
  };

  const htmlContent = richTextToHtml(content);

  return (
    <RenderHtml
      contentWidth={width - 40}
      source={{ html: htmlContent }}
      tagsStyles={{
        p: styles.paragraph,
        h1: styles.heading1,
        h2: styles.heading2,
        ul: styles.ulList,
        ol: styles.olList,
        li: styles.listItem,
        a: styles.link,
        strong: styles.bold,
        em: styles.italic,
      }}
      renderersProps={{
        a: {
          onPress: (event, href) => {
            Linking.openURL(href);
          },
        },
      }}
      renderers={{
        img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
          const { src, alt } = htmlAttribs;
          return (
            <Image
              source={{ uri: src }}
              style={styles.embeddedImage}
              accessibilityLabel={alt}
            />
          );
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
    marginVertical: 8,
    color: "#333",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#000",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#000",
  },
  ulList: {
    marginVertical: 8,
    paddingLeft: 16,
  },
  olList: {
    marginVertical: 8,
    paddingLeft: 16,
  },
  listItem: {
    fontSize: 16,
    color: "#333",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  embeddedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
});

export default RichTextRenderer;
