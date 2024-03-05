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
    use serde_json::json;
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
    crate::functions::json::write_json_to_file(&json!(project), project_path).expect("Problem creating project file.");
    Ok("success".to_string())
}
#[tauri::command]
pub fn load_project(project_path: &str) -> Result<String, String>{
    crate::functions::json::get_mcg_with_project_directory(project_path); 

    Ok("success".to_string())
}
