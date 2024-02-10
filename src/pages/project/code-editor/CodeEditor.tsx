import Editor from "@monaco-editor/react";

const CodeEditor: React.FC = () => {
    return (
        <Editor
            height="100vh"
            defaultValue="// Your code here."
            language="cpp"
        />
    );
};

export default CodeEditor;
