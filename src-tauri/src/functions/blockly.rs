use std::path::Path;

use serde_json::{ser, Value};
use tauri::utils::config;

use super::json::{get_project_directory_with_config_file, parse, write_json_to_file};

#[tauri::command]
pub fn save_blockly(
  config_path: &str,
  subtask_content: &str,
  blockly_status: &str,
) -> Result<String, String> {
  let dir_path = get_project_directory_with_config_file(config_path);
  let config_json = match parse(&config_path) {
    Ok(json) => json,
    Err(e) => return Err(e),
  };

  let subtask_json: Value = match serde_json::from_str(subtask_content) {
    Ok(json) => json,
    Err(e) => return Err(e.to_string()),
  };

  let subtasks = config_json["subtasks"].as_array().unwrap();
  for subtask in subtasks {
    if subtask["name"].as_str().unwrap() == subtask_json["name"].as_str().unwrap() {
      let blockly_path = Path::new(&dir_path).join(subtask["blockly"].as_str().unwrap());
      let blockly_status = match serde_json::from_str(blockly_status) {
        Ok(json) => json,
        Err(e) => return Err(e.to_string()),
      };
      return match write_json_to_file(&blockly_status, &blockly_path.to_str().unwrap()) {
        Ok(_) => Ok("success".to_string()),
        Err(e) => Err(e.to_string()),
      };
    }
  }

  return Err(format!(
    "Subtask {} not found",
    subtask_json["name"].as_str().unwrap()
  ));
}

#[tauri::command]
pub fn load_blockly(config_path: &str, subtask_content: &str) -> Result<String, String> {
  let dir_path = get_project_directory_with_config_file(config_path);
  let config_json = match parse(&config_path) {
    Ok(json) => json,
    Err(e) => return Err(e),
  };

  let subtask_json: Value = match serde_json::from_str(subtask_content) {
    Ok(json) => json,
    Err(e) => return Err(e.to_string()),
  };

  let subtasks = config_json["subtasks"].as_array().unwrap();
  for subtask in subtasks {
    if subtask["name"].as_str().unwrap() == subtask_json["name"].as_str().unwrap() {
      let blockly_path = Path::new(&dir_path).join(subtask["blockly"].as_str().unwrap());
      let blockly_status = match parse(&blockly_path.to_str().unwrap()) {
        Ok(json) => json,
        Err(e) => return Err(e),
      };
      return Ok(serde_json::to_string(&blockly_status).unwrap());
    }
  }

  return Err(format!(
    "Subtask {} not found",
    subtask_json["name"].as_str().unwrap()
  ));
}

#[tauri::command]
pub fn save_token(config_path: &str, subtask_content: &str, token: &str) -> Result<String, String> {
  let dir_path = get_project_directory_with_config_file(config_path);
  let config_json = match parse(&config_path) {
    Ok(json) => json,
    Err(e) => return Err(e),
  };

  let subtask_json: Value = match serde_json::from_str(subtask_content) {
    Ok(json) => json,
    Err(e) => return Err(e.to_string()),
  };
  let subtasks = config_json["subtasks"].as_array().unwrap();

  for subtask in subtasks {
    if subtask["name"].as_str().unwrap() == subtask_json["name"].as_str().unwrap() {
      let token_path = Path::new(&dir_path).join(subtask["token"].as_str().unwrap());
      return match std::fs::write(token_path, token) {
        Ok(_) => Ok("success".to_string()),
        Err(e) => Err(e.to_string()),
      };
    }
  }

  return Err(format!(
    "Subtask {} not found",
    subtask_json["name"].as_str().unwrap()
  ));
}
