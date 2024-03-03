import React from "react";
import { Grid, Box, Flex, Heading, Text } from "@radix-ui/themes";
import CreateProjectDialog from "./components/CreateProjectDialog.tsx";
import OpenProjectDialog from "./components/OpenProjectDialog.tsx";

export default function Home() {
  return (
    <>
      <Flex
        display="flex"
        direction="column"
        justify="center"
        align="center"
        wrap="wrap"
        gap="4"
        style={{
          height: "calc(96vh - 40px)",
          flex: "1",
        }}
      >
        <Flex direction="column">
          <image>
            <img src="/banner.png" alt="MochaGen Logo" width="600" />
          </image>
          <Text align="center">A simple, fast, and easy-to-use testcase generator.</Text>
        </Flex>
        <Grid columns="2" justify="center" gap="5">
          <CreateProjectDialog />
          <OpenProjectDialog />
        </Grid>
      </Flex>
    </>
  );
}
