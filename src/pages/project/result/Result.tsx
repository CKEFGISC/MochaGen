import React, { useState, useContext } from "react";
import { Button, Flex, Heading, Text, Table } from "@radix-ui/themes";
import LoadContext from "../../../utils/loading/LoadContext";

const Result: React.FC = () => {
  const [isGenerated, setIsGenerated] = useState(false);
  const { toggleLoading, setLog } = useContext(LoadContext);
  const generate = () => {
    setLog("Preparing your testdata and a cup of Mocha...");
    toggleLoading();
    new Promise((resolve) => setTimeout(resolve, 3000));
    setIsGenerated(true);
    setLog("");
    toggleLoading();
  };
  return (
    <>
      <Flex
        display="flex"
        direction="column"
        justify="start"
        align="center"
        wrap="wrap"
        gap="4"
        style={{
          height: "max-content",
          flex: "1",
        }}
      >
        <Flex direction="column" gap="2" align="center" width="100%" height="max-content">
          <Heading
            size="5"
            style={{
              textAlign: "center",
            }}
          >
            Testdata Results
          </Heading>
          <Text align="center">Download the generated testdata</Text>
        </Flex>
        <Button size="4" onClick={generate}>
          Generate
        </Button>
        <Table.Root style={{ width: "80%", visibility: isGenerated ? "visible" : "hidden" }}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>index</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Subtask Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Testcase Amount</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Validator Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>1</Table.RowHeaderCell>
              <Table.Cell>subtask1</Table.Cell>
              <Table.Cell>5</Table.Cell>
              <Table.Cell>Not Generated</Table.Cell>
              <Table.Cell>Not Checked</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.RowHeaderCell>2</Table.RowHeaderCell>
              <Table.Cell>subtask2</Table.Cell>
              <Table.Cell>5</Table.Cell>
              <Table.Cell>Generated</Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Text color="green">Passed (4/5): 7, 8, 9, 10,</Text>
                  <Text color="red">Failed (1/5): 6,</Text>
                </Flex>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
        <Button m="6" size="4" style={{ visibility: isGenerated ? "visible" : "hidden" }}>
          Open Folder
        </Button>
      </Flex>
    </>
  );
};

export default Result;
