import { useContext } from "react";
import { Grid, Flex, Text } from "@radix-ui/themes";
import CreateProjectDialog from "./components/CreateProjectDialog.tsx";
import OpenProjectDialog from "./components/OpenProjectDialog.tsx";
import Loading from "../../utils/loading/Loading";
import LoadContext from "../../utils/loading/LoadContext.tsx";

export default function Home() {
  const { isLoading } = useContext(LoadContext);
  return isLoading ? (
    <Loading />
  ) : (
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
          <img src="/banner.png" alt="MochaGen Logo" width="600" />
          <Text align="center">A simple, fast, and easy-to-use testcase generator.</Text>
        </Flex>
        <Grid columns="2" justify="center" gap="5">
          <CreateProjectDialog />
          <OpenProjectDialog />
        </Grid>
        {/* <Navbar /> */}
      </Flex>
    </>
  );
}
