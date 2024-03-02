#[tauri::command]
pub fn load_settings(project_path: &str) -> Result<String, String>{
  Ok("success".to_string())
}

#[tauri::command]
pub fn save_settings(project_path: &str) -> Result<String, String>{
  Ok("success".to_string())
}