import { useEffect, useState, useRef } from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import Editor, { loader } from "@monaco-editor/react";
import { getConfigPath, getProjectPath } from "../../../utils/ConfigPathKeeper";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "react-toastify";
export default function Description() {
  const [code, setCode] = useState("");
  const mounted = useRef(false);
  useEffect(() => {
    getProjectPath().then((projectPath: string) => {
      if (mounted.current === false) {
        mounted.current = true;
        invoke("load_description", { projectPath: projectPath })
          .then((res: string) => {
            setCode(res);
          })
          .catch((e) => {
            toast.error("Failed to load description: " + e);
          });
      } else {
        invoke("save_description", { projectPath: projectPath, desc: code })
          .then(() => {
            toast.success("Description saved");
          })
          .catch(() => {
            toast.error("Failed to save description");
          });
      }
      return () => {
        mounted.current = false;
        invoke("save_description", { projectPath: projectPath, desc: code })
          .then(() => {
            toast.success("Description saved");
          })
          .catch(() => {
            toast.error("Failed to save description");
          });
      };
    });
  }, [code]);

  loader.config({ paths: { vs: "/node_modules/monaco-editor/min/vs" } });
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
        <Editor
          height="70vh"
          width="80vw"
          theme="vs"
          defaultLanguage="markdown"
          value={code}
          defaultValue={code}
          options={options}
          onChange={(newValue) => {
            setCode(newValue);
          }}
        />
      </Flex>
    </>
  );
}
