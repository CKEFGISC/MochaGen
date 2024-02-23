import * as Blockly from "blockly";

export const tokenGenerator = new Blockly.Generator("TOKEN");

tokenGenerator.forBlock["generator"] = function (block, generator) {
  return "generator";
};
