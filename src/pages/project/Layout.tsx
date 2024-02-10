import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../utils/navbar/Navbar";

const Layout: React.FC = () => {
    return (
        <>
            <Outlet />
        </>
    );
};
export default Layout;
