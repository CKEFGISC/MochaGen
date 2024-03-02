import React from "react";
import { IconButton } from "@radix-ui/themes"
import { ThickArrowRightIcon } from "@radix-ui/react-icons"
import ProcessContext from "./ProcessContext";

export default function NextPage() {
    const { setProcess } = React.useContext(ProcessContext);
    return (
        <IconButton
            variant="soft"
            radius="full"
            onClick={() => setProcess({ type: "next" })}
        >
            <ThickArrowRightIcon />
        </ IconButton>
    );
}
