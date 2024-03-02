import React from "react";
import ProcessContext from "./ProcessContext";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  HomeIcon,
  ReaderIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import "./styles.css";
export default function Navbar() {
  const { process, setProcess } = React.useContext(ProcessContext);
  return (
    <ToggleGroup.Root
      className="ToggleGroup"
      type="single"
      defaultValue={process.toString()}
      value={process.toString()}
      onValueChange={(nxt) => setProcess({ type: "set", payload: parseInt(nxt) })}
      orientation="vertical"
      data-orientation="vertical"
    >
      <ToggleGroup.Item className="ToggleGroupItem" value="0" aria-label="Home" data-orientation="vertical">
        <HomeIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item className="ToggleGroupItem" data-orientation="vertical" value="1" aria-label="Description">
        <ReaderIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
