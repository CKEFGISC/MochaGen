use super::{json, parser::parse_token};
use serde_json;
use std::fs::{File, OpenOptions, create_dir_all};
use std::io::{self, Read, Write};
use std::process::Command;
use std::process::Stdio;
use std::path::Path;
use tauri::api::path::resolve_path;
use tauri::utils::config::parse::parse_json;
use tauri::utils::resources;
use tauri::{AppHandle, Manager};

fn printable<T: std::fmt::Display>(t: &T) -> String {
  t.to_string().replace("\"", "")
}
#[tauri::command]
pub fn generate_testdata(path: &str, lib_path: &str) -> Result<String, String> {
  let lib_path = format!("{}../../../assembler/lib",lib_path);
  println!("{}", lib_path);
  let project_path = json::get_project_directory_with_config_file(path);
  let config = json::parse(path).unwrap();
  // Check if config is an array
  //
  let cpp_command = config["cpp_compile_command"].as_str().unwrap();
  let cpp_flag = config["cpp_compile_flags"].as_str().unwrap();
  let build_dir = config["build_dir"].as_str().unwrap();
  let build_dir = format!("{}/{}", project_path, build_dir);
  match create_dir_all(&Path::new(&build_dir)) {
    Ok(_) => (),
    Err(e) => return Err(e.to_string()),
  }
  let solution_cpp = config["solution_cpp"].as_str().unwrap();
  let mut solution_executable = config["build_dir"].as_str().unwrap();
  let solution_tmp = format!("{}/{}/ans.out", project_path, solution_executable);
  let testcase_dir = config["testcase_dir"].as_str().unwrap();
  let testcase_dir = format!("{}/{}", project_path, testcase_dir);
  match create_dir_all(&Path::new(&testcase_dir)) {
    Ok(_) => (),
    Err(e) => return Err(e.to_string()),
  }
  solution_executable = solution_tmp.as_str();
  let solution_cpp = format!("{}/{}", project_path, solution_cpp);
  let cmd = Command::new(&cpp_command)
    .arg("-std=c++17")
    .arg(solution_cpp)
    .arg("-o")
    .arg(solution_executable)
    .output();
  if let Some(subtasks) = config["subtasks"].as_array() {
    for subtask in subtasks {
      // Construct paths for token, generator, and subtask
      let token_path = format!(
        "{}/{}",
        project_path,
        subtask["token"].as_str().unwrap_or("")
      );
      let gen_path = format!(
        "{}/{}",
        project_path,
        subtask["generator"].as_str().unwrap_or("")
      );
      let subtask_path = format!(
        "{}/subtasks/{}",
        project_path,
        subtask["name"].as_str().unwrap_or("")
      );
      let build_path = format!("{}", build_dir);
      let executable = format!("{}/{}", build_path, subtask["name"].as_str().unwrap_or(""));
      println!("{}", executable);
      let testcase_count = subtask["testcase_count"].as_i64().unwrap();
      let cmd = Command::new(cpp_command)
        .arg("-std=c++17")
        .arg(gen_path)
        .arg("-o")
        .arg(executable)
        .arg(format!("-I{}",  format!("{}/../src", lib_path)))
        .arg("-lassembler")
        .arg(format!("-L{}",lib_path))
        .output()
        .unwrap();
      println!("{:?}", cmd);
      //mcg example in ../mcg_example.json
      for i in 0..testcase_count {
        let input_path = format!(
          "{}/{}_{}.in",
          testcase_dir,
          subtask["name"].as_str().unwrap(),
          i
        );
        let output_path = format!(
          "{}/{}_{}.out",
          testcase_dir,
          subtask["name"].as_str().unwrap(),
          i
        );
        let executable_2 = format!("{}/{}", build_path, subtask["name"].as_str().unwrap_or(""));
        println!("{} {}", input_path, output_path);
        let cmd = Command::new("touch").arg(&input_path).output().unwrap();
        let cmd = Command::new("touch").arg(&output_path).output().unwrap();
        let mut cmd = Command::new(executable_2)
          .output()
          .expect("Failed to execute command");
        if cmd.status.success() {
          // Print the output as a string
          let mut file =
            File::create(&input_path).expect("Failed to create or open file for writing");

          // Write the output to the file
          file
            .write_all(&cmd.stdout)
            .expect("Failed to write to file");
        } else {
          // Print the error message as a string
          let result = String::from_utf8_lossy(&cmd.stderr);
          eprintln!("Error: {}", result);
        }
        let mut child_process = Command::new(solution_executable)
          .stdin(Stdio::piped())
          .stdout(Stdio::piped())
          .spawn()
          .expect("Failed to start command");

        // Specify the file paths for input and output
        let input_file_path = "input.txt";
        let output_file_path = "output.txt";

        // Open the input file for reading
        let mut input_file =
          File::open(&input_path).expect("Failed to open input file for reading");

        // Read the contents of the input file into a buffer
        let mut input_data = Vec::new();
        input_file
          .read_to_end(&mut input_data)
          .expect("Failed to read from input file");

        // Send the input data to the child process's stdin
        if let Some(mut child_stdin) = child_process.stdin.take() {
          child_stdin
            .write_all(&input_data)
            .expect("Failed to write to child process stdin");
        }

        // Wait for the child process to finish and get its exit status
        let status = child_process
          .wait()
          .expect("Failed to wait for child process");

        // Check if the command was successful
        if status.success() {
          // Read the output from the child process's stdout
          let mut output_data = Vec::new();
          if let Some(mut child_stdout) = child_process.stdout.take() {
            child_stdout
              .read_to_end(&mut output_data)
              .expect("Failed to read from child process stdout");

            // Open the output file for writing (create or truncate)
            let mut output_file = OpenOptions::new()
              .write(true)
              .create(true)
              .truncate(true)
              .open(&output_path)
              .expect("Failed to open output file for writing");

            // Write the output data to the output file
            output_file
              .write_all(&output_data)
              .expect("Failed to write to output file");

            println!(
              "Command executed successfully, output written to: {}",
              &output_path
            );
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
    }
  } else {
    return Err("Project configuration is not an array".to_string());
  }
  Ok("success".to_string())
}
