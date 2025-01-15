// app/components/RichTextRenderer.tsx

import React from 'react';
import { StyleSheet, Text, View, Linking, Image } from 'react-native';
import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer';
import { Document, BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import Timer from './Timer'; // Timer 컴포넌트 임포트
import HorizontalLine from './HorizontalLine'; // HorizontalLine 컴포넌트 임포트

interface RichTextRendererProps {
  content: Document | string;
  style?: any;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  style,
}) => {
  const textColor = style?.color || '#000'; // 전달된 색상 또는 기본 색상

  if (typeof content === 'string') {
    return (
      <View style={style}>
        <Text style={[styles.text, style, { color: textColor, flexShrink: 1 }]}>
          {content}
        </Text>
      </View>
    );
  }

  const options: Options = {
    renderNode: {
      /** ========== 문단 & 제목들 ========== */
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <Text
          style={[
            styles.text,
            style,
            { marginVertical: 5, color: textColor, flexShrink: 1 },
          ]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_1]: (node, children) => (
        <Text
          style={[
            styles.heading,
            style,
            { fontSize: 24, color: textColor, flexShrink: 1 },
          ]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <Text
          style={[
            styles.heading,
            style,
            { fontSize: 22, color: textColor, flexShrink: 1 },
          ]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <Text
          style={[
            styles.heading,
            style,
            { fontSize: 20, color: textColor, flexShrink: 1 },
          ]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <Text
          style={[
            styles.heading,
            style,
            { fontSize: 18, color: textColor, flexShrink: 1 },
          ]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_5]: (node, children) => (
        <Text
          style={[
            styles.heading,
            style,
            { fontSize: 16, color: textColor, flexShrink: 1 },
          ]}
        >
          {children}
        </Text>
      ),
      [BLOCKS.HEADING_6]: (node, children) => (
        <Text
          style={[
            styles.heading,
            style,
            { fontSize: 14, color: textColor, flexShrink: 1 },
          ]}
        >
          {children}
        </Text>
      ),

      /** ========== OrderedList / UnorderedList ========== */
      'unordered-list': (node, children) => (
        <UnorderedList textColor={textColor}>{children}</UnorderedList>
      ),
      'ordered-list': (node, children) => (
        <OrderedList textColor={textColor}>{children}</OrderedList>
      ),

      /** ========== 리스트 아이템 ========== */
      [BLOCKS.LIST_ITEM]: (node, children) => <ListItem>{children}</ListItem>,

      /** ========== EMBEDDED ENTRY (예: Timer) ========== */
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const contentTypeId = node.data.target.sys.contentType.sys.id;
        if (contentTypeId === 'timer') {
          const duration = node.data.target.fields.duration; // 초 단위
          const stepNumber = node.data.target.fields.stepNumber; // stepNumber 추가
          return (
            <Timer
              duration={duration}
              stepNumber={stepNumber}
              onFinish={() => {
                /* 원하는 로직 */
              }}
              style={{ marginVertical: 10 }}
            />
          );
        }
        return (
          <View>
            <Text style={{ color: textColor }}>Embedded Entry</Text>
          </View>
        );
      },

      /** ========== EMBEDDED ASSET (이미지 등) ========== */
      [BLOCKS.EMBEDDED_ASSET]: (node) => (
        <Image
          source={{ uri: `https:${node.data.target.fields.file.url}` }}
          style={{ width: 200, height: 200, marginVertical: 10, flexShrink: 1 }}
          resizeMode="cover"
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel="Embedded Image"
        />
      ),

      /** ========== 수평선 ========== */
      [BLOCKS.HR]: () => {
        return (
          <HorizontalLine color="#ddd" thickness={1} marginVertical={10} />
        );
      },

      /** ========== 링크 (Hyperlink) ========== */
      [INLINES.HYPERLINK]: (node, children) => (
        <Text
          style={{
            color: 'blue',
            textDecorationLine: 'underline',
            flexShrink: 1,
          }}
          onPress={() => Linking.openURL(node.data.uri)}
          accessible={true}
          accessibilityRole="link"
          accessibilityLabel="Open link"
          accessibilityHint="Opens the link in your browser"
        >
          {children}
        </Text>
      ),

      /** ========== 처리되지 않은 블록 타입 핸들링 ========== */
      '*': (node, children) => {
        console.warn('Unsupported Block:', node.nodeType);
        return (
          <View>
            <Text style={{ color: textColor }}>
              Unsupported Block: {node.nodeType}
            </Text>
          </View>
        );
      },
    },
    renderMark: {
      [MARKS.BOLD]: (text) => (
        <Text style={{ fontWeight: 'bold', color: textColor, flexShrink: 1 }}>
          {text}
        </Text>
      ),
      [MARKS.ITALIC]: (text) => (
        <Text style={{ fontStyle: 'italic', color: textColor, flexShrink: 1 }}>
          {text}
        </Text>
      ),
      // 추가적인 마크 처리 가능
    },
    renderText: (text) => (
      <Text style={[styles.text, style, { color: textColor, flexShrink: 1 }]}>
        {text}
      </Text>
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
    <View style={styles.orderedList}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={styles.orderedListItem}>
          <Text style={[styles.orderedListNumber, { color: textColor }]}>
            {index + 1}.
          </Text>
          <View style={styles.listItemTextContainer}>{child}</View>
        </View>
      ))}
    </View>
  );
};

// UnorderedList 컴포넌트: 불릿 리스트 렌더링
const UnorderedList = ({ children, textColor }) => {
  return (
    <View style={styles.unorderedList}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={styles.unorderedListItem}>
          <Text style={[styles.unorderedListBullet, { color: textColor }]}>
            •
          </Text>
          <View style={styles.listItemTextContainer}>{child}</View>
        </View>
      ))}
    </View>
  );
};

// ListItem 컴포넌트: 리스트 아이템 렌더링
const ListItem = ({ children }) => {
  return <View style={styles.listItem}>{children}</View>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    // color: "#000", // 기본 색상 제거
  },
  heading: {
    fontWeight: 'bold',
    // color: "#000", // 기본 색상 제거
  },
  // hr 스타일 제거

  /** -- OrderedList -- */
  orderedList: {
    marginVertical: 5,
    paddingLeft: 10,
  },
  orderedListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  orderedListNumber: {
    marginRight: 5,
  },
  listItemTextContainer: {
    flex: 1,
  },

  /** -- UnorderedList -- */
  unorderedList: {
    marginVertical: 5,
    paddingLeft: 10,
  },
  unorderedListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  unorderedListBullet: {
    marginRight: 5,
  },

  listItem: {
    flexDirection: 'column',
  },

  quoteContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
    paddingLeft: 10,
    marginVertical: 5,
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#555',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginVertical: 10,
  },
});

export default RichTextRenderer;
