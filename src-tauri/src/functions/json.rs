use serde::de::value::Error;
use serde_json;
use std::fs::{File, OpenOptions};
use std::io;
use std::io::Write;
use std::path::Path;

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

pub fn get_mcg_with_project_directory(project_directory: &str) -> String {
  let path = Path::new(project_directory);
  if let Some(folder_name) = path.file_name() {
    if let Some(folder_str) = folder_name.to_str() {
      folder_str.to_string()
    } else {
      "error".to_string()
    }
  } else {
    "error".to_string()
  }
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
