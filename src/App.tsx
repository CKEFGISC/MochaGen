// import libraries
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import utils
import ErrorPage from "./utils/ErrorPage";
import Footer from "./footer/Footer";
import Loading from "./utils/Loading";

// import pages
import Home from "./pages/home/Home";
import Description from "./pages/description/Description";
import TokenEditor from "./pages/token-editor/TokenEditor";
import CodeEditor from "./pages/code-editor/CodeEditor";
import Output from "./pages/output/Output";
import Settings from "./pages/settings/Settings";

// import styles
import "./App.css";


const [state, setState] = React.useState();
const [loading, setLoading] = React.useState(false);
const [log, setLog] = React.useState("");

const router = createBrowserRouter([
    { path: "/", element: <Home {...state} />, errorElement: <ErrorPage /> },
    {
        path: "/description",
        element: <Description />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/settings",
        element: <Settings />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/token-editor",
        element: <TokenEditor />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/code-editor",
        element: <CodeEditor />,
        errorElement: <ErrorPage />,
    },
    { path: "/output", element: <Output />, errorElement: <ErrorPage /> },
]);

const App = () => {

    if(loading) return <Loading log = { log }/>;
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
                <RouterProvider router={router} />
            </div>
            <Footer />
        </div>
    );
};

export default App;
