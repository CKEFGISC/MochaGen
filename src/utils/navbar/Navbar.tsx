import React from "react";
import ProcessContext from "./ProcessContext";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { HomeIcon, ReaderIcon, GearIcon, LayersIcon, CodeIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
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

      <ToggleGroup.Item className="ToggleGroupItem" value="1" aria-label="Settings" data-orientation="vertical">
        <GearIcon />
      </ToggleGroup.Item>

      <ToggleGroup.Item className="ToggleGroupItem" value="2" aria-label="Description" data-orientation="vertical">
        <ReaderIcon />
      </ToggleGroup.Item>

      <ToggleGroup.Item className="ToggleGroupItem" value="3" aria-label="Tokenizer" data-orientation="vertical">
        <LayersIcon />
      </ToggleGroup.Item>

      <ToggleGroup.Item className="ToggleGroupItem" value="4" aria-label="CodeEditor" data-orientation="vertical">
        <CodeIcon />
      </ToggleGroup.Item>

      <ToggleGroup.Item className="ToggleGroupItem" value="5" aria-label="Result" data-orientation="vertical">
        <PaperPlaneIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
