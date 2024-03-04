use serde::{Deserialize, Serialize};

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
pub fn create_project(project_name: &str, project_path: &str) -> Result<String, String>{
    let project: Project = Project {
        project_name: String::from(project_name),
        description: String::from(""),
        version: String::from("0.0.1"),
        cpp_compile_command: "g++".to_string(),
        cpp_compile_flags: vec![
            "-std=c++17".to_string(),
            "-Wall".to_string(),
            "-O2".to_string(),
        ],
        subtask_count: 0,
        subtasks: vec![],
        build_dir: "build".to_string(),
        problem_dir: "problem".to_string(),
        solution_cpp: "problem/solution.cpp".to_string(),
        testcase_dir: "testcase".to_string(),
        _comment: "".to_string(),
    };
    Ok("success".to_string())
}
#[tauri::command]
pub fn load_project(project_path: &str) -> Result<String, String>{
    Ok("success".to_string())
}
