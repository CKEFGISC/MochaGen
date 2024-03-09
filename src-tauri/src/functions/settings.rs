use std::{io::Write, path::Path};

use serde_json::{self, Value};

use super::json::{get_project_directory_with_config_file, parse, write_json_to_file};

#[tauri::command]
pub fn load_settings(config_path: &str) -> Result<String, String> {
  let config_json = match parse(&config_path) {
    Ok(json) => json,
    Err(e) => return Err(e),
  };
  Ok(config_json.to_string())
}

#[tauri::command]
pub fn load_solution_cpp(config_path: &str) -> Result<String, String> {
  let dir_path = get_project_directory_with_config_file(config_path);
  let config_json = match parse(&config_path) {
    Ok(json) => json,
    Err(e) => return Err(e),
  };
  let solution_cpp_path = Path::new(&dir_path).join(config_json["solution_cpp"].as_str().unwrap());
  let solution_cpp = match std::fs::read_to_string(&solution_cpp_path) {
    Ok(contents) => contents,
    Err(e) => return Err(e.to_string()),
  };
  Ok(solution_cpp)
}

#[tauri::command]
pub fn save_settings(
  config_path: &str,
  description: &str,
  solution_cpp: &str,
  cpp_compile_command: &str,
  cpp_compile_flags: &str,
  subtask_amount: &str,
  subtask_fields: &str,
) -> Result<String, String> {
  let dir_path = get_project_directory_with_config_file(config_path);
  let mut config_json = match parse(&config_path) {
    Ok(json) => json,
    Err(e) => return Err(e),
  };
  config_json["description"] = match serde_json::from_str(description) {
    Ok(json) => json,
    Err(e) => return Err(e.to_string()),
  };
  config_json["cpp_compile_command"] = match serde_json::from_str(cpp_compile_command) {
    Ok(json) => json,
    Err(e) => return Err(e.to_string()),
  };
  config_json["cpp_compile_flags"] = match serde_json::from_str(cpp_compile_flags) {
    Ok(json) => json,
    Err(e) => return Err(e.to_string()),
  };
  config_json["subtask_amount"] = match serde_json::from_str(subtask_amount) {
    Ok(json) => json,
    Err(e) => return Err(e.to_string()),
  };

  // subtask_fields is a JSON string
  let subtask_fields_json: serde_json::Value = match serde_json::from_str(subtask_fields) {
    Ok(json) => json,
    Err(e) => return Err(e.to_string()),
  };

  let mut subtasks: Vec<Value> = Vec::new();
  for subtask in subtask_fields_json.as_array().unwrap() {
    let name = subtask["name"].as_str().unwrap();
    let testcase_count = subtask["testcase_count"].as_str().unwrap();
    let generator = format!("subtasks/{}/generator.cpp", &name);
    let validator = format!("subtasks/{}/validator.cpp", &name);
    let token = format!("subtasks/{}/token.json", &name);
    let blockly = format!("subtasks/{}/blockly.xml", &name);

    subtasks.push(serde_json::json!({
      "name": name,
      "testcase_count": testcase_count,
      "generator": generator,
      "validator": validator,
      "token": token,
      "blockly": blockly,
    }));
  }
  config_json["subtasks"] = serde_json::json!(subtasks);

  let solution_cpp_path = Path::new(&dir_path).join(config_json["solution_cpp"].as_str().unwrap());
  let mut file = match std::fs::OpenOptions::new()
    .write(true)
    .create(true)
    .truncate(true)
    .open(&solution_cpp_path)
  {
    Ok(file) => file,
    Err(e) => return Err(e.to_string()),
  };

  file.write_all(solution_cpp.as_bytes());

  match write_json_to_file(&config_json, &config_path) {
    Ok(_) => (),
    Err(e) => return Err(e.to_string()),
  }

  Ok("success".to_string())
}
