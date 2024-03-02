#[tauri::command]
pub fn create_project(project_path: &str) -> Result<String, String>{
  Ok("success".to_string())
}
#[tauri::command]
pub fn load_project(project_path: &str) -> Result<String, String>{
  Ok("success".to_string())
}