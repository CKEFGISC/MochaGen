#[tauri::command]
pub fn load_description(project_path: &str) -> Result<String, String>{
  Ok("success".to_string())
}

#[tauri::command]
pub fn save_description(project_path: &str) -> Result<String, String>{
  Ok("success".to_string())
}