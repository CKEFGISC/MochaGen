import { Box, Flex } from "@radix-ui/themes"
import AtomicSpinner from "atomic-spinner";

function Spinner() {
    return (
        <>
            <Flex 
                direction="column"
                align="center"
                justify="center"
                display="flex"
                wrap="wrap"
                gap="4"
                style={{
                    height: "90vh",
                    flex: "1",
                }}
            >
                <Box>
                    <AtomicSpinner />
                </Box>
                <Box>
                        Hello world.
                </Box>
            </Flex>
        </>
    );
}

export default Spinner;
