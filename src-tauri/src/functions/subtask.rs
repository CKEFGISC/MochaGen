use std::path::Path;

use serde_json::{ser, Value};
use tauri::utils::config;

use super::json::{get_project_directory_with_config_file, parse, write_json_to_file};

#[tauri::command]
pub fn get_subtasks(config_path: &str) -> Result<String, String> {
  let config_json = match parse(&config_path) {
    Ok(json) => json,
    Err(e) => return Err(e),
  };
  let subtasks = config_json["subtasks"].to_string();
  Ok(subtasks)
}
