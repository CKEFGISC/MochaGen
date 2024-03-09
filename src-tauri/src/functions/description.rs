#[tauri::command]
pub fn load_description(config_path: &str) -> Result<String, String> {
  println!("load_description: {}", config_path);
  Ok("success".to_string())
}

#[tauri::command]
pub fn save_description(config_path: &str) -> Result<String, String> {
  println!("save_description: {}", config_path);
  Ok("success".to_string())
}
