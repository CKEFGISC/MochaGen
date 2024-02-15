import { Flex, Heading, Text } from "@radix-ui/themes";

export default function Description() {
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
          height: "90vh",
          flex: "1",
        }}
      >
        <Flex direction="column">
          <Heading size="8" align="center">
            Description <br />
          </Heading>
          <Text align="center">
            Add your description here. <br />
            (Only Markdown Syntax is available for now.) <br />
          </Text>
        </Flex>
        {/* Add your content here */}
      </Flex>
    </>
  );
}
