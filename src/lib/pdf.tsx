import { Document, Page, renderToBuffer, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingBottom: 64,
    paddingHorizontal: 72,
    fontSize: 11,
    fontFamily: "Times-Roman",
    lineHeight: 1.5,
  },
  heading: { fontSize: 12, fontFamily: "Times-Bold", marginTop: 12, marginBottom: 4 },
  paragraph: { marginBottom: 8 },
  listItem: { marginBottom: 4, paddingLeft: 12 },
});

type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "listItem"; text: string };

/** Minimal Markdown → PDF block mapping; appeal letters only need headings,
 *  paragraphs, and lists. */
function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const text = line.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
    if (/^#{1,6}\s/.test(text)) {
      blocks.push({ kind: "heading", text: text.replace(/^#{1,6}\s*/, "") });
    } else if (/^[-*•]\s/.test(text)) {
      blocks.push({ kind: "listItem", text: `• ${text.replace(/^[-*•]\s*/, "")}` });
    } else {
      blocks.push({ kind: "paragraph", text });
    }
  }
  return blocks;
}

export async function renderLetterPdf(markdown: string): Promise<Buffer> {
  const blocks = parseBlocks(markdown);
  return renderToBuffer(
    <Document>
      <Page size="LETTER" style={styles.page}>
        {blocks.map((block, i) => (
          <View key={i} style={block.kind === "listItem" ? styles.listItem : undefined}>
            <Text style={block.kind === "heading" ? styles.heading : styles.paragraph}>
              {block.text}
            </Text>
          </View>
        ))}
      </Page>
    </Document>,
  );
}
