// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
/*
const token_position: &str = "token.json";
use serde_json::Value;
use std;use serde_json::error;
#[tauri::command]
fn parse_token(project_directory: &str) -> Result<String, std::io::Error>{
    let token_path = format!("{project_directory}{token_position}");
    let contents = std::fs::read_to_string(token_path)?;
    let contents_str : &str = contents.as_str();
    //let contents = contents.as_str();
    let tokens = serde_json::from_str(contents_str);
    //println!("{}", tokens);
    Ok("yeah".to_string())    

}*/
use serde_json;
use std::io;

const TOKEN_POSITION: &str = "token.json";

#[tauri::command]
fn parse_token(project_directory: &str) -> Result<String, String> {
    let token_path = format!("{}/{}", project_directory, TOKEN_POSITION);
    let contents = match std::fs::read_to_string(&token_path) {
        Ok(contents) => contents,
        Err(e) => return Err(format!("Failed to read file: {}", e)),
    };

    let tokens: serde_json::Result<serde_json::Value> = serde_json::from_str(&contents);
    match tokens {
        Ok(parsed_json) => {
            println!("Parsed JSON: {:?}", parsed_json);
            Ok("JSON parsed successfully".to_string())
        }
        Err(e) => {
            eprintln!("Failed to parse JSON: {}", e);
            Err(format!("Failed to parse JSON: {}", e))
        }
    }
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
