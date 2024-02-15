import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { blocks } from "./blocks/text";
import { forBlock } from "./generators/javascript";
import { javascriptGenerator } from "blockly/javascript";
import { save, load } from "./serialization";
import { toolbox } from "./toolbox";
import "./blockly.css";

export default function BlocklyEditor() {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const codeDivRef = useRef<HTMLPreElement | null>(null);
  const outputDivRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    const blocklyDiv = blocklyDivRef.current;
    if (blocklyDiv && !workspaceRef.current) {
      console.log("GGG");
      const workspace = Blockly.inject("blocklyDiv", { toolbox });
      workspaceRef.current = workspace;

      // Register the blocks and generator with Blockly
      Blockly.common.defineBlocks(blocks);
      Object.assign(javascriptGenerator.forBlock, forBlock);

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
    const code = javascriptGenerator.workspaceToCode(workspace);

    if (codeDivRef.current) codeDivRef.current.textContent = code;
    if (outputDivRef.current) outputDivRef.current.innerHTML = "";

    try {
      eval(code);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="editorContainer">
      <div id="outputPane">
        <pre id="generatedCode">
          <code ref={codeDivRef}></code>
        </pre>
        <div ref={outputDivRef} id="blocklyOutput"></div>
      </div>
      <div ref={blocklyDivRef} id="blocklyDiv"></div>
    </div>
  );
}
