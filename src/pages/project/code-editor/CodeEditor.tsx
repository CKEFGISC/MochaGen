import { Flex, Heading, Text, Tabs } from "@radix-ui/themes";
import Editor, { loader } from "@monaco-editor/react";
export default function CodeEditor() {
  loader.config({ paths: { vs: "/node_modules/monaco-editor/min/vs" } });

  // TODO: Get subtasks from backend
  const subtasks = [
    {
      name: "subtask1",
      testcase_count: 5,
      generator: "subtasks/1/generator.cpp",
      checker: "subtasks/1/checker.cpp",
      token: "subtasks/1/token.json",
      blockly: "subtasks/1/blockly.json",
    },
    {
      name: "subtask2",
      testcase_count: 5,
      generator: "subtasks/2/generator.cpp",
      checker: "subtasks/2/checker.cpp",
      token: "subtasks/2/token.json",
      blockly: "subtasks/2/blockly.json",
    },
  ];

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
          width: "100%",
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
            Generator and Checker Edit
          </Heading>
          <Text align="center">Edit generator.cpp and checker.cpp here.</Text>
        </Flex>

        <Tabs.Root defaultValue="subtask0">
          <Tabs.List>
            {subtasks.map((subtaskContent, subtaskIndex) => (
              <Tabs.Trigger value={"subtask" + subtaskIndex.toString()}> {subtaskContent.name}</Tabs.Trigger>
            ))}
          </Tabs.List>
          {subtasks.map((subtaskContent, subtaskIndex) => (
            <Tabs.Content value={"subtask" + subtaskIndex.toString()}>
              <Flex direction="row" gap="4" m="4" align="center" justify="center">
                <Flex direction="column" gap="2" align="center" justify="center">
                  <Text align="center">generator.cpp</Text>
                  <Editor height="60dvh" width="40vw" theme="vs" defaultLanguage="cpp" />
                </Flex>
                <Flex direction="column" gap="2" align="center" justify="center">
                  <Text align="center">checker.cpp</Text>
                  <Editor height="60dvh" width="40vw" theme="vs" defaultLanguage="cpp" />
                </Flex>
              </Flex>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Flex>
    </>
  );
}
