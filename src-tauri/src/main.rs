// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command


/*
import { invoke } from '@tauri-apps/api/tauri'
invoke('parse_token', { projectDirectory: "/Users/jimtsai/ytp/test" });
*/

use serde_json;
use std::io;

const TOKEN_POSITION: &str = "token.json";
const GENERATOR_FORMAT: &str = "gen.cpp";
const GENERATOR_POSITION: &str = "gen";
const TEMPORARY_TOKEN: &str = "/Users/jimtsai/ytp/test";
const CPP_TEMPLATE_HEAD: &str = "
#include<bits/stdc++.h>
using namespace std;

signed main(){
    ios_base::sync_with_stdio(false);cin.tie(0);

";
fn print_type_of<T>(_: &T) {
    println!("{}", std::any::type_name::<T>())
}

use std::fs::File;
use std::io::{Write};

#[tauri::command]
fn parse_token(project_directory: &str) -> Result<String, String> {

    let token_path = format!("{}/{}", TEMPORARY_TOKEN, TOKEN_POSITION);
    let contents = match std::fs::read_to_string(&token_path) {
        Ok(contents) => contents,
        Err(e) => return Err(format!("Failed to read file: {}", e)),
    };

    let tokens_all: serde_json::Result<serde_json::Value> = serde_json::from_str(&contents);
    match tokens_all {
        Ok(parsed_json) => {
            println!("Parsed JSON: {:?}", parsed_json);
            if let Some(tokens_subtasks) = parsed_json["subtasks"].as_array() {
                for tokens in tokens_subtasks {
                    let subtask_id = tokens["subtask_id"].as_str().unwrap_or_default();
                    let gen_dir = format!("{}/gen", project_directory);
                    if !std::path::Path::new(&gen_dir).exists() {
                        if let Err(e) = std::fs::create_dir(&gen_dir) {
                            return Err(format!("Failed to create directory '{}': {}", gen_dir, e));
                        }
                    }
                    let file_name = format!("{}/sub{}_gen.cpp", gen_dir, subtask_id);
                    let mut file = match std::fs::File::create(&file_name) {
                        Ok(file) => file,
                        Err(e) => return Err(format!("Failed to create file '{}': {}", file_name, e)),
                    };
                    let code = CPP_TEMPLATE_HEAD.to_string();
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


fn main() {
    use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
    let menu = Menu::new()
       .add_native_item(MenuItem::Copy)
       .add_item(CustomMenuItem::new("hide", "Hide"))
       .add_submenu(submenu);

    tauri::Builder::default()
        .menu(menu)
        .invoke_handler(tauri::generate_handler![parse_token])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
