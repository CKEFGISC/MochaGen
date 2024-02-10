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
                    height: "90vh",
                    flex: "1",
                }}
            >
                <Box>
                    <image>
                        <img
                            src="https://raw.githubusercontent.com/CKEFGISC/MochaGen/main/assets/logo.png"
                            alt="MochaGen Logo"
                            width="600"
                            height="100"
                        />
                    </image>
                </Box>
                <Flex direction="column">
                    <Heading size="9" align="center">
                        MochaGen <br />
                    </Heading>
                    <Text align="center">
                        A simple, fast, and easy-to-use testcase generator.
                    </Text>
                </Flex>
                <Grid columns="2" justify="center" gap="5">
                    <CreateProjectDialog />
                    <OpenProjectDialog />
                </Grid>
            </Flex>
        </>
    );
}
