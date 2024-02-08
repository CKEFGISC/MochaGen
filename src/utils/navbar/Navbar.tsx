import React from "react";
import { Box } from "@radix-ui/themes";
import ToggleGroup from "@radix-ui/react-toggle-group";
export interface IProps {
    process: string;
}
export default function Navbar(props: IProps) {
    return (
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
    );
}
