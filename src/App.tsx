// import libraries
import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import utils
import ErrorPage from "./utils/ErrorPage";
import Footer from "./utils/footer/Footer";
import Loading from "./utils/loading/Loading";
import LoadContext from "./utils/loading/LoadContext";

// import pages
import Home from "./pages/home/Home";
import ProjectLayout from "./pages/project/Layout";
import Description from "./pages/project/description/Description";
import TokenEditor from "./pages/project/token-editor/TokenEditor";
import CodeEditor from "./pages/project/code-editor/CodeEditor";
import Output from "./pages/project/output/Output";
import Settings from "./pages/project/settings/Settings";

// import styles
import "./App.css";





const App: React.FC = () => {
    const { isLoading } = useContext(LoadContext);
    // const [ process, setProcess ] = React.useState("");
    const router = createBrowserRouter([
        { 
            path: "/",
            element: <Home />,
            errorElement: <ErrorPage /> 
        },
        {
            path: "/project",
            element: <ProjectLayout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/project/description",
                    element: <Description />,
                },
                {
                    path: "/project/settings",
                    element: <Settings />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "/project/token-editor",
                    element: <TokenEditor />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "/project/code-editor",
                    element: <CodeEditor />,
                    errorElement: <ErrorPage />,
                },
                { path: "/project/output", element: <Output />, errorElement: <ErrorPage /> },
            ]
        },
    ]);

    const createPage = () => {
        return isLoading? <Loading /> : <RouterProvider router={router} /> 
    } 

    return (
        <div
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
            <div
                style={{
                    flex: "1",
                    borderBottom: "0",
                    backgroundImage:
                    "radial-gradient(circle, #fdf7f5, #fcf5f2, #faf2ee, #f8f0eb, #f6eee7)",
                }}
            >
                { createPage() } 
            </div>
            <Footer />
        </div>
    );
};

export default App;
