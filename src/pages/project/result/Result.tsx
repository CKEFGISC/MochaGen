import React from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";

const Result: React.FC = () => {
  return (
    <>
      <Flex
        display="flex"
        direction="column"
        justify="start"
        align="center"
        wrap="wrap"
        gap="4"
        style={{
          height: "max-content",
          flex: "1",
        }}
      >
        <Flex direction="column" gap="2" align="center" width="100%" height="max-content">
          <Heading
            size="5"
            style={{
              textAlign: "center",
            }}
          >
            Testdata Results
          </Heading>
          <Text align="center">Download the generated testdata</Text>
        </Flex>
      </Flex>
    </>
  );
};

export default Result;
