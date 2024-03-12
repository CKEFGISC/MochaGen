import * as Blockly from "blockly";
import toast from "react-toastify";

const Order = {
  ATOMIC: 0,
};

class MyCodeGenerator extends Blockly.Generator {
  protected scrub_(_block: Blockly.Block, code: string, _opt_thisOnly?: boolean | undefined): string {
    const nextBlock = _block.nextConnection && _block.nextConnection.targetBlock();
    if (nextBlock && !_opt_thisOnly) {
      return code + ",\n" + this.blockToCode(nextBlock);
    }
    return code;
  }
}
export const tokenGenerator = new MyCodeGenerator("TOKEN");

function saveParser(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error(e);
    return {};
  }
}

tokenGenerator.forBlock["generator"] = function (block, generator) {
  const tokens = saveParser("[" + String(generator.statementToCode(block, "token_section")) + "]");
  const output = saveParser("[" + String(generator.statementToCode(block, "print_section")) + "]");
  const code = {
    tokens: tokens,
    output: output,
  };
  return JSON.stringify(code, null, 2);
};

tokenGenerator.forBlock["math_number"] = function (block) {
  const code = String(block.getFieldValue("NUM"));
  return [code, Order.ATOMIC];
};

tokenGenerator.forBlock["set_id"] = function (block, generator) {
  const id: string = "_" + block.getFieldValue("ID");
  const object: JSON = saveParser(String(generator.valueToCode(block, "object", Order.ATOMIC)));
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
  const id: string = "_" + block.getFieldValue("getid");
  console.warn("id", id);
  return [id, Order.ATOMIC];
};

tokenGenerator.forBlock["print"] = function (block, generator) {
  const inputid: string = generator.valueToCode(block, "inputid", Order.ATOMIC);
  const endwith: string = block.getFieldValue("endwith");
  let end = "";
  if (endwith === "newline") {
    end = "\n";
  } else if (endwith === "space") {
    end = " ";
  } else if (endwith === "tab") {
    end = "\t";
  } else if (endwith === "comma") {
    end = ",";
  } else if (endwith === "semicolon") {
    end = ";";
  }
  let code = {
    category: "print",
    class: "print",
    id: inputid,
    end: end,
  };
  return JSON.stringify(code, null, 2);
};
tokenGenerator.forBlock["printwords"] = function (block) {
  const words: string = block.getFieldValue("words");
  const code = {
    category: "print",
    class: "printwords",
    words: words,
  };
  return JSON.stringify(code, null, 2);
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
      _number:{
        category: "integer",
      },
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
      _number:{
        category: "float",
      },
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
      _array:{
        length: length,
        element: element,
      }
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
      _string:{
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

  const is_vertex_weights: number = block.getFieldValue("is_vertex_weights") == "TRUE" ? 1 : 0;
  const is_edge_weights: number = block.getFieldValue("is_edge_weights") == "TRUE" ? 1 : 0;
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
      _graph:{
        vertex_count: vertex_count,
        edge_count: edge_count,
      },
      weighted_type: {
        weighted_type: weighted_type.toString(),
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
  console.warn("vertex_count", vertex_count);

  const is_vertex_weights: number = block.getFieldValue("is_vertex_weights") == "TRUE" ? 1 : 0;
  const is_edge_weights: number = block.getFieldValue("is_edge_weights") == "TRUE" ? 1 : 0;
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
      _tree:{
        vertex_count: vertex_count,
      },
      weighted_type: {
        weighted_type: weighted_type.toString(),
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
