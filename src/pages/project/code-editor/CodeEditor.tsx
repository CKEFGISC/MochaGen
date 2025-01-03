import React, { useEffect, useState } from "react";
import { Flex, Heading, Text, Tabs, Button } from "@radix-ui/themes";
import Editor, { loader } from "@monaco-editor/react";
import { invoke } from "@tauri-apps/api/tauri";
import { getConfigPath } from "../../../utils/ConfigPathKeeper";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

export default function CodeEditor() {
  loader.config({ monaco });

  const defaultValidatorCode = `#include<iostream>
#define AC 1
#define WA 0

int main(){
    bool validation_passed = true;
    // add your validation logic here

    if(validation_passed) std::cout << AC;
    else std::cout << WA;
    // do not output anything other than the status code
    return 0;
}`;
  const options: Object = {
    autoIndent: "full",
    contextmenu: true,
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    minimap: {
      enabled: false,
    },
    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 18,
    },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true,
  };

  const [genCode, setGenCode] = useState("");
  const [validatorCode, setValidatorCode] = useState("");

  const load_gen_with_toast = (subtaskIndex: number) => {
    const configPath = getConfigPath();
    invoke("load_gen_cpp", { configPath: configPath, subtaskIndex: subtaskIndex })
      .then((res: string) => {
        toast.success("generator.cpp loaded!");
        setGenCode(res);
      })
      .catch((e) => {
        toast.error("Failed to load generator.cpp: " + e);
      });
  };
  const save_gen_with_toast = (subtaskIndex: number, value: string) => {
    const configPath = getConfigPath();
    invoke("save_gen_cpp", { configPath: configPath, subtaskIndex: subtaskIndex, genCpp: value })
      .then(() => {
        toast.success("generator.cpp saved!");
      })
      .catch((e) => {
        toast.error("Failed to save generator.cpp: " + e);
      });
  };

  const load_validator_with_toast = async (subtaskIndex: number) => {
    const configPath = getConfigPath();
    await invoke("load_validator_cpp", { configPath: configPath, subtaskIndex: subtaskIndex })
      .then((res: string) => {
        toast.success("validator.cpp loaded!");
        if (res === "") {
          res = defaultValidatorCode;
          save_validator_with_toast(subtaskIndex, res);
        }
        setValidatorCode(res);
      })
      .catch((e) => {
        toast.error("Failed to load validator.cpp: " + e);
      });
  };
  const save_validator_with_toast = (subtaskIndex: number, value: string) => {
    const configPath = getConfigPath();
    invoke("save_validator_cpp", { configPath: configPath, subtaskIndex: subtaskIndex, validatorCpp: value })
      .then(() => {
        toast.success("validator.cpp saved!");
      })
      .catch((e) => {
        toast.error("Failed to save validator.cpp: " + e);
      });
  };

  const debouncedGenSave = React.useCallback(
    debounce((value, subtask) => save_gen_with_toast(subtask, value), 1500),
    [],
  );
  const save_gen = (gen: string, subtaskIndex: number) => {
    setGenCode(gen);
    debouncedGenSave(gen, subtaskIndex);
  };
  const deboundedValidatorSave = React.useCallback(
    debounce((value, subtask) => save_validator_with_toast(subtask, value), 1500),
    [],
  );
  const save_validator = (validator: string, subtaskIndex: number) => {
    setValidatorCode(validator);
    deboundedValidatorSave(validator, subtaskIndex);
  };

  const [subtasks, setSubtasks] = useState([
    {
      name: "subtask1",
      testcase_count: 5,
      generator: "subtasks/1/generator.cpp",
      validator: "subtasks/1/validator.cpp",
      token: "subtasks/1/token.json",
      blockly: "subtasks/1/blockly.json",
    },
    {
      name: "subtask2",
      testcase_count: 5,
      generator: "subtasks/2/generator.cpp",
      validator: "subtasks/2/validator.cpp",
      token: "subtasks/2/token.json",
      blockly: "subtasks/2/blockly.json",
    },
  ]);

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
        gap="2"
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
            Generator and Validator Edit
          </Heading>
          <Text align="center">Edit generator.cpp and validator.cpp here.</Text>
        </Flex>

        <Tabs.Root defaultValue="subtask0">
          <Tabs.List>
            {subtasks.map((subtaskContent, subtaskIndex) => (
              <Tabs.Trigger value={"subtask" + subtaskIndex.toString()}> {subtaskContent.name}</Tabs.Trigger>
            ))}
          </Tabs.List>
          {subtasks.map((_subtaskContent, subtaskIndex) => (
            <Tabs.Content value={"subtask" + subtaskIndex.toString()}>
              <Flex direction="row" gap="4" m="4" align="center" justify="center">
                <Flex direction="column" gap="2" align="center" justify="start">
                  <Text align="center">generator.cpp</Text>
                  <Editor
                    height="60dvh"
                    width="40vw"
                    theme="vs"
                    value={genCode}
                    defaultValue={genCode}
                    onMount={() => load_gen_with_toast(subtaskIndex)}
                    onChange={(e) => save_gen(e, subtaskIndex)}
                    options={options}
                    defaultLanguage="cpp"
                  />
                  <Button
                    onClick={() => {
                      invoke("run_parser", { configPath: getConfigPath(), subtaskIndex: subtaskIndex })
                        .then(() => {
                          load_gen_with_toast(subtaskIndex);
                        })
                        .catch((e) => {
                          toast.error("Failed to reload generator from token: " + e);
                          throw e;
                        });
                    }}
                  >
                    Reload Generator from Token
                  </Button>
                </Flex>
                <Flex direction="column" gap="2" align="center" justify="start">
                  <Text align="center">validator.cpp</Text>
                  <Editor
                    height="60dvh"
                    width="40vw"
                    theme="vs"
                    value={validatorCode}
                    defaultValue={validatorCode}
                    onMount={async () => {
                      await load_validator_with_toast(subtaskIndex);
                    }}
                    onChange={(e) => save_validator(e, subtaskIndex)}
                    options={options}
                    defaultLanguage="cpp"
                  />
                  <Button
                    onClick={() => {
                      setValidatorCode(defaultValidatorCode);
                    }}
                  >
                    Reset Validator to Default
                  </Button>
                </Flex>
              </Flex>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Flex>
    </>
  );
}
