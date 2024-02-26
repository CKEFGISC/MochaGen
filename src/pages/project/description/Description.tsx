import { Flex, Heading, Text } from "@radix-ui/themes";
import Editor, { loader } from "@monaco-editor/react";
export default function Description() {
    loader.config({ paths: { vs: "/node_modules/monaco-editor/min/vs" } });
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
                        Get your description ready. <br />
                    </Text>

                    <Editor
                        height="70vh"
                        width="80vw"
                        theme="vs"
                        defaultLanguage="markdown"
                        defaultValue="Add your description here. (Only markdown syntax is available for now)"
                    />

                </Flex>
                {/* Add your content here */}
            </Flex>
        </>
    );
}
