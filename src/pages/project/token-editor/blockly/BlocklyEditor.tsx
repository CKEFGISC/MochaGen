import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { blocks } from "./blocks/tokenblocks";
import { CrossTabCopyPaste } from "@blockly/plugin-cross-tab-copy-paste";
import { tokenGenerator } from "./generators/token";
import { save, load } from "./serialization";
import { toolbox } from "./toolbox";
import "./blockly.css";

export default function BlocklyEditor() {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const codeDivRef = useRef<HTMLPreElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  // Register the blocks and generator with Blockly
  Blockly.common.defineBlocks(blocks);

  useEffect(() => {
    const blocklyDiv = blocklyDivRef.current;
    if (blocklyDiv && !workspaceRef.current) {
      const workspace = Blockly.inject("blocklyDiv", {
        toolbox: toolbox,
        zoom: {
          controls: true,
          // wheel: true,
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
      const plugin = new CrossTabCopyPaste();
      plugin.init(options);

      // Load the initial state from storage and run the code.
      load(workspace);
      runCode(workspace);

      // Every time the workspace changes state, save the changes to storage.
      workspace.addChangeListener((e) => {
        if (e.isUiEvent) return;
        if (workspace) save(workspace);
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
