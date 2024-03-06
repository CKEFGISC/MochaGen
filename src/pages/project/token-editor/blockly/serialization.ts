/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";

const storageKey = (Math.random() + 1).toString(36).substring(7);

/**
 * Saves the state of the workspace to browser's local storage.
 * @param workspace Blockly workspace to save.
 */
export const save = function (workspace: Blockly.Workspace, subtask_key: string, subtask_content: JSON) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.sessionStorage?.setItem(storageKey + subtask_key, JSON.stringify(data));
};

/**
 * Loads saved state from local storage into the given workspace.
 * @param workspace Blockly workspace to load into.
 */
export const load = function (workspace: Blockly.Workspace, subtask_key: string, subtask_content: JSON) {
  const data = window.sessionStorage?.getItem(storageKey + subtask_key);
  if (!data) return;

  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(JSON.parse(data), workspace, undefined);
  Blockly.Events.enable();
};
