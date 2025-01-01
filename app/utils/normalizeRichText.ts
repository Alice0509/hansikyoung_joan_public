// app/utils/normalizeRichText.ts

import { Document, Node, Mark } from "@contentful/rich-text-types";

/**
 * Rich Text 문서의 비표준 노드 타입과 마크를 표준으로 변환하는 함수
 * @param document Contentful Rich Text Document
 * @returns 변환된 Rich Text Document
 */
export const normalizeRichText = (document: Document): Document => {
  const normalizeNode = (node: Node): Node => {
    let newNode = { ...node };

    const nodeTypeLower = newNode.nodeType.toLowerCase();

    // 노드 타입 변환
    switch (nodeTypeLower) {
      case "document":
        newNode.nodeType = "document";
        break;
      case "text":
        newNode.nodeType = "text";
        break;
      case "b":
      case "strong":
        newNode.nodeType = "strong";
        break;
      case "i":
      case "em":
        newNode.nodeType = "em";
        break;
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        newNode.nodeType = `heading-${newNode.nodeType.slice(1)}`; // h4 -> heading-4
        break;
      case "p":
        newNode.nodeType = "paragraph";
        break;
      case "ul":
        newNode.nodeType = "unordered-list";
        break;
      case "ol":
        newNode.nodeType = "ordered-list";
        break;
      case "li":
        newNode.nodeType = "list-item";
        break;
      // 필요한 추가 노드 타입 처리
      case "blockquote":
        newNode.nodeType = "blockquote";
        break;
      case "hr":
        newNode.nodeType = "hr";
        break;
      default:
        console.warn(`Unhandled node type: ${newNode.nodeType}`);
        break;
    }

    // 마크 변환
    if (newNode.marks && Array.isArray(newNode.marks)) {
      newNode.marks = newNode.marks.map((mark: Mark) => {
        const markTypeLower = mark.type.toLowerCase();
        if (markTypeLower === "b" || markTypeLower === "bold") {
          return { type: "strong" };
        }
        if (markTypeLower === "i" || markTypeLower === "italic") {
          return { type: "em" };
        }
        console.warn(`Unhandled mark type: ${mark.type}`);
        return mark;
      });
    }

    // 자식 노드 재귀 변환
    if (newNode.content && Array.isArray(newNode.content)) {
      newNode.content = newNode.content.map((child) => normalizeNode(child));
    }

    return newNode;
  };

  return normalizeNode(document) as Document;
};
