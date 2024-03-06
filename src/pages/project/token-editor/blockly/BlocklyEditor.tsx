import React from "react";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { blocks } from "./blocks/tokenblocks";
import { CrossTabCopyPaste } from "@blockly/plugin-cross-tab-copy-paste";
import { tokenGenerator } from "./generators/token";
import { save, load } from "./serialization";
import { toolbox } from "./toolbox";
import "./blockly.css";

export default function BlocklyEditor(props: any) {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const codeDivRef = useRef<HTMLPreElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [storageKey, setStorageKey] = useState<string>(props.subtask_key);

  // Register the blocks and generator with Blockly
  Blockly.common.defineBlocks(blocks);

  useEffect(() => {
    // 當 props.subtask_key 改變時，更新 blocklyDiv 的 id
    if (workspaceRef.current) {
      save(workspaceRef.current, storageKey, props.subtask_content);
      setStorageKey(props.subtask_key);
      workspaceRef.current.clear();
      load(workspaceRef.current, storageKey, props.subtask_content);
    }
  }, [props.subtask_key]);

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

      const options = {
        contextMenu: true,
        shortcut: true,
      };

      // Initialize plugin.
      // const plugin = new CrossTabCopyPaste();
      // plugin.init(options);

      // Load the initial state from storage and run the code.
      load(workspace, storageKey, props.subtask_content);
      runCode(workspace);

      // Every time the workspace changes state, save the changes to storage.
      workspace.addChangeListener((e) => {
        if (e.isUiEvent) return;
        if (workspace) save(workspace, storageKey, props.subtask_content);
      });

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
    const code = tokenGenerator.workspaceToCode(workspace);
    if (codeDivRef.current) codeDivRef.current.textContent = code;
  };

  return (
    <div id="editorContainer">
      <div ref={blocklyDivRef} id="blocklyDiv"></div>
      <div id="outputPane">
        <pre id="generatedCode">
          <code ref={codeDivRef}></code>
        </pre>
      </div>
    </div>
  );
}
