import React from "react";
import Footer from "./utils/footer/Footer";
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
                    backgroundImage:
                        "radial-gradient(circle, #fdf7f5, #fcf5f2, #faf2ee, #f8f0eb, #f6eee7)",
                }}
            >
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
