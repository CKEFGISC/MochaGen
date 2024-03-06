use std::path::Path;

use super::json::get_project_directory_with_config_file;

#[tauri::command]
pub fn load_blockly(
  project_path: &str,
  blockly_status: &str,
  subtask_content: &str,
) -> Result<String, String> {
  let dir_path = get_project_directory_with_config_file(project_path);

  Ok("success".to_string())
}

#[tauri::command]
pub fn save_blockly(project_path: &str) -> Result<String, String> {
  Ok("success".to_string())
}

#[tauri::command]
pub fn save_token(project_path: &str) -> Result<String, String> {
  Ok("success".to_string())
}
