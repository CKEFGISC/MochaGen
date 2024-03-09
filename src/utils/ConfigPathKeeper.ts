const pathKey = (Math.random() + 1).toString(36).substring(7);

export function getConfigPath() {
  return JSON.parse(window.sessionStorage?.getItem(pathKey));
}

export async function setConfigPath(path: String) {
  return window.sessionStorage?.setItem(pathKey, JSON.stringify(path));
}

import { dirname } from "@tauri-apps/api/path";
export function getProjectPath() {
  dirname(getConfigPath())
    .then((res) => {
      return res;
    })
    .catch((e) => {
      throw e;
    });
}
