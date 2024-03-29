import BlocklyEditor, { replaceToken } from "./blockly/BlocklyEditor";
import React, { useEffect, useState } from "react";
import { Grid, Tabs, Text, Box, Flex, Heading, Button, AlertDialog } from "@radix-ui/themes";
import { invoke } from "@tauri-apps/api/tauri";
import { getConfigPath } from "../../../utils/ConfigPathKeeper";
import { toast } from "react-toastify";

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
  // TODO: Replace with real data
  const [subtasks, setSubtasks] = useState([]);

  // Get subtasks from backend
  useEffect(() => {
    let active = true;
    const load = async () => {
      await invoke("get_subtasks", { configPath: getConfigPath() })
        .then((result: string) => {
          if (active) setSubtasks(JSON.parse(result));
        })
        .catch((e: string) => {
          console.error("API call failed:", e);
          toast.error("Failed to get subtasks from backend");
          throw e;
        });
    };
    load();
    return () => {
      active = false;
    };
  }, []);

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
