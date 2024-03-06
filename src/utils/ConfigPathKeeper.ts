const pathKey = (Math.random() + 1).toString(36).substring(7);

export function getConfigPath() {
  return window.sessionStorage?.getItem(pathKey);
}

export function setConfigPath(path: String) {
  return window.sessionStorage?.setItem(pathKey, JSON.stringify(path));
}
