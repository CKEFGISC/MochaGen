import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Editor  from "@monaco-editor/react";
import "./App.css";

function App() {
    return (
        <Editor 
            height="100vh" 
            defaultValue="// Your code here."  
            language="cpp"
        />
    );
}

export default App;
