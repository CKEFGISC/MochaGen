import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import ErrorPage from "./utils/ErrorPage";

import Home from "./pages/home/Home";
import Description from "./pages/description/Description";
import TokenEditor from "./pages/token-editor/TokenEditor";
import CodeEditor from "./pages/code-editor/CodeEditor";
import Output from "./pages/output/Output";

import "./App.css";

const router = createBrowserRouter([
    { path: "/", element: (<Home />), errorElement: (<ErrorPage />) },
    { path: "/description", element: (<Description />), errorElement: (<ErrorPage />) },
    { path: "/token-ditor", element: (<TokenEditor />), errorElement: (<ErrorPage />) },
    { path: "/code-editor", element: (<CodeEditor />), errorElement: (<ErrorPage />) },
    { path: "/output", element: (<Output />), errorElement: (<ErrorPage />) },
  ]);

function App() {
    return(
        <RouterProvider router={router} />
    );
}

export default App;
