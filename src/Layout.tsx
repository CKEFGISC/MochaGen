import React from "react";
import Footer from "./utils/footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface IProps {
  children: React.ReactNode;
}
const Layout = ({ children }: IProps) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: "1",
          borderBottom: "0",
          backgroundImage: "radial-gradient(circle, #fdf7f5, #fcf5f2, #faf2ee, #f8f0eb, #f6eee7)",
        }}
      >
        <div
          style={{
            // minHeight: "calc(96vh - 40px)",
            marginTop: "2vh",
            marginLeft: "2vw",
            marginRight: "2vw",
            marginBottom: "2vh",
            // padding: "0",
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            style={{ transition: "Bounce" }}
          />
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
