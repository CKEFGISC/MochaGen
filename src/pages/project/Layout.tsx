import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Flex } from "@radix-ui/themes";
import Navbar from "../../utils/navbar/Navbar";
import "react-toastify/dist/ReactToastify.css";

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
        height: "calc(96vh - 40px)",
        width: "100%",
        flex: "1",
      }}
    >
      <Flex
        display="flex"
        direction="row"
        align="center"
        justify="start"
        gap="4"
        style={{
          width: "100%",
          flex: "1",
        }}
      >
        <Navbar />
        <Container size="4" m="4" mb="0">
          <Outlet />
        </Container>
      </Flex>
      <Flex align="center" width="100%">
        <ProcessControl />
      </Flex>
    </Flex>
  );
};
export default Layout;
