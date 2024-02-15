import * as Blockly from "blockly";

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: "object",
    message0: "{ %1 %2 }",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "MEMBERS",
      },
    ],
    output: null,
    colour: 230,
  },
]);
