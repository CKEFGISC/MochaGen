import { Flex, Heading, Text } from "@radix-ui/themes";
import Editor, { loader } from "@monaco-editor/react";
export default function Description() {
  loader.config({ paths: { vs: "/node_modules/monaco-editor/min/vs" } });
  return (
    <>
      <Flex
        display="flex"
        direction="column"
        justify="start"
        align="center"
        wrap="wrap"
        gap="4"
        style={{
          height: "max-content",
          flex: "1",
        }}
      >
        <Flex direction="column" gap="2" align="center" width="100%" height="max-content">
          <Heading
            size="5"
            style={{
              textAlign: "center",
            }}
          >
            Project Settings
          </Heading>
          <Text align="center">Get your description ready! (Markdown syntax only)</Text>
        </Flex>
        <Editor height="70vh" width="80vw" theme="vs" defaultLanguage="markdown" />
      </Flex>
    </>
  );
}
