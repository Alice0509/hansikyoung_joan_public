// app/utils/extractTextFromRichText.ts

import { Document } from '@contentful/rich-text-types';

export const extractTextFromRichText = (document: Document): string => {
  let text = '';

  const traverse = (node: any) => {
    if (typeof node === 'string') {
      text += node;
    } else if (node.nodeType === 'text') {
      text += node.value;
    } else if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  };

  traverse(document);
  return text;
};
