use crate::functions::json;
use std::io::Write;
use std::path::Path;
use std::fs;
use serde_json;

#[tauri::command]
pub fn load_description(config_path: &str) -> Result<String, String>{
  let dir_path = json::get_project_directory_with_config_file(config_path);
  let config_json = json::parse(&config_path)?; 
  let desc_path = Path::new(&dir_path).join(config_json["desc_dir"].as_str().unwrap());
  let desc = match std::fs::read_to_string(&desc_path) {
    Ok(contents) => contents,
    Err(e) => return Err(e.to_string()),
  };
  Ok(desc)
}

#[tauri::command]
pub fn save_description(config_path: &str, desc: &str) -> Result<String, String> {
  let dir_path = json::get_project_directory_with_config_file(config_path);
  let config_json = json::parse(&config_path)?;
  let desc_path = Path::new(&dir_path).join(config_json["desc_dir"].as_str().unwrap());

  // Create parent directories if they don't exist
  match fs::create_dir_all(desc_path.parent().unwrap()) {
    Ok(_) => (),
    Err(e) => return Err(e.to_string()),
  }

  // Open desc_file
  let mut desc_file = match std::fs::OpenOptions::new()
    .write(true)
    .create(true)
    .truncate(true)
    .open(&desc_path) {
      Ok(file) => file,
      Err(e) => return Err(e.to_string()),
    };

  // Write to desc_file
  match desc_file.write_all(desc.as_bytes()) {
    Ok(_) => (),
    Err(e) => return Err(e.to_string()),       
  };
  Ok("success".to_string())
}
