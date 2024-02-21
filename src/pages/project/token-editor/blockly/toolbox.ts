/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/
import * as Blockly from "blockly";

export const toolbox = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "block",
      type: "generator",
    },
    {
      kind: "block",
      type: "set_id",
    },
    {
      kind: "block",
      type: "get_id",
    },
    {
      kind: "block",
      type: "integer",
    },
    {
      kind: "block",
      type: "float",
    },
    {
      kind: "block",
      type: "array",
    },
    {
      kind: "block",
      type: "permutation",
    },
    {
      kind: "block",
      type: "string",
    },
    {
      kind: "block",
      type: "graph",
    },
    {
      kind: "block",
      type: "tree",
    },
  ],
};
