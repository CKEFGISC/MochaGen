// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

/*
import { invoke } from '@tauri-apps/api/tauri'
invoke('parse_token', { projectDirectory: "/Users/jimtsai/ytp/test" });
*/

mod functions;

use serde_json;
use std::fs::File;
use std::io;
use std::io::Write;

use functions::{blockly, description, generator, init, parser, settings, subtask};

fn main() {
  use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
  // let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  // let close = CustomMenuItem::new("close".to_string(), "Close");
  let submenu = Submenu::new("MochaGen", Menu::new());
  let menu = Menu::new()
    .add_native_item(MenuItem::Copy)
    // .add_item(CustomMenuItem::new("hide", "Hide"))
    .add_submenu(submenu);
  tauri::Builder::default()
    .setup(|app| {
      let mut resource_path = app
        .path_resolver()
        .resolve_resource("../../assembler/lib")
        .expect("failed to resolve path");
      Ok(())
    })
    .menu(menu)
    .invoke_handler(tauri::generate_handler![
      init::create_project,
      init::load_project,
      settings::load_settings,
      settings::load_solution_cpp,
      settings::save_settings,
      description::load_description,
      description::save_description,
      blockly::load_blockly,
      blockly::save_blockly,
      blockly::save_token,
      parser::parse_token,
      parser::run_parser,
      parser::load_validator,
      parser::load_generator,
      parser::save_validator,
      parser::save_generator,
      generator::generate_testdata,
      subtask::get_subtasks,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
