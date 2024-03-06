import BlocklyEditor from "./blockly/BlocklyEditor";
import React from "react";
import { Grid, Tabs, Text, Box, Flex } from "@radix-ui/themes";

// TODO: Replace with real data
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

const TokenEditor: React.FC = () => {
  return (
    <Tabs.Root defaultValue="subtask0">
      <Tabs.List>
        {subtasks.map((subtaskContent, subtaskIndex) => (
          <Tabs.Trigger value={"subtask" + subtaskIndex.toString()}> {subtaskContent.name}</Tabs.Trigger>
        ))}
      </Tabs.List>

      <Box>
        {subtasks.map((subtaskContent, subtaskIndex) => (
          <Tabs.Content value={"subtask" + subtaskIndex.toString()}>
            <Flex direction="column" width="100%" align="start" justify="start" gap="4" m="4">
              <Text size="2">Subtask {subtaskContent.name}</Text>
              <BlocklyEditor subtask_key={"subtask" + subtaskIndex.toString()} subtask_json={subtaskContent} />
            </Flex>
          </Tabs.Content>
        ))}
      </Box>
    </Tabs.Root>
  );
};

export default TokenEditor;
