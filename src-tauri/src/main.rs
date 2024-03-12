// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

/*
import { invoke } from '@tauri-apps/api/tauri'
invoke('parse_token', { projectDirectory: "/Users/jimtsai/ytp/test" });
*/

mod functions;

use functions::{
  blockly, code, description, generator, init, parser, settings, subtask, validator,
};

fn main() {
  use tauri::{Menu, MenuItem};
  // let submenu = Submenu::new("MochaGen", Menu::new());
  let menu = Menu::new()
    .add_native_item(MenuItem::Copy)
    .add_native_item(MenuItem::Paste)
    .add_native_item(MenuItem::SelectAll)
    .add_native_item(MenuItem::Undo)
    .add_native_item(MenuItem::Redo);

  tauri::Builder::default()
    .setup(|app| {
      let _resource_path = app
        .path_resolver()
        .resolve_resource("../../assembler/lib")
        .expect("failed to resolve path");
      Ok(())
    })
    .menu(menu)
    .invoke_handler(tauri::generate_handler![
      validator::validate_subtask,
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
      generator::generate_testdata,
      code::load_gen_cpp,
      code::save_gen_cpp,
      code::load_validator_cpp,
      code::save_validator_cpp,
      subtask::get_subtasks,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
