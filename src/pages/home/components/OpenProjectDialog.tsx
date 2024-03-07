import React from "react";
import { Button, Flex, Text, Dialog, TextField, IconButton } from "@radix-ui/themes";
import { FaRegFolderOpen } from "react-icons/fa";
import { homeDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";
import { toast } from "react-toastify";
import { invoke } from "@tauri-apps/api/tauri";
import ProcessContext from "../../../utils/navbar/ProcessContext";
import LoadContext from "../../../utils/loading/LoadContext";
import { setConfigPath } from "../../../utils/ConfigPathKeeper";

async function openProject(path: string) {
  // Call backend and try to load json
  await invoke("load_project", { path: path }).catch((e) => {
    throw e;
  });

  // Set the path to the config path keeper
  await setConfigPath(path);
}

// Component
export default function OpenProjectDialog() {
  const [projectPath, setProjectPath] = React.useState<string>("");
  const { toggleLoading, setLog } = React.useContext(LoadContext);
  const { setProcess } = React.useContext(ProcessContext);

  const handleProjectPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectPath(event.target.value);
  };

  const browseProject = async () => {
    // use tauri dialog to browse project path
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: "MochaGen Config File",
          extensions: ["mcg"],
        },
      ],
      defaultPath: await homeDir(),
    });
    if (selected !== null && !Array.isArray(selected)) {
      setProjectPath(selected);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size="3" variant="surface">
          <Text>Open Existing Project</Text>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Open Existing Project</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Please select the <code>PROJECT_NAME.mcg</code> in your project folder.
        </Dialog.Description>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Project Location
            </Text>
            <TextField.Root>
              <TextField.Input
                value={projectPath}
                onChange={handleProjectPathChange}
                placeholder="Please select the location for your project"
                disabled={true}
              />
              <TextField.Slot>
                <IconButton onClick={browseProject} size="1" variant="ghost">
                  <FaRegFolderOpen height="14" width="14" />
                </IconButton>
              </TextField.Slot>
            </TextField.Root>
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close
            onClick={() => {
              toggleLoading();
              setLog("Loading your project...");
              openProject(projectPath)
                .then(() => {
                  toggleLoading();
                  setLog("");
                  setProcess({ type: "set", payload: 1 });
                  toast.success("Project opened successfully!");
                })
                .catch((e) => {
                  toggleLoading();
                  setLog("");
                  toast.error("Couldn't open project: " + e);
                });
            }}
          >
            <Button>Open</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
