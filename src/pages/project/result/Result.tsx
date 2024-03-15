import React, { useState, useContext, useEffect } from "react";
import { Button, Flex, Heading, Text, Table, Tabs } from "@radix-ui/themes";
import LoadContext from "../../../utils/loading/LoadContext";
import { getConfigPath } from "../../../utils/ConfigPathKeeper";
import { invoke } from "@tauri-apps/api";
import { toast } from "react-toastify";
import { resolveResource } from "@tauri-apps/api/path";

const Result: React.FC = () => {
  const [status, setStatus] = useState([
    [
      {
        generator: "Not Generated",
        validator: "Not Validated",
      },
    ],
  ]);
  const { toggleLoading, setLog } = useContext(LoadContext);
  const [subtasks, setSubtasks] = useState([
    {
      name: "subtask1",
      testcase_count: 1,
      generator: "subtasks/1/generator.cpp",
      validator: "subtasks/1/validator.cpp",
      token: "subtasks/1/token.json",
      blockly: "subtasks/1/blockly.json",
    },
  ]);
  const generate = () => {
    setLog("Preparing your testdata and a cup of Mocha...");
    toggleLoading();
    resolveResource(".").then((resourcePath) => {
      invoke("generate_testdata", { path: getConfigPath(), libPath: resourcePath })
        .then(() => {
          let newStatus = [];
          subtasks.map((subtask, subtaskID) => {
            invoke("validate_subtask", { path: getConfigPath(), subtaskIndex: subtaskID })
              .then((validateStatus: string) => {
                let subtaskStatus = [];
                validateStatus.split("").forEach((val) => {
                  subtaskStatus.push({
                    generator: "Generated",
                    validator: val == "1" ? "Validated" : "Validation Failed",
                  });
                  newStatus.push(subtaskStatus);
                });
              })
              .catch((e: string) => {
                toast.error("Validation failed on " + subtask["name"] + ": " + e);
                throw e;
              });
          });
          setStatus(newStatus);
          setLog("");
          toggleLoading();
        })
        .catch((e) => {
          toast.error("Generation failed: " + e);
          setLog("");
          toggleLoading();
          throw e;
        });
    });
  };

  // Get subtasks from backend
  useEffect(() => {
    let active = true;
    const load = async () => {
      await invoke("get_subtasks", { configPath: getConfigPath() })
        .then((result: string) => {
          if (active) {
            let currentSubtasks = JSON.parse(result);
            let currentStatus = [];
            setSubtasks(currentSubtasks);
            currentSubtasks.map((subtask: any) => {
              let subtaskStatus = [];
              for (let i = 0; i < subtask["testcase_count"]; ++i) {
                subtaskStatus.push({
                  generator: "Not Generated",
                  validator: "Not Validated",
                });
              }
              currentStatus.push(subtaskStatus);
            });
            setStatus(currentStatus);
          }
        })
        .catch((e: string) => {
          console.error("API call failed:", e);
          throw e;
        });
    };
    load();
    return () => {
      active = false;
    };
  }, []);

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
            Testdata Results
          </Heading>
          <Text align="center">Time for some generated testdata!</Text>
        </Flex>
        <Button size="4" onClick={() => generate()}>
          Generate
        </Button>
        <Tabs.Root defaultValue="subtask0" style={{ width: "90%" }}>
          <Tabs.List>
            {subtasks.map((subtaskContent, subtaskIndex) => (
              <Tabs.Trigger value={"subtask" + subtaskIndex.toString()}> {subtaskContent.name}</Tabs.Trigger>
            ))}
          </Tabs.List>
          {subtasks.map((_subtaskContent, subtaskIndex) => {
            return (
              <Tabs.Content value={"subtask" + subtaskIndex.toString()}>
                <Flex direction="row" gap="4" m="4" align="center" width="100%" justify="center">
                  <Flex direction="column" gap="2" align="center" width="100%" justify="center">
                    <Table.Root style={{ width: "100%" }}>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>Index</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Generator Status</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Validator Status</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {status[subtaskIndex].map((testcaseStatus, testcaseID) => (
                          <Table.Row>
                            <Table.RowHeaderCell>{testcaseID}</Table.RowHeaderCell>
                            <Table.Cell>{testcaseStatus["generator"]}</Table.Cell>
                            <Table.Cell>{testcaseStatus["validator"]}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                    <Button m="6" size="4" style={{ visibility: "hidden" }}>
                      Open Folder
                    </Button>
                  </Flex>
                </Flex>
              </Tabs.Content>
            );
          })}
        </Tabs.Root>
      </Flex>
    </>
  );
};

export default Result;
