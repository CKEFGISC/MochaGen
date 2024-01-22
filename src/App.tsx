// import libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import utils
import ErrorPage from "./utils/ErrorPage";
import Footer from "./footer/Footer";

// import pages
import Home from "./pages/home/Home";
import Description from "./pages/description/Description";
import TokenEditor from "./pages/token-editor/TokenEditor";
import CodeEditor from "./pages/code-editor/CodeEditor";
import Output from "./pages/output/Output";
import Settings from "./pages/settings/Settings";

// import styles
import "./App.css";

const router = createBrowserRouter([
  { path: "/", element: <Home />, errorElement: <ErrorPage /> },
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
    path: "/token-ditor",
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
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          flex: "1",
          borderBottom: "0",
          backgroundImage:
            "linear-gradient(to right top, #c2a499, #d1b3a8, #dfc2b8, #eed1c8, #fde1d8)",
        }}
      >
        <RouterProvider router={router} />
      </div>
      <Footer />
    </div>
  );
};

export default App;
