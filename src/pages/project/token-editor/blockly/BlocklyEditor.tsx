import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { blocks } from "./blocks/tokenblocks";
import { CrossTabCopyPaste } from "@blockly/plugin-cross-tab-copy-paste";
import { tokenGenerator } from "./generators/token";
import { save, load, saveCode } from "./serialization";
import { toolbox } from "./toolbox";
import "./blockly.css";

export function replaceToken(currentSubtaskIndex: number, currentSubtaskContent: JSON, firstSubtaskContent: JSON) {
  console.log("Replace and Copy");
  load(Blockly.getMainWorkspace(), "subtask0", firstSubtaskContent);
  save(Blockly.getMainWorkspace(), "subtask" + currentSubtaskIndex, currentSubtaskContent);
}

export default function BlocklyEditor(props: any) {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const codeDivRef = useRef<HTMLPreElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [storageKey, setStorageKey] = useState<string>(props.subtask_key);

  // Register the blocks and generator with Blockly
  Blockly.common.defineBlocks(blocks);

  const options = {
    contextMenu: true,
    shortcut: true,
  };

  if (!Blockly.ContextMenuRegistry.registry.getItem("blockCopyToStorage")) {
    const plugin = new CrossTabCopyPaste();
    plugin.init(options);
  }

  useEffect(() => {
    // 當 props.subtask_key 改變時，更新 blocklyDiv 的 id
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      setStorageKey(props.subtask_key);
      console.error("load1", props.subtask_key);
      load(workspaceRef.current, props.subtask_key, props.subtask_content);
      runCode(workspaceRef.current);
    }
  }, [props.subtask_key, blocklyDivRef]);

  useEffect(() => {
    const blocklyDiv = blocklyDivRef.current;
    if (blocklyDiv && !workspaceRef.current) {
      console.log("Creating new workspace");
      const workspace = Blockly.inject("blocklyDiv", {
        toolbox: toolbox,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 0.8,
          maxScale: 3,
          minScale: 0.1,
          scaleSpeed: 1.0,
          pinch: true,
        },
        disable: true,
        move: {
          scrollbars: {
            horizontal: true,
            vertical: true,
          },
          drag: true,
          wheel: false,
        },
        trashcan: true,
      });
      workspaceRef.current = workspace;

      // Load the initial state from storage and run the code.
      // console.error("load2", storageKey);
      load(workspace, storageKey, props.subtask_content);
      runCode(workspace);

      // Every time the workspace changes state, save the changes to storage.
      workspace.addChangeListener((e) => {
        if (e.isUiEvent) return;

        if (workspace) {
          console.error("save2", storageKey);
          save(workspace, storageKey, props.subtask_content);
        }
      });

      workspace.addChangeListener(Blockly.Events.disableOrphans);

      // Whenever the workspace changes meaningfully, run the code again.
      workspace.addChangeListener((e) => {
        if (e.isUiEvent || e.type === Blockly.Events.FINISHED_LOADING || (workspace && workspace.isDragging())) {
          return;
        }
        runCode(workspace);
      });
    }
  }, [blocklyDivRef]);

  const runCode = (workspace: Blockly.WorkspaceSvg) => {
    try {
      const code = tokenGenerator.workspaceToCode(workspace);
      saveCode(props.subtask_content, code);
      if (codeDivRef.current) codeDivRef.current.textContent = code;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="editorContainer">
      <div ref={blocklyDivRef} id="blocklyDiv"></div>
      <div id="outputPane" style={{ overflow: "auto", display: "none" }}>
        <pre id="generatedCode">
          <code ref={codeDivRef}></code>
        </pre>
      </div>
    </div>
  );
}
