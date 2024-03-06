use std::path::Path;

#[tauri::command]
pub fn load_blockly(
  project_path: &str,
  blockly_status: &str,
  subtask_content: &str,
) -> Result<String, String> {
  let project_path = Path::new(project_path);
  let dir_path = project_path.parent().unwrap();

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
