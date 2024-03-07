use super::{json, parser::parse_token};
use serde_json;
use std::process::Command;
use tauri::api::path::resolve_path;
use tauri::utils::config::parse::parse_json;
use tauri::utils::resources;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn generate_testdata(path: &str, lib_path: &str) -> Result<String, String> {
  let project_path = json::get_project_directory_with_config_file(path);
  let config = json::parse(path).unwrap();
  // Check if config is an array
  //
  let cpp_command = config["cpp_compile_command"].as_str().unwrap();
  let cpp_flag = config["cpp_compile_flag"].as_str().unwrap();
  let build_dir = config["build_dir"].as_str().unwrap();
  if let Some(subtasks) = config["subtasks"].as_array() {
    for subtask in subtasks {
      // Construct paths for token, generator, and subtask
      let token_path = format!(
        "{}//subtasks/{}",
        project_path,
        subtask["token"].as_str().unwrap_or("")
      );
      let gen_path = format!(
        "{}/subtasks/{}",
        project_path,
        subtask["generator"].as_str().unwrap_or("")
      );
      let subtask_path = format!(
        "{}/subtasks/{}",
        project_path,
        subtask["name"].as_str().unwrap_or("")
      );
      let executable = format!("{}/{}", build_dir, subtask["name"].as_str().unwrap_or(""));
      let executable_2 = format!("{}/{}", build_dir, subtask["name"].as_str().unwrap_or(""));
      let testcase_count = subtask["testcase_count"].as_i64().unwrap();
      let cmd = Command::new(cpp_command)
        .arg(cpp_flag)
        .arg(format!("-L{}", lib_path))
        .arg("-lassembler")
        .arg("-o")
        .arg(executable)
        .arg(gen_path)
        .output()
        .unwrap();
      //mcg example in ../mcg_example.json
      for i in 0..testcase_count {
        let output_path = format!(
          "{}/{}_{}.in",
          subtask_path,
          subtask["name"].as_str().unwrap(),
          i
        );
        let cmd = Command::new(build_dir)
          .arg(format!("{} > {}", executable_2, output_path))
          .output()
          .unwrap();
      }
    }
  } else {
    return Err("Project configuration is not an array".to_string());
  }
  Ok("success".to_string())
}
