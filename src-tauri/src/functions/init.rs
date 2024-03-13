use crate::functions::json;
use ::std::path::Path;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Serialize, Deserialize)]
struct Subtask {
  name: String,
  testcase_count: String,
  generator: String,
  validator: String,
  token: String,
  blockly: String,
}

#[derive(Serialize, Deserialize)]
struct Project {
  project_name: String,
  description: String,
  version: String,
  cpp_compile_command: String,
  cpp_compile_flags: String,
  subtask_count: u8,
  subtasks: Vec<Subtask>,
  build_dir: String,
  problem_dir: String,
  desc_dir: String,
  solution_cpp: String,
  testcase_dir: String,
  _comment: String,
}

#[tauri::command]
pub fn create_project(project_name: &str, project_path: &str) -> Result<(), String> {
  // Convert to project path
  let project_path: &Path = Path::new(project_path);
  println!("project_path: {:?}", project_path);

  // Get config file path
  let config_path = project_path.join("config.mcg");
  let subtask_sample: Subtask = Subtask {
    name: String::from(""),
    testcase_count: String::from(""),
    generator: String::from(""),
    validator: String::from(""),
    token: String::from(""),
    blockly: String::from(""),
  };
  // Default project settings
  let project: Project = Project {
    project_name: String::from(project_name),
    description: String::from(""),
    version: String::from("0.0.1"),
    cpp_compile_command: String::from("g++"),
    cpp_compile_flags: String::from("-std=c++17 -O3 -Wall"),
    subtask_count: 0,
    subtasks: vec![subtask_sample],
    build_dir: String::from("build"),
    problem_dir: String::from("problem"),
    desc_dir: String::from("problem/desc.md"),
    solution_cpp: String::from("problem/solution.cpp"),
    testcase_dir: String::from("testcase"),
    _comment: String::from(""),
  };

  // Convert to json and write it to file
  let json = json!(project);
  let status = json::write_json_to_file(&json, config_path.to_str().unwrap());
  match status {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string().into()),
  }
}

#[tauri::command]
pub fn load_project(path: &str) -> Result<String, String> {
  // Fuzzy search for project directory
  let project_directory: String = json::get_project_directory_with_config_file(&path);

  // Get config file path
  let project_path: &Path = Path::new(project_directory.as_str());
  let config_path: &Path = &project_path.join("config.mcg");

  // Parse the config file
  Ok(json::parse(config_path.to_str().unwrap())?.to_string())
}
