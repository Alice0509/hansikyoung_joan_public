// app/components/RichTextRenderer.tsx

import React from "react";
import { StyleSheet, Text, View, Linking, Image } from "react-native";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { Document, BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import Timer from "./Timer"; // Timer 컴포넌트 임포트

interface RichTextRendererProps {
  content: Document | string;
  style?: any;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  style,
}) => {
  const textColor = style?.color || "#000"; // 전달된 색상 또는 기본 색상

  if (typeof content === "string") {
    return (
      <View style={style}>
        <Text style={[styles.text, style, { color: textColor }]}>
          {content}
        </Text>
      </View>
    );
  }

  console.log("RichTextRenderer Content:", JSON.stringify(content, null, 2)); // 디버깅 로그 추가

  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <Text
          style={[styles.text, style, { marginVertical: 5, color: textColor }]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_1]: (node, children) => (
        <Text
          style={[styles.heading, style, { fontSize: 24, color: textColor }]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <Text
          style={[styles.heading, style, { fontSize: 22, color: textColor }]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <Text
          style={[styles.heading, style, { fontSize: 20, color: textColor }]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <Text
          style={[styles.heading, style, { fontSize: 18, color: textColor }]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_5]: (node, children) => (
        <Text
          style={[styles.heading, style, { fontSize: 16, color: textColor }]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_6]: (node, children) => (
        <Text
          style={[styles.heading, style, { fontSize: 14, color: textColor }]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.UL_LIST]: (node, children) => (
        <UnorderedList textColor={textColor}>{children}</UnorderedList>
      ),
      [BLOCKS.OL_LIST]: (node, children) => (
        <OrderedList textColor={textColor}>{children}</OrderedList>
      ),
      [BLOCKS.LIST_ITEM]: (node, children) => <ListItem>{children}</ListItem>,
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const contentTypeId = node.data.target.sys.contentType.sys.id;
        if (contentTypeId === "timer") {
          const duration = node.data.target.fields.duration; // 초 단위
          return (
            <Timer
              duration={duration}
              onFinish={() => {
                /* 원하는 로직 */
              }}
            />
          );
        }
        return (
          <View>
            <Text style={{ color: textColor }}>Embedded Entry</Text>
          </View>
        );
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => (
        <Image
          source={{ uri: `https:${node.data.target.fields.file.url}` }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
          resizeMode="cover"
        />
      ),
      [INLINES.HYPERLINK]: (node, children) => (
        <Text
          style={{ color: "blue", textDecorationLine: "underline" }}
          onPress={() => Linking.openURL(node.data.uri)}
        >
          {children}
        </Text>
      ),
      // 추가적인 블록 노드 타입 처리 가능
    },
    renderMark: {
      [MARKS.BOLD]: (text) => (
        <Text style={{ fontWeight: "bold", color: textColor }}>{text}</Text>
      ),
      [MARKS.ITALIC]: (text) => (
        <Text style={{ fontStyle: "italic", color: textColor }}>{text}</Text>
      ),
      // 추가적인 마크 처리 가능
    },
    renderText: (text) => (
      <Text style={[styles.text, style, { color: textColor }]}>{text}</Text>
    ),
  };

  return (
    <View style={style}>
      {documentToReactComponents(content as Document, options)}
    </View>
  );
};

// OrderedList 컴포넌트: 번호가 매겨진 리스트 렌더링
const OrderedList = ({ children, textColor }) => {
  return (
    <View style={{ marginVertical: 5 }}>
      {React.Children.map(children, (child, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginVertical: 2,
          }}
        >
          <Text style={{ marginRight: 5, color: textColor }}>{index + 1}.</Text>
          <View style={{ flex: 1 }}>{child}</View>
        </View>
      ))}
    </View>
  );
};

// UnorderedList 컴포넌트: 불릿 리스트 렌더링
const UnorderedList = ({ children, textColor }) => {
  return (
    <View style={{ marginVertical: 5 }}>
      {React.Children.map(children, (child, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginVertical: 2,
          }}
        >
          <Text style={{ marginRight: 5, color: textColor }}>•</Text>
          <View style={{ flex: 1 }}>{child}</View>
        </View>
      ))}
    </View>
  );
};

// ListItem 컴포넌트: 리스트 아이템 렌더링
const ListItem = ({ children }) => {
  return <View>{children}</View>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    // color: "#000", // 기본 색상 제거
  },
  heading: {
    fontWeight: "bold",
    // color: "#000", // 기본 색상 제거
  },
  hr: {
    // borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginVertical: 10,
    alignSelf: "stretch",
  },
});

export default RichTextRenderer;
