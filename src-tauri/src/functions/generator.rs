use super::{json, parser::parse_token};
use serde_json;
use std::process::Command;
use tauri::utils::config::parse::parse_json;

#[tauri::command]
pub fn generate_testdata(path: &str) -> Result<String, String> {
  let project_path = json::get_project_directory_with_config_file(path);
  let config = json::parse(path).unwrap();
  // Check if config is an array
  if let Some(subtasks) = config["subtasks"].as_array() {
    for subtask in subtasks {
      // Construct paths for token, generator, and subtask
      let token_path = format!(
        "{}//subtasks/{}",
        project_path,
        subtask["token"].as_str().unwrap_or("")
      );
      let gen_path = format!(
        "{}/subtasks/{}",
        project_path,
        subtask["generator"].as_str().unwrap_or("")
      );
      let subtask_path = format!(
        "{}/subtasks/{}",
        project_path,
        subtask["name"].as_str().unwrap_or("")
      );

      // Parse token for each subtask
      parse_token(&token_path, &gen_path, &subtask_path);
    }
  } else {
    return Err("Project configuration is not an array".to_string());
  }
  Ok("success".to_string())
}
