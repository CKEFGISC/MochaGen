use crate::functions::json;
use std::path::Path;
use std::fs;
use serde_json;

#[tauri::command]
pub fn load_description(project_path: &str) -> Result<String, String>{
  println!("Project path: {}", project_path);
  let project_path: &Path = Path::new(project_path);
  let config_path: &Path = &project_path.join("config.mcg");
  let config: &serde_json::Value = &json::parse(&config_path.to_str().unwrap())?;
  println!("Config: {}", config);
  let desc_path: &str = &config["description"].as_str().unwrap(); 
  println!("Description path: {}", desc_path);
  let desc_path: &Path = Path::new(desc_path);
  // if !desc_path.exists() {
  //   fs::File::create(desc_path).unwrap();
  //   println!("Description file created"); 
  // } 
  match fs::read_to_string(desc_path) {
    Ok(desc) => Ok(desc.into()),
    Err(e) => Err(e.to_string().into()),
  }
}

#[tauri::command]
pub fn save_description(project_path: &str, desc: &str) -> Result<String, String>{
  let project_path: &Path = Path::new(project_path);
  let config_path: &Path = &project_path.join("config.mcg");
  let config: &serde_json::Value = &json::parse(&config_path.to_str().unwrap())?;
  println!("desc_path: {}", config["description"]);     
  let desc_path: &str = &config["description"].as_str().unwrap();
  match fs::write(desc_path, desc) {
    Ok(_) => Ok(String::from("Description saved").into()),
    Err(e) => Err(e.to_string().into()),
  }
}
