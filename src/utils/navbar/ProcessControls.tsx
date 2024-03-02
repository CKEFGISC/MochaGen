import React from "react";
import { Grid, IconButton, Box, Container, Flex } from "@radix-ui/themes";
import { ThickArrowRightIcon, ThickArrowLeftIcon } from "@radix-ui/react-icons";
import ProcessContext from "./ProcessContext";

export function NextPage() {
  const { setProcess } = React.useContext(ProcessContext);
  return (
    <IconButton variant="soft" radius="full" onClick={() => setProcess({ type: "next" })}>
      <ThickArrowRightIcon />
    </IconButton>
  );
}

export function PrevPage() {
  const { setProcess } = React.useContext(ProcessContext);
  return (
    <IconButton variant="soft" radius="full" onClick={() => setProcess({ type: "prev" })}>
      <ThickArrowLeftIcon />
    </IconButton>
  );
}

export default function ProcessControls() {
  return (
    <Grid height="7" columns="2" width="100%" justify="center">
      <Flex direction="row">
        <PrevPage />
      </Flex>
      <Flex direction="row-reverse">
        <NextPage />
      </Flex>
    </Grid>
  );
}
