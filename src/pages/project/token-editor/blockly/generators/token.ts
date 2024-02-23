import * as Blockly from "blockly";

const Order = {
  ATOMIC: 0,
};

class MyCodeGenerator extends Blockly.Generator {
  protected scrub_(_block: Blockly.Block, code: string, _opt_thisOnly?: boolean | undefined): string {
    console.log("scrub_ called");
    const nextBlock = _block.nextConnection && _block.nextConnection.targetBlock();
    let codeJson = JSON.parse(code);
    if (nextBlock && !_opt_thisOnly) {
      let nextBlockJson = JSON.parse(String(this.blockToCode(nextBlock)));
      nextBlockJson.unshift(codeJson);
      return JSON.stringify(nextBlockJson, null, 2);
    }
    return JSON.stringify([codeJson], null, 2);
  }
}
export const tokenGenerator = new MyCodeGenerator("TOKEN");

tokenGenerator.forBlock["generator"] = function (block, generator) {
  const subtask_id = block.getFieldValue("subtask_id");
  const testdata_count = 1; // TODO: Finish Subtask Mode
  const tokens = JSON.parse(String(generator.statementToCode(block, "token_section")));
  const code = {
    subtask_id: subtask_id,
    testdata_count: testdata_count,
    tokens: tokens,
  };
  return JSON.stringify(code, null, 2);
};

tokenGenerator.forBlock["math_number"] = function (block) {
  const code = String(block.getFieldValue("NUM"));
  return [code, Order.ATOMIC];
};

tokenGenerator.forBlock["set_id"] = function (block, generator) {
  const id: string = "_" + block.getFieldValue("ID");
  const object: JSON = JSON.parse(String(generator.valueToCode(block, "object", Order.ATOMIC)));
  let code = {
    id: id,
    object: object,
  };
  return JSON.stringify(code, null, 2);
};

tokenGenerator.forBlock["set_id_to_const_number"] = function (block) {
  const id: string = "_" + block.getFieldValue("ID");
  const object: string = String(block.getFieldValue("object"));
  let code = {
    id: id,
    object: object,
  };
  return JSON.stringify(code, null, 2);
};

tokenGenerator.forBlock["get_id"] = function (block) {
  const id: string = "_" + block.getFieldValue("ID");
  return [id, Order.ATOMIC];
};

tokenGenerator.forBlock["integer"] = function (block, generator) {
  const range_left: string = generator.valueToCode(block, "range_left", Order.ATOMIC);
  const range_right: string = generator.valueToCode(block, "range_right", Order.ATOMIC);
  const is_odd: boolean = block.getFieldValue("is_odd") === "TRUE";
  const is_prime: boolean = block.getFieldValue("is_prime") === "TRUE";
  let code = {
    category: "number",
    class: "integer",
    attr: {
      range: {
        left: range_left,
        right: range_right,
      },
      parity: {
        is_odd: is_odd,
      },
      prime: {
        is_prime: is_prime,
      },
    },
  };
  return [JSON.stringify(code, null, 2), Order.ATOMIC];
};

tokenGenerator.forBlock["float"] = function (block, generator) {
  const range_left: string = generator.valueToCode(block, "range_left", Order.ATOMIC);
  const range_right: string = generator.valueToCode(block, "range_right", Order.ATOMIC);
  let code = {
    category: "number",
    class: "float",
    attr: {
      range: {
        left: range_left,
        right: range_right,
      },
    },
  };
  return [JSON.stringify(code, null, 2), Order.ATOMIC];
};

tokenGenerator.forBlock["array"] = function (block, generator) {
  const length: string = generator.valueToCode(block, "length", Order.ATOMIC);
  const element: string = generator.valueToCode(block, "element", Order.ATOMIC);
  let code = {
    category: "array",
    class: "array",
    attr: {
      length: {
        length: length,
      },
      element: {
        element_token: element,
      },
    },
  };
  return [JSON.stringify(code, null, 2), Order.ATOMIC];
};

tokenGenerator.forBlock["permutation"] = function (block, generator) {
  const range_left: string = generator.valueToCode(block, "range_left", Order.ATOMIC);
  const range_right: string = generator.valueToCode(block, "range_right", Order.ATOMIC);
  let code = {
    category: "array",
    class: "permutation",
    attr: {
      range: {
        left: range_left,
        right: range_right,
      },
    },
  };
  return [JSON.stringify(code, null, 2), Order.ATOMIC];
};

tokenGenerator.forBlock["string"] = function (block, generator) {
  const length: string = generator.valueToCode(block, "length", Order.ATOMIC);
  const is_palindrome = block.getFieldValue("is_palindrome");
  const pattern: string = block.getFieldValue("pattern");
  let code = {
    category: "string",
    class: "string",
    attr: {
      length: {
        length: length,
      },
      palindrome: {
        is_palindrome: is_palindrome,
      },
      pattern: {
        pattern: pattern,
      },
    },
  };
  return [JSON.stringify(code, null, 2), Order.ATOMIC];
};

tokenGenerator.forBlock["graph"] = function (block, generator) {
  const vertex_count: string = generator.valueToCode(block, "vertex_count", Order.ATOMIC);
  const edge_count: string = generator.valueToCode(block, "edge_count", Order.ATOMIC);

  const is_vertex_weights: number = block.getFieldValue("is_vertex_weights");
  const is_edge_weights: number = block.getFieldValue("is_edge_weights");
  const weighted_type = is_vertex_weights * 2 + is_edge_weights;

  const vertex_weights_range_left = generator.valueToCode(block, "vertex_weights_range_left", Order.ATOMIC);
  const vertex_weights_range_right = generator.valueToCode(block, "vertex_weights_range_right", Order.ATOMIC);
  const edge_weights_range_left = generator.valueToCode(block, "edge_weights_range_left", Order.ATOMIC);
  const edge_weights_range_right = generator.valueToCode(block, "edge_weights_range_right", Order.ATOMIC);

  const is_acyclic = block.getFieldValue("is_acyclic");
  const is_connected = block.getFieldValue("is_connected");
  const is_directed = block.getFieldValue("is_directed");
  const is_bipartite = block.getFieldValue("is_bipartite");
  const loops_allowed = block.getFieldValue("loops_allowed");
  const multi_allowed = block.getFieldValue("multi_allowed");

  let code = {
    category: "graph",
    class: "graph",
    attr: {
      vertex: {
        vertex_count: vertex_count,
      },
      edge: {
        edge_token: edge_count,
      },
      weighted_type: {
        weighted_type: weighted_type,
      },
      vertex_weights: {
        left: vertex_weights_range_left,
        right: vertex_weights_range_right,
      },
      edge_weights: {
        left: edge_weights_range_left,
        right: edge_weights_range_right,
      },
      acyclic: {
        is_acyclic: is_acyclic,
      },
      connected: {
        is_connected: is_connected,
      },
      directed: {
        is_directed: is_directed,
      },
      bipartite: {
        is_bipartite: is_bipartite,
      },
      allow_loops: {
        loops_allowed: loops_allowed,
      },
      allow_multi: {
        multi_allowed: multi_allowed,
      },
    },
  };
  return [JSON.stringify(code, null, 2), Order.ATOMIC];
};

tokenGenerator.forBlock["tree"] = function (block, generator) {
  const vertex_count: string = generator.valueToCode(block, "vertex_count", Order.ATOMIC);

  const is_vertex_weights: number = block.getFieldValue("is_vertex_weights");
  const is_edge_weights: number = block.getFieldValue("is_edge_weights");
  const weighted_type = is_vertex_weights * 2 + is_edge_weights;

  const vertex_weights_range_left = generator.valueToCode(block, "vertex_weights_range_left", Order.ATOMIC);
  const vertex_weights_range_right = generator.valueToCode(block, "vertex_weights_range_right", Order.ATOMIC);
  const edge_weights_range_left = generator.valueToCode(block, "edge_weights_range_left", Order.ATOMIC);
  const edge_weights_range_right = generator.valueToCode(block, "edge_weights_range_right", Order.ATOMIC);

  const is_binary = block.getFieldValue("is_binary");

  const code = {
    category: "tree",
    class: "tree",
    attr: {
      vertex: {
        vertex_count: vertex_count,
      },
      weighted_type: {
        weighted_type: weighted_type,
      },
      vertex_weights: {
        left: vertex_weights_range_left,
        right: vertex_weights_range_right,
      },
      edge_weights: {
        left: edge_weights_range_left,
        right: edge_weights_range_right,
      },
      binary: {
        is_binary: is_binary,
      },
    },
  };
  return [JSON.stringify(code, null, 2), Order.ATOMIC];
};
