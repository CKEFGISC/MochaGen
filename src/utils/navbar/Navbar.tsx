import React from "react";
import ToggleGroup from "@radix-ui/react-toggle-group";
export interface IProps {
    process: string;
}
export default function Navbar(props: IProps) {
    return (
        <ToggleGroup.Root 
            className = "Navbar"
            type = "single"
            defaultValue = { props.process }
            aria-label = "Process"
        >
            <ToggleGroup.Item 
                className = "NavbarItem"
                value = "statement"
                Aria-label = "Statement"
            >
                Statement
            </ToggleGroup.Item>
            <ToggleGroup.Item
                className = "NavbarItem"
                value = "token"
                Aria-label = "Token"
            >
                Token
            </ToggleGroup.Item>

            <ToggleGroup.Item
                className = "NavbarItem"
                value = "code"
                Aria-label = "Code"
            >
                Code
            </ToggleGroup.Item>

            <ToggleGroup.Item
                className = "NavbarItem"
                value = "generator"
                Aria-label = "Generator"
            >
                Generator 
            </ToggleGroup.Item>

            <ToggleGroup.Item
                className = "NavbarItem"
                value = "packager"
                Aria-label = "Packager"
            >
               Packager 
            </ToggleGroup.Item>
        </ToggleGroup.Root>
    );
}
