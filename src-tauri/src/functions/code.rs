use crate::functions::json;
use std::io::Write;
use std::path::Path;
use std::fs;
use crate::functions::parser::run_parser;

#[tauri::command]
pub fn load_gen_cpp(config_path: &str, subtask_index: usize) -> Result<String, String>{
  let dir_path = &json::get_project_directory_with_config_file(config_path);
  let dir_path = Path::new(&dir_path);
  let config_json = json::parse(&config_path)?; 
  let subtasks = config_json["subtasks"].as_array().unwrap(); 
  let subtask_json = &subtasks[subtask_index];
  let gen_cpp_path = &dir_path.join(subtask_json["generator"].as_str().unwrap()); 
  if !gen_cpp_path.exists() {
     run_parser(config_path, subtask_index)?;
  }
  let gen_cpp = match std::fs::read_to_string(&gen_cpp_path) {
    Ok(contents) => contents,
    Err(e) => return Err(e.to_string()),
  };
  Ok(gen_cpp)
}

#[tauri::command]
pub fn save_gen_cpp(config_path: &str, subtask_index: usize, gen_cpp: &str) -> Result<String, String> {
  let dir_path = &json::get_project_directory_with_config_file(config_path);
  let dir_path = Path::new(&dir_path);
  let config_json = json::parse(&config_path)?;
  let subtasks = config_json["subtasks"].as_array().unwrap();
  let subtask_json = &subtasks[subtask_index];
  let gen_cpp_path = &dir_path.join(subtask_json["generator"].as_str().unwrap());
  println!("gen_cpp_path: {:?}", gen_cpp_path.display());

  // Create parent directories if they don't exist
  match fs::create_dir_all(gen_cpp_path.parent().unwrap()) {
    Ok(_) => (),
    Err(e) => return Err(e.to_string()),
  }

  // Open desc_file
  let mut gen_cpp_file = match std::fs::OpenOptions::new()
    .write(true)
    .create(true)
    .truncate(true)
    .open(&gen_cpp_path) {
      Ok(file) => file,
      Err(e) => return Err(e.to_string()),
    };

  // Write to desc_file
  match gen_cpp_file.write_all(gen_cpp.as_bytes()) {
    Ok(_) => (),
    Err(e) => return Err(e.to_string()),       
  };
  Ok("success".to_string())
}

#[tauri::command]
pub fn load_validator_cpp(config_path: &str, subtask_index: usize) -> Result<String, String>{
  let dir_path = &json::get_project_directory_with_config_file(config_path);
  let dir_path = Path::new(&dir_path);
  let config_json = json::parse(&config_path)?; 
  let subtasks = config_json["subtasks"].as_array().unwrap(); 
  let subtask_json = &subtasks[subtask_index];
  let validator_cpp_path = &dir_path.join(subtask_json["validator"].as_str().unwrap()); 

  if !validator_cpp_path.exists() {
    return Ok("".to_string());
  }

  let validator_cpp = match std::fs::read_to_string(&validator_cpp_path) {
    Ok(contents) => contents,
    Err(e) => return Err(e.to_string()),
  };
  Ok(validator_cpp)
}

#[tauri::command]
pub fn save_validator_cpp(config_path: &str, subtask_index: usize, validator_cpp: &str) -> Result<String, String> {
  let dir_path = &json::get_project_directory_with_config_file(config_path);
  let dir_path = Path::new(&dir_path);
  let config_json = json::parse(&config_path)?;
  let subtasks = config_json["subtasks"].as_array().unwrap();
  let subtask_json = &subtasks[subtask_index];
  let validator_cpp_path = &dir_path.join(subtask_json["validator"].as_str().unwrap());

  // Create parent directories if they don't exist
  match fs::create_dir_all(validator_cpp_path.parent().unwrap()) {
    Ok(_) => (),
    Err(e) => return Err(e.to_string()),
  }

  // Open desc_file
  let mut validator_cpp_file = match std::fs::OpenOptions::new()
    .write(true)
    .create(true)
    .truncate(true)
    .open(&validator_cpp_path) {
      Ok(file) => file,
      Err(e) => return Err(e.to_string()),
    };

  // Write to desc_file
  match validator_cpp_file.write_all(validator_cpp.as_bytes()) {
    Ok(_) => (),
    Err(e) => return Err(e.to_string()),       
  };
  Ok("success".to_string())
}
