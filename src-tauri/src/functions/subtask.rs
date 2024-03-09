use super::json::parse;

#[tauri::command]
pub fn get_subtasks(config_path: &str) -> Result<String, String> {
  let config_json = match parse(&config_path) {
    Ok(json) => json,
    Err(e) => return Err(e),
  };
  let subtasks = config_json["subtasks"].to_string();
  Ok(subtasks)
}
