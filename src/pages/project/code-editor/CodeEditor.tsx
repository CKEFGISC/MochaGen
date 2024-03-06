import { Flex, Heading } from "@radix-ui/themes";
import Editor, { loader } from "@monaco-editor/react";
export default function CodeEditor() {
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
        <Flex direction="column">
          <Heading size="8" align="center">
            SourceCode-Editor <br />
          </Heading>
          <Editor height="70vh" width="80vw" theme="vs" defaultLanguage="cpp" />
        </Flex>
      </Flex>
    </>
  );
}
