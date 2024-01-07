import Editor from "@monaco-editor/react";
function CodeEditor() {
    return (
        <Editor 
            height="85vh" 
            defaultValue="// Your code here."  
            language="cpp"
        />
    );
}

export default CodeEditor;
