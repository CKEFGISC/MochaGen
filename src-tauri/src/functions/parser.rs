use super::json;
use serde_json;
use std::fs::File;
use std::io;
use std::io::Write;
use std::path::Path;
//use json::{get_mcg_with_project_directory, parse};
//確認型別 debug用
fn print_type_of<T>(_: &T) {
  println!("{}", std::any::type_name::<T>())
}

//把那個json object 變成string比較好輸出
fn printable<T: std::fmt::Display>(t: &T) -> String {
  t.to_string().replace("\"", "")
}
const TOKEN_POSITION: &str = "token.json";
const GENERATOR_FORMAT: &str = "gen.cpp";
const GENERATOR_POSITION: &str = "gen";
const TEMPORARY_TOKEN: &str = "/Users/jimtsai/ytp/test";
const CPP_TEMPLATE_HEAD: &str = "
#include<bits/stdc++.h>
#include<assembler.h>
using namespace std;

signed main(){
    ios_base::sync_with_stdio(false);cin.tie(0);

";

#[tauri::command]
pub fn parse_token(project_directory: &str) -> Result<String, String> {
  let token_path = format!("{}/{}", TEMPORARY_TOKEN, TOKEN_POSITION); //路徑 因為還沒創好先用我存在本地的
  let contents = match std::fs::read_to_string(&token_path) {
    Ok(contents) => contents,
    Err(e) => return Err(format!("Failed to read file: {}", e)),
  }; // 讀取json file

  let tokens_all: serde_json::Result<serde_json::Value> = serde_json::from_str(&contents); //parse json
  match tokens_all {
    //chatgpt 跟我說這樣編譯才會過 好像是因為parse的結果會有一個status code，成功或失敗都要接住，畢竟rust不能出錯嘛
    Ok(parsed_json) => {
      //parse 過了！
      //println!("Parsed JSON: {:?}", parsed_json); //debug用
      if let Some(tokens_subtasks) = parsed_json["subtasks"].as_array() {
        //這邊也是要接error
        let gen_dir = format!("{}/gen", project_directory); // 找到檔案要寫去哪裡
        if !std::path::Path::new(&gen_dir).exists() {
          // 如果檢測他是否已經有路徑 沒有的話就創
          if let Err(e) = std::fs::create_dir(&gen_dir) {
            //chatgpt跟我說這樣編譯才會過 要接住資料夾創建失敗的可能性
            return Err(format!("Failed to create directory '{}': {}", gen_dir, e));
            //創檔失敗的報錯
          }
        }
        for tokens in tokens_subtasks {
          // 處理每個subtask 分別開檔寫黨
          let subtask_id = tokens["subtask_id"].as_str().unwrap_or_default();
          let mut file_name = format!("{}/gen/sub{}gen.cpp", project_directory, subtask_id);
          let mut file = match std::fs::File::create(&file_name) {
            Ok(file) => file,
            Err(e) => return Err(format!("Failed to create file '{}': {}", file_name, e)),
          };

          let mut code = CPP_TEMPLATE_HEAD.to_string();
          if let Some(tokens_array) = tokens["tokens"].as_array() {
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
              for (index, (key, value)) in
                token_params["attr"].as_object().unwrap().iter().enumerate()
              {
                if (key.starts_with('_')) {
                  code = format!("{}{}(", code, key);
                } else {
                  code = format!("{}.{}(", code, key);
                }
                println!("{}", printable(value));
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
          if let Err(e) = file.write_all(code.as_bytes()) {
            return Err(format!("Failed to write to file '{}': {}", file_name, e));
          }
        }
      } else {
        return Err("Subtasks not found in JSON".to_string());
      }
    }
    Err(e) => {
      eprintln!("Failed to parse JSON: {}", e);
      return Err(format!("Failed to parse JSON: {}", e));
    }
  }
  Ok("success".to_string())
}

#[tauri::command]
pub fn run_parser(project_path: &str) -> Result<String, String> {
  Ok("success".to_string())
}

#[tauri::command]
pub fn load_checker(project_path: &str) -> Result<String, String> {
  Ok("success".to_string())
}

#[tauri::command]
pub fn load_generator(project_path: &str) -> Result<String, String> {
  Ok("success".to_string())
}

#[tauri::command]
pub fn save_checker(project_path: &str) -> Result<String, String> {
  Ok("success".to_string())
}

#[tauri::command]
pub fn save_generator(project_path: &str) -> Result<String, String> {
  Ok("success".to_string())
}
