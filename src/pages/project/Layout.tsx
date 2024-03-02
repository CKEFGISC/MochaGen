import React from "react";
import { Outlet } from "react-router-dom";
import { Flex } from "@radix-ui/themes";
import Navbar from "../../utils/navbar/Navbar";
import ProcessControl from "../../utils/navbar/ProcessControls";

const Layout: React.FC = () => {
  return (
    <Flex
      display="flex"
      direction="column"
      align="center"
      justify="center"
      gap="4"
      style={{
        height: "100%",
        width: "100%",
        flex: "1",
      }}
    >
      <Flex
        display="flex"
        direction="row"
        align="center"
        justify="center"
        gap="4"
        style={{
          width: "100%",
          flex: "1",
        }}
      >
        <Navbar />
        <Outlet />
      </Flex>
      <Flex align="center" width="100%">
        <ProcessControl />
      </Flex>
    </Flex>
  );
};
export default Layout;
