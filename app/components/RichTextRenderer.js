// app/components/RichTextRenderer.js

import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";

const RichTextRenderer = ({ document }) => {
  const renderNode = (node, index) => {
    console.log("Rendering node:", node); // 각 노드 로그 확인
    switch (node.nodeType) {
      case BLOCKS.PARAGRAPH:
        return (
          <Text key={index} style={styles.paragraph}>
            {node.content.map((child, i) => renderNode(child, i))}
          </Text>
        );
      case BLOCKS.HEADING_1:
        return (
          <Text key={index} style={styles.heading1}>
            {node.content.map((child, i) => renderNode(child, i))}
          </Text>
        );
      case BLOCKS.HEADING_2:
        return (
          <Text key={index} style={styles.heading2}>
            {node.content.map((child, i) => renderNode(child, i))}
          </Text>
        );
      case BLOCKS.UL_LIST:
        return (
          <View key={index} style={styles.ulList}>
            {node.content.map((child, i) => renderNode(child, i))}
          </View>
        );
      case BLOCKS.LIST_ITEM:
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>• </Text>
            <Text style={styles.listItemText}>
              {node.content.map((child, i) => renderNode(child, i))}
            </Text>
          </View>
        );
      case BLOCKS.EMBEDDED_ASSET:
        return (
          <Image
            key={index}
            source={{ uri: `https:${node.data.target.fields.file.url}` }}
            style={styles.embeddedImage}
          />
        );
      case INLINES.HYPERLINK:
        return (
          <TouchableOpacity
            key={index}
            onPress={() => Linking.openURL(node.data.uri)}
          >
            <Text style={styles.link}>
              {node.content.map((child, i) => renderNode(child, i))}
            </Text>
          </TouchableOpacity>
        );
      case MARKS.BOLD:
        return (
          <Text key={index} style={styles.bold}>
            {node.value}
          </Text>
        );
      case MARKS.ITALIC:
        return (
          <Text key={index} style={styles.italic}>
            {node.value}
          </Text>
        );
      default:
        console.warn(`Unhandled node type: ${node.nodeType}`); // 처리되지 않은 노드 타입 경고
        return null;
    }
  };

  return (
    <View>
      {document.content.map((node, index) => renderNode(node, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  ulList: {
    paddingLeft: 10,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bullet: {
    fontSize: 16,
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
  italic: {
    fontStyle: "italic",
    color: "#333",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  embeddedImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default RichTextRenderer;
