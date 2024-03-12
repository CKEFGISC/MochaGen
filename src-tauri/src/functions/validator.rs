use super::json;
use std::fs::File;
use std::io::{Read, Write};
// use std::os::linux::raw::stat;
use std::process::Command;
use std::process::Stdio;

#[tauri::command]
pub fn validate_subtask(path: &str, subtask_index: usize) -> Result<String, String> {
  let project_path = json::get_project_directory_with_config_file(path);
  let config = json::parse(path).unwrap();
  let cpp_command = config["cpp_compile_command"].as_str().unwrap();
  let _cpp_flag = config["cpp_compile_flags"].as_str().unwrap();
  let testcase_dir = config["testcase_dir"].as_str().unwrap();
  let testcase_dir = format!("{}/{}", project_path, testcase_dir);
  let mut status_code: String = "".to_string();

  if let Some(subtasks) = config["subtasks"].as_array() {
    println!("{:?}", subtasks);
    let subtask = &subtasks[subtask_index];
    let testcase_count = subtask["testcase_count"].as_i64().unwrap();
    // Construct paths for token, generator, and subtask
    let validator_path = format!(
      "{}/{}",
      project_path,
      subtask["validator"].as_str().unwrap_or("")
    );
    let _gen_path = format!(
      "{}/{}",
      project_path,
      subtask["generator"].as_str().unwrap_or("")
    );
    let subtask_name = format!(
      "{}/{}",
      project_path,
      subtask["name"].as_str().unwrap_or("")
    );
    let validator_executable = format!("{}/build/{}_validator", project_path, subtask_name);
    let cmd = Command::new(cpp_command)
      .arg("-O2")
      .arg(&validator_path)
      .arg("-o")
      .arg(&validator_executable)
      .output();
    println!("{:?}", cmd);
    for i in 0..testcase_count {
      let input_path = format!(
        "{}/{}_{}.in",
        testcase_dir,
        subtask["name"].as_str().unwrap(),
        i
      );
      let mut validate_process = Command::new(&validator_executable)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .expect("Failed to start command");
      let mut input_file = File::open(&input_path).expect("Failed to open input file for reading");
      let mut input_data = Vec::new();
      input_file
        .read_to_end(&mut input_data)
        .expect("Failed to read from input file");
      if let Some(mut validate_stdin) = validate_process.stdin.take() {
        validate_stdin
          .write_all(&input_data)
          .expect("Failed to write to child process stdin");
      }

      let status = validate_process
        .wait()
        .expect("Failed to wait for child process");
      if status.success() {
        // Read the output from the child process's stdout
        let mut output_data = Vec::new();
        if let Some(mut validate_stdout) = validate_process.stdout.take() {
          validate_stdout
            .read_to_end(&mut output_data)
            .expect("Failed to read from child process stdout");

          // Open the output file for writing (create or truncate)
          println!("{:?}", output_data[0]);
          if output_data[0] == 0 {
            status_code.push_str("0");
          } else {
            status_code.push_str("1");
          }
          // if
        } else {
          eprintln!("Failed to capture child process stdout");
        }
      } else {
        eprintln!(
          "Command failed with exit code: {}",
          status.code().unwrap_or_default()
        );
      }
    }
  } else {
    return Err("Project configuration is not an array".to_string());
  }
  Ok(status_code)
}
