import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { blocks } from "./blocks/tokenblocks";
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
      const workspace = Blockly.inject("blocklyDiv", { toolbox });
      workspaceRef.current = workspace;

      workspace.registerButtonCallback("createNewIdPressed", () => {
        Blockly.Variables.createVariableButtonHandler(workspace, () => {}, "panda");
      });

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
      <button
        onClick={() => {
          if (workspaceRef.current) runCode(workspaceRef.current);
        }}
      >
        RUN
      </button>
    </div>
  );
}
