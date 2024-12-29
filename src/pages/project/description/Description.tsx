import React from "react";
import { useState } from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import Editor, { loader } from "@monaco-editor/react";
import { getConfigPath } from "../../../utils/ConfigPathKeeper";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";


import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

export default function Description() {
  const [code, setCode] = useState("");
  const load_with_toast = () => {
    const configPath = getConfigPath();
    invoke("load_description", { configPath: configPath })
      .then((res: string) => {
        toast.success("Description loaded");
        setCode(res);
      })
      .catch((e) => {
        toast.error("Failed to load description: " + e);
        setCode("");
      });
  };
  const save_with_toast = (value: string) => {
    const configPath = getConfigPath();
    invoke("save_description", { configPath: configPath, desc: value })
      .then(() => {
        toast.success("Description saved");
      })
      .catch((e) => {
        toast.error("Failed to save description: " + e);
      });
  };

  const debouncedSave = React.useCallback(
    debounce((value) => save_with_toast(value), 1500),
    [],
  );

  const save_desc = (desc: string) => {
    setCode(desc);
    debouncedSave(desc);
  };

  loader.config({ monaco });
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
            Problem Description
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
          onMount={load_with_toast}
          options={options}
          onChange={(e) => {
            save_desc(e);
          }}
        />
      </Flex>
    </>
  );
}
