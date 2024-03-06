use serde::{Deserialize, Serialize};
use::std::path::Path;
use serde_json::json;
use crate::functions::json;

#[derive(Serialize, Deserialize)]
struct Subtask {
  name: String,
  testcase_count: String,
  generator: String,
  checker: String,
  token: String,
  blockly: String,
}

#[derive(Serialize, Deserialize)]
struct Project {
  project_name: String,
  description: String,
  version: String,
  cpp_compile_command: String,
  cpp_compile_flags: Vec<String>,
  subtask_count: u8,
  subtasks: Vec<Subtask>,
  build_dir: String,
  problem_dir: String,
  solution_cpp: String,
  testcase_dir: String,
  _comment: String,
}

#[tauri::command]
pub fn create_project(project_name: &str, project_path: &str) -> Result<String, String> {
  let project_path: &Path = Path::new(project_path);
  if !project_path.is_dir() {
    return Err("Project path is not a directory.".into());
  }
  let config_path = project_path.join("config.mcg");
  let project: Project = Project {
    project_name: String::from(project_name),
    description: String::from(""),
    version: String::from("0.0.1"),
    cpp_compile_command: String::from("g++"),
    cpp_compile_flags: vec![
      String::from("-std=c++17"),
      String::from("-Wall"),
      String::from("-O2"),
    ],
    subtask_count: 0,
    subtasks: vec![],
    build_dir: String::from("build"),
    problem_dir: String::from("problem"),
    solution_cpp: String::from("problem/solution.cpp"),
    testcase_dir: String::from("testcase"),
    _comment: String::from(""),
  };
  let json = json!(project);
  json::write_json_to_file(&json, config_path.to_str().unwrap())
    .expect("Problem creating project file.".into());
  Ok("success".into())
}

#[tauri::command]
pub fn load_project(path: &str) -> Result<String, String> {
  // Fuzzy search for project directory
  let project_directory: String = json::get_project_directory_with_config_file(&path);
  
  // Get config file path
  let project_path: &Path = Path::new(project_directory.as_str());
  let config_path: &Path = &project_path.join("config.mcg");
  
  // Parse the config file
  let content = json::parse(config_path.to_str().unwrap());
  
  match content {
    Ok(parsed_json) => Ok(parsed_json.to_string()),
    Err(e) => Err(e)
  } 
}
