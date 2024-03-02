#[tauri::command]
pub fn load_blockly(project_path: &str) -> Result<String, String>{
  Ok("success".to_string())
}

#[tauri::command]
pub fn save_blockly(project_path: &str) -> Result<String, String>{
  Ok("success".to_string())
}

#[tauri::command]
pub fn save_token(project_path: &str) -> Result<String, String>{
  Ok("success".to_string())
}