use super::json;
use serde_json;
use std::fs::File;
use std::io;
use std::io::Write;
use std::path::Path;
use tauri::utils::config::parse::parse_json;
//use json::{get_mcg_with_project_directory, parse};
//確認型別 debug用
fn print_type_of<T>(_: &T) {
  println!("{}", std::any::type_name::<T>())
}

//把那個json object 變成string比較好輸出
fn printable<T: std::fmt::Display>(t: &T) -> String {
  t.to_string().replace("\"", "")
}

const CPP_TEMPLATE_HEAD: &str = "
#include<bits/stdc++.h>
#include\"assembler.hpp\"
using namespace std;
using namespace MochaGen;

signed main(){
    ios_base::sync_with_stdio(false);cin.tie(0);

";

#[tauri::command]
pub fn parse_token(token_path: &str, gen_path: &str) -> Result<String, String> {
  //let token_path = format!("{}/{}", TEMPORARY_TOKEN, TOKEN_POSITION); //路徑 因為還沒創好先用我存在本地的
  let contents = match std::fs::read_to_string(&token_path) {
    Ok(contents) => contents,
    Err(e) => return Err(format!("Failed to read {}: {}", token_path, e)),
  }; // 讀取json file
  let tokens_all: serde_json::Result<serde_json::Value> = serde_json::from_str(&contents); //parse json
  match tokens_all {
    //chatgpt 跟我說這樣編譯才會過 好像是因為parse的結果會有一個status code，成功或失敗都要接住，畢竟rust不能出錯嘛
    Ok(parsed_json) => {
      //parse 過了！
      println!("{}", parsed_json);
      let _subtask_id = parsed_json["subtask_id"].as_str().unwrap_or_default();
      let file_name = gen_path; //format!("{}/gen/{}_gen.cpp", project_directory, subtask_name);

      //if it exists, read it and recover it

      let mut file = std::fs::OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(file_name)
        .unwrap();
      let mut code = CPP_TEMPLATE_HEAD.to_string();

      if let Some(tokens_array) = parsed_json["tokens"].as_array() {
        for token_object in tokens_array {
          let token_params = &token_object["object"];
          let category = printable(&token_object["object"]["category"]);
          let variable_name = printable(&token_object["id"]);
          let class = printable(&token_params["class"]);
          // 處理array的template
          if category == "array".to_string() {
            code = format!("{}gen_{}<{}> {}=gen", code, category, class, variable_name);
            //code = format!("{}({}, {})", code, printable(token_params["len"]), printable(token_params["content"]));
          } else {
            code = format!("{}gen_{} {}=gen", code, category, variable_name);
          }
          //end

          //處理attr
          for (index, (key, value)) in token_params["attr"].as_object().unwrap().iter().enumerate()
          {
            if (key.starts_with('_')) {
              code = format!("{}{}(", code, key);
            } else {
              code = format!("{}.{}(", code, key);
            }
            if let Some(attributes_array) = value.as_object() {
              for (i, attribute) in attributes_array.iter() {
                if (code.ends_with('(')) {
                  if (attribute == "integer" || attribute == "float" || i == "pattern") {
                    code = format!("{}{}", code, attribute);
                  } else {
                    code = format!("{}{}", code, printable(attribute));
                  }
                } else {
                  code = format!("{},{}", code, printable(attribute));
                }
              }
            }
            if code.ends_with(',') {
              code.pop();
            }
            code = format!("{})", code);
          }
          code = format!("{};\n", code);
          //end
        }
      } else {
        return Err("Tokens array not found in JSON".to_string());
      }

      if let Some(tokens_array) = parsed_json["output"].as_array() {
        for token_object in tokens_array {
          if token_object["class"].to_string() == "printwords".to_string() {
            code = format!("{}\ncout<<{};", code, token_object["words"].to_string());
          } else {
            code = format!(
              "{}\ncout<<{};",
              code,
              token_object["id"].to_string().replace("\"", "")
            );
          }
        }
      }
      code.push('}');

      if let Err(e) = file.write_all(code.as_bytes()) {
        return Err(format!("Failed to write to file '{}': {}", file_name, e));
      }
    }

    Err(e) => {
      eprintln!("Failed to parse JSON: {}", e);
      return Err(format!("Failed to parse JSON: {}", e));
    }
  }
  Ok("success".to_string())
}
// /Users/jimtsai/ytp/test/subtask1/token.json
#[tauri::command]
pub fn run_parser(config_path: &str, subtask_index: usize) -> Result<String, String> {
  let project_path = json::get_project_directory_with_config_file(config_path);
  let config = json::parse(config_path).unwrap();
  println!("{}", config);
  // Check if config is an array
  if let Some(subtasks) = config["subtasks"].as_array() {
    println!("{:?}", subtasks);
    let subtask = &subtasks[subtask_index];
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
      "{}/{}",
      project_path,
      subtask["name"].as_str().unwrap_or("")
    );

    // Parse token for each subtask
    parse_token(&token_path, &gen_path)?;
  } else {
    return Err("Project configuration is not an array".to_string());
  }
  Ok("success".to_string())
}
