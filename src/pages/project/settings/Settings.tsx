import { TextField, Button, TextArea, Box, Flex, Heading, Text } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import * as React from "react";
import { getConfigPath } from "../../../utils/ConfigPathKeeper";
import { invoke } from "@tauri-apps/api/tauri";

const Settings: React.FC = () => {
  interface SubtaskField {
    name: string;
    testcase_counts: number;
  }

  const [projectDescription, setProjectDescription] = React.useState<string>("");
  const [solutionCpp, setSolutionCpp] = React.useState<string>("");
  const [cppCompileCommand, setCppCompileCommand] = React.useState<string>("g++");
  const [cppCompileFlags, setCppCompileFlags] = React.useState<string>("-std=c++17 -Wall -O3");

  const [subtaskAmount, setSubtaskAmount] = React.useState<number>(1);
  const [subtaskFields, setSubtaskFields] = React.useState<SubtaskField[]>([{ name: "", testcase_counts: 1 }]);

  const handleSubtaskAmountsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtaskAmount(parseInt(e.target.value));

    // 生成对应数量的表单字段
    const newCount: number = parseInt(e.target.value);
    const fields: SubtaskField[] = [];
    for (let i = 0; i < newCount; i++) {
      if (i < subtaskFields.length) {
        fields.push(subtaskFields[i]);
      } else {
        fields.push({ name: "", testcase_counts: 1 });
      }
    }
    setSubtaskFields(fields);
  };

  const handleSubtaskFieldChange = (index: number, field: string, value: string) => {
    // 更新表单字段的值
    const updatedFields = [...subtaskFields];
    updatedFields[index][field] = value;
    setSubtaskFields(updatedFields);
  };

  // load settings

  React.useEffect(() => {
    console.log("load settings");
    invoke("load_settings", { configPath: getConfigPath() })
      .then((result: string) => {
        const settings = JSON.parse(result);
        setProjectDescription(settings.description ? settings.description : "");
        setCppCompileCommand(settings.compileCommand ? settings.compileCommand : "g++");
        setCppCompileFlags(settings.compileFlags ? settings.compileFlags : "-std=c++17 -Wall -O3");
        setSubtaskAmount(settings.subtaskAmount ? settings.subtaskAmount : 1);

        settings.subtasks.forEach((subtask: JSON, index: number) => {
          if (index <= subtaskFields.length) {
            subtaskFields[index].name = subtask["name"];
            subtaskFields[index].testcase_counts = subtask["testcase_count"];
          } else {
            subtaskFields.push({ name: subtask["name"], testcase_counts: subtask["testcase_count"] });
          }
        });
      })
      .catch((e: string) => {
        console.error("API call failed:", e);
      });

    invoke("load_solution_cpp", { configPath: getConfigPath() })
      .then((result: string) => {
        setSolutionCpp(result);
      })
      .catch((e: string) => {
        console.error("API call failed:", e);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
    console.log("Project Description: ", projectDescription);
    console.log("Solution C++: ", solutionCpp);
    console.log("C++ Compile Command: ", cppCompileCommand);
    console.log("C++ Compile Flags: ", cppCompileFlags);
    console.log("Subtask Amount: ", subtaskAmount);
    console.log("Subtask Fields: ", subtaskFields);

    invoke("save_settings", {
      configPath: getConfigPath(),
      description: projectDescription,
      solutionCpp: solutionCpp,
      cppCompileCommand: cppCompileCommand,
      cppCompileFlags: cppCompileFlags,
      subtaskAmount: subtaskAmount.toString(),
      subtaskFields: JSON.stringify(subtaskFields),
    }).catch((e: string) => {
      console.error("API call failed:", e);
    });
  };

  return (
    <Flex direction="column" wrap="wrap" justify="start" align="center" gap="4" height="100%">
      <Flex direction="column" gap="2" align="center" width="100%" height="max-content">
        <Heading
          size="5"
          style={{
            textAlign: "center",
          }}
        >
          Project Settings
        </Heading>
        <Text align="center">This is where you can set up your project settings.</Text>
      </Flex>
      <Box height="max-content" style={{ width: "60dvw", minWidth: "400px" }}>
        <div style={{ height: "75dvh", padding: "20px" }}>
          <Form.Root className="FormRoot" onSubmit={handleSubmit}>
            <Heading mt="5" mb="2" size="3">
              Basic Settings
            </Heading>
            <Text style={{ margin: "5px" }}>Project Name</Text>
            <TextField.Input
              disabled
              variant="soft"
              size="2"
              radius="large"
              type="text"
              defaultValue="TODO: find Project Name from js"
              required
            />
            <Form.FormField className="FormField" name="description">
              <div style={{ margin: "5px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <Form.Label>Project Description (optional)</Form.Label>
              </div>
              <Form.Control asChild>
                <TextArea
                  variant="soft"
                  size="3"
                  value={projectDescription}
                  onChange={(e) => {
                    setProjectDescription(e.target.value);
                  }}
                  placeholder="Input your simple description for this project"
                />
              </Form.Control>
            </Form.FormField>
            <Form.FormField className="FormField" name="solution">
              <div style={{ margin: "5px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <Form.Label>Solution C++ File</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Please enter your C++ solution code.
                </Form.Message>
              </div>
              <Form.Control asChild>
                <TextArea
                  variant="soft"
                  size="3"
                  value={solutionCpp}
                  onChange={(e) => {
                    setSolutionCpp(e.target.value);
                  }}
                  placeholder="Input your solution code here."
                  required
                />
              </Form.Control>
            </Form.FormField>
            <Heading mt="5" mb="2" size="3">
              C++ Compile Options
            </Heading>
            <Form.FormField className="FormField" name="cppCompileCommand">
              <div style={{ margin: "5px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <Form.Label>C++ Compile Command</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Please enter the command to compile your C++ code.
                </Form.Message>
              </div>
              <Form.Control asChild>
                <TextField.Input
                  variant="soft"
                  size="2"
                  radius="large"
                  value={cppCompileCommand}
                  onChange={(e) => {
                    setCppCompileCommand(e.target.value);
                  }}
                  required
                />
              </Form.Control>
            </Form.FormField>
            <Form.FormField className="FormField" name="cppCompileFlags">
              <div style={{ margin: "5px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <Form.Label>C++ Compile Flags</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Please enter the Flags to your compiler.
                </Form.Message>
              </div>
              <Form.Control asChild>
                <TextField.Input
                  variant="soft"
                  size="2"
                  type="text"
                  radius="large"
                  value={cppCompileFlags}
                  onChange={(e) => {
                    setCppCompileFlags(e.target.value);
                  }}
                  required
                />
              </Form.Control>
            </Form.FormField>
            <Heading mt="5" mb="2" size="3">
              Subtask Options
            </Heading>
            <Form.FormField className="FormField" name="subtaskAmount">
              <div style={{ margin: "5px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <Form.Label>Subtask Amounts</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Please enter how many subtasks you want.
                </Form.Message>
                <Form.Message className="FormMessage" match="rangeUnderflow">
                  Please enter a positive interger.
                </Form.Message>
                <Form.Message className="FormMessage" match="typeMismatch">
                  Please enter a positive interger.
                </Form.Message>
              </div>
              <Form.Control asChild>
                <TextField.Input
                  size="2"
                  variant="soft"
                  radius="large"
                  type="number"
                  min="1"
                  value={subtaskAmount}
                  onChange={handleSubtaskAmountsChange}
                  required
                />
              </Form.Control>
            </Form.FormField>
            {subtaskFields.map((field, index) => (
              <Box my="3" height="min-content" width="100%" key={`subtask${index}`}>
                <Flex width="100%" gap="3">
                  <Form.FormField
                    className="FormField"
                    name={`subtaskName${index}`}
                    key={`subtaskName${index}`}
                    style={{ width: "50%" }}
                  >
                    <Form.Label> Subtask {index + 1} Name</Form.Label>

                    <Form.Control asChild>
                      <TextField.Input
                        size="2"
                        variant="soft"
                        radius="large"
                        value={field.name}
                        type="text"
                        pattern="[A-Za-z0-9_]*"
                        onChange={(e) => handleSubtaskFieldChange(index, "name", e.target.value)}
                        required
                      />
                    </Form.Control>
                    <Form.Message className="FormMessage" match="patternMismatch">
                      <code>
                        <pre style={{ margin: "0px", whiteSpace: "pre-wrap" }}>
                          {"Name must only contain A-Z, a-z, 0-9, or underline."}
                        </pre>
                      </code>
                    </Form.Message>
                  </Form.FormField>
                  <Form.FormField
                    className="FormField"
                    name={`testcaseCounts${index}`}
                    key={`testcaseCounts${index}`}
                    style={{ width: "50%" }}
                  >
                    <Form.Label>Testcase Amount</Form.Label>
                    <Form.Control asChild>
                      <TextField.Input
                        size="2"
                        variant="soft"
                        radius="large"
                        value={field.testcase_counts}
                        type="number"
                        min="1"
                        onChange={(e) => handleSubtaskFieldChange(index, "testcaseCounts", e.target.value)}
                        required
                      />
                    </Form.Control>
                    <Form.Message className="FormMessage" match="typeMismatch">
                      <code>
                        <pre style={{ margin: "0px" }}> {"require positive interger"}</pre>
                      </code>
                    </Form.Message>
                    <Form.Message className="FormMessage" match="rangeUnderflow">
                      <code>
                        <pre style={{ margin: "0px", whiteSpace: "pre-wrap" }}> {"require positive interger"}</pre>
                      </code>
                    </Form.Message>
                  </Form.FormField>
                </Flex>
              </Box>
            ))}
            <Form.Submit asChild>
              <Flex width="100%" justify="end">
                <Button my="5">Save</Button>
              </Flex>
            </Form.Submit>
          </Form.Root>
        </div>
      </Box>
    </Flex>
  );
};

export default Settings;
