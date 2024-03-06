import BlocklyEditor, { replaceToken } from "./blockly/BlocklyEditor";
import React from "react";
import { Grid, Tabs, Text, Box, Flex, Heading, Button, AlertDialog, Container } from "@radix-ui/themes";

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

function CopyTokens(props: any) {
  if (props.currentSubtaskIndex == 0) {
    return <div />;
  }
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button radius="large"> Copy tokens from {props.firstSubtaskContent.name}</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Copy tokens from {props.firstSubtaskContent.name}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? Tokens of current subtask ({props.currentSubtaskContent.name}) will be replaced by{" "}
          {props.firstSubtaskContent.name}'s tokens .
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color="red"
              onClick={() => {
                replaceToken(props.currentSubtaskIndex, props.currentSubtaskContent, props.firstSubtaskContent);
              }}
            >
              Replace and Copy
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

const TokenEditor: React.FC = () => {
  return (
    <Flex direction="column" gap="0" justify="start">
      <Heading
        size="5"
        style={{
          textAlign: "center",
        }}
      >
        Token Editor
      </Heading>

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
                <Grid columns="2" rows="1" width="100%">
                  <div>
                    <Text size="2">
                      Drag the blocks to edit tokens of {subtaskContent.name}. <br />
                    </Text>
                    <Text size="2">Tokens will be transform into generator.cpp later.</Text>
                  </div>
                  <Flex direction="row-reverse">
                    <CopyTokens
                      currentSubtaskIndex={subtaskIndex}
                      currentSubtaskContent={subtaskContent}
                      firstSubtaskContent={subtasks[0]}
                    />
                  </Flex>
                </Grid>

                <BlocklyEditor subtask_key={"subtask" + subtaskIndex.toString()} subtask_content={subtaskContent} />
              </Flex>
            </Tabs.Content>
          ))}
        </Box>
      </Tabs.Root>
    </Flex>
  );
};

export default TokenEditor;
