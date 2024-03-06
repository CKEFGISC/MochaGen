use serde::de::value::Error;
use serde_json;
use std::fs::{File, OpenOptions};
use std::io;
use std::io::Write;
use std::path::{Path, PathBuf};

pub fn parse(json_path: String) -> Result<serde_json::Value, String> {
  let contents = match std::fs::read_to_string(&json_path) {
    Ok(contents) => contents,
    Err(e) => return Err(format!("Failed to read file: {}", e)),
  }; // 讀取json file
  let json: serde_json::Result<serde_json::Value> = serde_json::from_str(&contents); //parse json
  match json {
    Ok(parsed_json) => Ok(parsed_json),
    Err(e) => Err(format!("Failed to parse JSON: {}", e)),
  }
}

pub fn get_project_directory_with_config_file(config_path: &str) -> String {
  let config_path = Path::new(config_path);

  // If the provided path is a file, get its parent directory
  if config_path.is_file() {
    return config_path
      .parent()
      .map_or_else(|| String::new(), |p| p.to_string_lossy().to_string());
  }

  // If the provided path is a directory, return it
  if config_path.is_dir() {
    return config_path.to_string_lossy().to_string();
  }

  // Otherwise, try to find the config file by searching up the directory tree
  let mut current_dir = Path::new(".")
    .canonicalize()
    .ok()
    .unwrap_or_else(|| PathBuf::from("."));
  while current_dir != Path::new("/") {
    let file_path = current_dir.join(config_path);
    if file_path.is_file() {
      return current_dir.to_string_lossy().to_string();
    }
    current_dir = match current_dir.parent() {
      Some(parent) => parent.to_path_buf(),
      None => break,
    };
  }

  String::new()
}

pub fn write_json_to_file(
  json_data: &serde_json::Value,
  file_path: &str,
) -> Result<(), std::io::Error> {
  // Serialize the JSON data to a string
  let json_string = serde_json::to_string_pretty(json_data)?;

  // Open the file for writing and truncate it (overwrite its contents)
  let mut file = std::fs::OpenOptions::new()
    .write(true)
    .create(true)
    .truncate(true)
    .open(file_path)?;

  println!("Mcg_setting: {}", json_string);
  // Write the JSON string to the file
  file.write_all(json_string.as_bytes())?;

  Ok(())
}
