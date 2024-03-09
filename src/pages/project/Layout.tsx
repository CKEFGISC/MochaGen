import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Flex, Grid } from "@radix-ui/themes";
import Navbar from "../../utils/navbar/Navbar";
import "react-toastify/dist/ReactToastify.css";

import ProcessControl from "../../utils/navbar/ProcessControls";

const Layout: React.FC = () => {
  return (
    <Grid
      columns="1"
      gap="4"
      width="100%"
      justify="end"
      align="end"
      style={{
        height: "calc(96vh - 40px)",
        width: "100%",
      }}
    >
      <Flex
        display="flex"
        direction="row"
        align="center"
        justify="start"
        gap="4"
        style={{
          height: "calc(96vh - 100px)",
          width: "100%",
          flex: "1",
        }}
      >
        <Navbar />
        <Container style={{ overflow: "auto" }} size="4" mt="4" mx="4" height="100%">
          <Outlet />
        </Container>
      </Flex>
      <Flex bottom="0" align="center" width="100%" height="5">
        <ProcessControl />
      </Flex>
    </Grid>
  );
};
export default Layout;
