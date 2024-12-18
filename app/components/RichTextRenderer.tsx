// app/components/RichTextRenderer.tsx

import React from "react";
import { StyleSheet, Image, Linking, Dimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import { RichTextDocument } from "../types/RichText";
import { useFontSize } from "../contexts/FontSizeContext"; // FontSizeContext 임포트
import { useTheme } from "../contexts/ThemeContext"; // ThemeContext 임포트

interface RichTextRendererProps {
  content?: RichTextDocument; // optional
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content = null,
}) => {
  const { fontSize } = useFontSize();
  const { colors } = useTheme();

  if (!content) {
    return (
      <RenderHtml
        contentWidth={Dimensions.get("window").width - 40}
        source={{
          html: `<p style="color: ${colors.text}; font-size: ${fontSize}px;">No Content Available</p>`,
        }}
      />
    );
  }

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
          case "embedded-asset-block":
            const url = node.data.target.fields.file.url;
            const alt = node.data.target.fields.title || "";
            return `<img src="https:${url}" alt="${alt}" />`;
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

  const tagsStyles = {
    p: {
      fontSize: fontSize,
      color: colors.text,
      marginVertical: 8,
    },
    h1: {
      fontSize: fontSize + 8,
      fontWeight: "bold",
      marginVertical: 8,
      color: colors.text,
    },
    h2: {
      fontSize: fontSize + 4,
      fontWeight: "bold",
      marginVertical: 8,
      color: colors.text,
    },
    ul: {
      marginVertical: 8,
      paddingLeft: 16,
    },
    ol: {
      marginVertical: 8,
      paddingLeft: 16,
    },
    li: {
      fontSize: fontSize,
      color: colors.text,
    },
    a: {
      color: "blue",
      textDecorationLine: "underline",
      fontSize: fontSize,
    },
    strong: {
      fontWeight: "bold",
      color: colors.text,
      fontSize: fontSize,
    },
    em: {
      fontStyle: "italic",
      color: colors.text,
      fontSize: fontSize,
    },
    img: {
      width: width - 40, // same as contentWidth
      height: 200,
      borderRadius: 8,
      marginVertical: 8,
    },
  };

  return (
    <RenderHtml
      contentWidth={width - 40}
      source={{ html: htmlContent }}
      tagsStyles={tagsStyles}
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
          if (!src) return null;
          return (
            <Image
              source={{ uri: src }}
              style={tagsStyles.img}
              accessibilityLabel={alt}
            />
          );
        },
      }}
    />
  );
};

export default RichTextRenderer;
