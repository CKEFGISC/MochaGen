// import libraries
import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import layout
import Layout from "./Layout";
// import Navigator
import Navigator from "./Navigator";

// import utils
import ErrorPage from "./utils/ErrorPage";
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
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigator />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "project",
          element: <ProjectLayout />,
          errorElement: <ErrorPage />,
          children: [
            {
              path: "description",
              element: <Description />,
            },
            {
              path: "settings",
              element: <Settings />,
              errorElement: <ErrorPage />,
            },
            {
              path: "token-editor",
              element: <TokenEditor />,
              errorElement: <ErrorPage />,
            },
            {
              path: "code-editor",
              element: <CodeEditor />,
              errorElement: <ErrorPage />,
            },
            {
              path: "output",
              element: <Output />,
              errorElement: <ErrorPage />,
            },
          ],
        },
      ],
    },
  ]);

  const createPage = () => {
    return isLoading ? <Loading /> : <RouterProvider router={router} />;
  };

  return <Layout>{createPage()}</Layout>;
};

export default App;
