import Editor from "@monaco-editor/react";
function CodeEditor() {
    return (
        <Editor 
            height="100vh" 
            defaultValue="// Your code here."  
            language="cpp"
        />
    );
}

export default CodeEditor;
