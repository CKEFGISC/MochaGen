import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Flex } from "@radix-ui/themes";
import Navbar from "../../utils/navbar/Navbar";

const Layout: React.FC = () => {
  return (
    <>
      <Flex
        display="flex"
        direction="row"
        align="center"
        justify="center"
        gap="4"
        style={{
          height: "calc(100% - 40px)",
          width: "100%",
          flex: "1",
        }}
      >
        <Flex justify="start">
          <Navbar />
        </Flex>
        <Flex>
          <Outlet />
        </Flex>
      </Flex>
    </>
  );
};
export default Layout;
