import React from "react";
import { Button, Flex, Text, Dialog, TextField, IconButton } from "@radix-ui/themes";
import LoadContext from "../../../utils/loading/LoadContext";
import ProcessContext from "../../../utils/navbar/ProcessContext";
import { toast } from "react-toastify";
import { FaRegFolderOpen } from "react-icons/fa";
import { homeDir, join } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";

// Create Directory then Call Backend API
async function createNewProject(name: string, basePath: string) {
  let joinedPath = await join(basePath, name);

  // Call backend to create new project
  await invoke("create_project", { projectName: name, projectPath: joinedPath }).catch((e) => {
    throw e;
  });
}
// Component
export default function CreateProjectDialog() {
  // Hooks
  const [defaultBasePath, setDefaultBasePath] = React.useState<string>("");
  const [projectName, setProjectName] = React.useState<string>("");
  const [basePath, setBasePath] = React.useState<string>("");
  const [joinedPath, setJoinedPath] = React.useState<string>("");
  const { toggleLoading, setLog } = React.useContext(LoadContext);
  const { setProcess } = React.useContext(ProcessContext);

  const handleProjectNameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const handleBasePathChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setBasePath(event.target.value);
  };

  React.useEffect(() => {
    async function getDefaultBasePath() {
      setDefaultBasePath(await homeDir());
    }
    if (!defaultBasePath) {
      getDefaultBasePath();
    }
  }, [projectName, basePath]);

  React.useEffect(() => {
    async function joinPath() {
      setJoinedPath(await join(basePath, projectName));
    }
    joinPath();
  }, [basePath, projectName]);

  const browseBasePath = async () => {
    // use tauri dialog to browse project path
    const selected = await open({
      multiple: false,
      directory: true,
      defaultPath: await homeDir(),
      recursive: true,
    });
    if (selected !== null && !Array.isArray(selected)) {
      setBasePath(selected);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size="3">
          <Text>Create New Project</Text>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>New Project</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Your project directory will be under: <br />
          <code style={{ fontSize: "small" }}>{joinedPath}</code>
        </Dialog.Description>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Project Name
            </Text>
            <TextField.Input
              value={projectName}
              onChange={handleProjectNameChange}
              placeholder="Enter your project name"
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Project Path
            </Text>
            <TextField.Root>
              <TextField.Input
                value={basePath}
                onChange={handleBasePathChange}
                placeholder="Please select the location for your project"
                disabled={true}
              />
              <TextField.Slot>
                <IconButton onClick={browseBasePath} size="1" variant="ghost">
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
              setLog("Preparing your new project...");
              createNewProject(projectName, basePath)
                .then(() => {
                  toggleLoading();
                  setLog("");
                  setProcess({ type: "set", payload: 1 });
                  toast.success("Created new project: " + joinedPath);
                })
                .catch((e) => {
                  toggleLoading();
                  setLog("");
                  toast.error("Couldn't create new project: " + e);
                });
            }}
          >
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
