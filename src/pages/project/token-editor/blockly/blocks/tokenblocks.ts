import * as Blockly from "blockly";

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: "generator",
    message0: "%1 Subtask %2 %3 %4 Tokens: %5 Output Format: %6",
    args0: [
      {
        type: "field_label_serializable",
        name: "project_name",
        text: "MochaProject",
      },
      {
        type: "field_label_serializable",
        name: "subtask_id",
        text: "1",
      },
      {
        type: "input_end_row",
      },
      {
        type: "input_end_row",
      },
      {
        type: "input_statement",
        name: "token_section",
      },
      {
        type: "input_statement",
        name: "print_section",
      },
    ],
    inputsInline: false,
    colour: "#674024",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "set_id",
    message0: "Set ID %1 to token: %2",
    args0: [
      {
        type: "field_input",
        name: "ID",
        text: "default",
      },
      {
        type: "input_value",
        name: "object",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#AB9B96",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "get_id",
    message0: "Object of ID: %1",
    args0: [
      {
        type: "input_dummy",
        name: "INPUT",
      },
    ],
    extensions: ["dynamic_menu_extension"],
    output: null,
    colour: "#AB9B96",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "integer",
    message0: "Interger %1 attributes: %2",
    args0: [
      {
        type: "input_end_row",
      },
      {
        type: "input_end_row",
      },
    ],
    message1: "Range: Min: %1 Max: %2 %3 %4 is odd? %5 %6 is prime? %7",
    args1: [
      {
        type: "field_number",
        name: "range_left",
        value: 0,
        precision: 1,
      },
      {
        type: "field_number",
        name: "range_right",
        value: 0,
        precision: 1,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "field_checkbox",
        name: "is_odd",
        checked: false,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "field_checkbox",
        name: "is_prime",
        checked: false,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
    ],
    output: null,
    colour: "#ea4f5e",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "float",
    message0: "Float %1 attributes: %2",
    args0: [
      {
        type: "input_end_row",
      },
      {
        type: "input_end_row",
      },
    ],
    message1: "Range: Min: %1 Max: %2",
    args1: [
      {
        type: "field_number",
        name: "range_left",
        value: 0,
      },
      {
        type: "field_number",
        name: "range_right",
        value: 0,
      },
    ],
    output: null,
    colour: "#ed6e84",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "array",
    message0: "Array %1 attributes: %2 length: %3 %4 content: %5",
    args0: [
      {
        type: "input_end_row",
      },
      {
        type: "input_end_row",
      },
      {
        type: "field_number",
        name: "length",
        value: 0,
      },
      {
        type: "input_dummy",
        align: "RIGHT",
      },
      {
        type: "input_value",
        name: "content",
      },
    ],
    output: null,
    colour: "#ee6147",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "permutation",
    message0: "Permutation %1 Range: Min: %2 Max: %3 %4",
    args0: [
      {
        type: "input_end_row",
      },
      {
        type: "field_number",
        name: "range_left",
        value: 0,
        precision: 1,
      },
      {
        type: "field_number",
        name: "range_right",
        value: 0,
        precision: 1,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
    ],
    colour: "#ee6147",
    output: null,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "string",
    message0: "String %1 attributes: %2 length: %3 %4 %5 is palindrome? %6 pattern: %7 %8",
    args0: [
      {
        type: "input_end_row",
      },
      {
        type: "input_end_row",
      },
      {
        type: "field_number",
        name: "length",
        value: 0,
      },
      {
        type: "input_end_row",
      },
      {
        type: "field_checkbox",
        name: "is_palindrome",
        checked: true,
      },
      {
        type: "input_end_row",
      },
      {
        type: "field_input",
        name: "pattern",
        text: "default",
      },
      {
        type: "input_end_row",
      },
    ],
    output: null,
    colour: "#f6c348",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "graph",
    message0:
      "Graph %1 attributes: %2 vertices: %3 edges: %4 %5 %6 with vertex weights?  Range: %7 ~ %8 %9 %10 with edge weights?  Range: %11 ~ %12 %13 %14 is acyclic?    %15 is directed?  %22   %16 is connected?   %17 is bipartite? %18 %19 self loops allowed? %20 multi edge allowed? %21",
    args0: [
      {
        type: "input_end_row",
      },
      {
        type: "input_end_row",
      },
      {
        type: "field_number",
        name: "vertex_count",
        value: 0,
      },
      {
        type: "field_number",
        name: "edge_count",
        value: 0,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "field_checkbox",
        name: "is_vertex_weights",
        checked: true,
      },
      {
        type: "field_number",
        name: "vertex_weights_range_left",
        value: 0,
      },
      {
        type: "field_number",
        name: "vertex_weights_range_right",
        value: 0,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "field_checkbox",
        name: "is_edge_weights",
        checked: true,
      },
      {
        type: "field_number",
        name: "edge_weights_range_left",
        value: 0,
      },
      {
        type: "field_number",
        name: "edge_weights_range_right",
        value: 0,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "field_checkbox",
        name: "is_acyclic",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "is_directed",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "is_connected",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "is_bipartite",
        checked: false,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "field_checkbox",
        name: "loops_allowed",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "multi_allowed",
        checked: false,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
    ],
    output: null,
    colour: "#40e7b9",
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "tree",
    message0:
      "Tree %1 attributes: %2 vertices: %3 %4 %5 with vertex weights?  Range: %6 ~ %7 %8 %9 with edge weights?  Range: %10 ~ %11 %12 %13 is a binary tree? %14",
    args0: [
      {
        type: "input_end_row",
      },
      {
        type: "input_end_row",
      },
      {
        type: "field_number",
        name: "vertex_count",
        value: 0,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "field_checkbox",
        name: "is_vertex_weights",
        checked: true,
      },
      {
        type: "field_number",
        name: "vertex_weights_range_left",
        value: 0,
      },
      {
        type: "field_number",
        name: "vertex_weights_range_right",
        value: 0,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "field_checkbox",
        name: "is_edge_weights",
        checked: true,
      },
      {
        type: "field_number",
        name: "edge_weights_range_left",
        value: 0,
      },
      {
        type: "field_number",
        name: "edge_weights_range_right",
        value: 0,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
      {
        type: "field_checkbox",
        name: "is_binary",
        checked: false,
      },
      {
        type: "input_end_row",
        align: "RIGHT",
      },
    ],
    output: null,
    colour: "#009E60",
    tooltip: "",
    helpUrl: "",
  },
]);
Blockly.Extensions.register("dynamic_menu_extension", function (this: Blockly.Block) {
  const input_dummy = this.getInput("INPUT");
  if (input_dummy)
    input_dummy.appendField(
      new Blockly.FieldDropdown(function () {
        let dropdownOptions: [string, string][] = [];
        let workspace = Blockly.getMainWorkspace();
        if (!workspace) {
          return [["", ""]];
        }
        let allBlocks = workspace.getAllBlocks();

        allBlocks.forEach(function (block) {
          var idFieldValue = block.getFieldValue("ID");
          if (idFieldValue) {
            dropdownOptions.push([idFieldValue, idFieldValue]);
          }
        });
        return dropdownOptions;
      }) as Blockly.Field<string>,
      "object_id",
    );
});
