import React, { useState, useContext, useEffect } from "react";
import { Button, Flex, Heading, Text, Table, Tabs } from "@radix-ui/themes";
import LoadContext from "../../../utils/loading/LoadContext";
import Loading from "../../../utils/loading/Loading";
import { getConfigPath } from "../../../utils/ConfigPathKeeper";
import { invoke } from "@tauri-apps/api";
import { toast } from "react-toastify";
import { resolveResource } from "@tauri-apps/api/path";

type TestcaseStatus = {
  generator: string;
  validator: string;
};
type Subtask = {
  name: string;
  testcase_count: number;
  generator: string;
  validator: string;
  token: string;
  blockly: string;
};

const Result: React.FC = () => {
  const [status, setStatus] = useState<Array<Array<TestcaseStatus>>>(null);
  const { isLoading, toggleLoading, setLog } = useContext(LoadContext);
  const [subtasks, setSubtasks] = useState<Array<Subtask>>(null);
  const generate = () => {
    setLog("Preparing your testdata and a cup of Mocha...");
    toggleLoading();
    resolveResource(".").then((resourcePath) => {
      let currentStatus = status;
      invoke("generate_testdata", { path: getConfigPath(), libPath: resourcePath })
        .then(() => {
          subtasks.map((subtask, subtaskID) => {
            invoke("validate_subtask", { path: getConfigPath(), subtaskIndex: subtaskID })
              .then((validateStatus: string) => {
                for (let i = 0; i < subtask["testcase_count"]; ++i) {
                  currentStatus[subtaskID][i] = {
                    generator: "Generated",
                    validator: validateStatus[i] == "1" ? "Validated" : "Validation Failed",
                  };
                }
              })
              .catch((e: string) => {
                for (let i = 0; i < subtask["testcase_count"]; ++i) {
                  currentStatus[subtaskID][i] = {
                    generator: "Generated",
                    validator: "Validation Failed",
                  };
                  toast.error("Validation failed on " + subtask["name"] + ": " + e);
                }
              });
          });
        })
        .catch((e) => {
          subtasks.map((subtask: any, subtaskID) => {
            for (let i = 0; i < subtask["testcase_count"]; ++i) {
              currentStatus[subtaskID][i] = {
                generator: "Generation Failed",
                validator: "Not Validated",
              };
            }
          });
          toast.error("Generation failed: " + e);
        })
        .finally(() => {
          setLog("");
          toggleLoading();
          setStatus(currentStatus);
        });
    });
  };

  // Get subtasks from backend
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLog("Loading your subtasks...");
      toggleLoading();
      await invoke("get_subtasks", { configPath: getConfigPath() })
        .then((result: string) => {
          let currentSubtasks = JSON.parse(result);
          if (active) setSubtasks(currentSubtasks);
          if (status === null) {
            console.log(status);
            let currentStatus = [];
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
            if (active) setStatus(currentStatus);
          }
        })
        .catch((e: string) => {
          console.error("API call failed:", e);
        })
        .finally(() => {
          setLog("");
          toggleLoading();
        });
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
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
        {status && subtasks && (
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
                              <Table.Cell>
                                <Text color={testcaseStatus["generator"] == "Generated" ? "green" : "red"}>
                                  {testcaseStatus["generator"]}
                                </Text>
                              </Table.Cell>
                              <Table.Cell>
                                <Text color={testcaseStatus["validator"] == "Validated" ? "green" : "red"}>
                                  {testcaseStatus["validator"]}
                                </Text>
                              </Table.Cell>
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
        )}
      </Flex>
    </>
  );
};

export default Result;
