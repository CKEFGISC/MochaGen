import React from "react";
import { Button, Flex, Heading, Text, Table } from "@radix-ui/themes";

const Result: React.FC = () => {
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
        <Button size="4">Generate</Button>
        <Table.Root style={{ width: "80%" }}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>index</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Subtask Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Testcase Amonut</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Checker Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>1</Table.RowHeaderCell>
              <Table.Cell>sutask1</Table.Cell>
              <Table.Cell>5</Table.Cell>
              <Table.Cell>Not Generated</Table.Cell>
              <Table.Cell>Not Checked</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.RowHeaderCell>2</Table.RowHeaderCell>
              <Table.Cell>sutask2</Table.Cell>
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
        <Button m="6" size="4">
          Open Folder
        </Button>
      </Flex>
    </>
  );
};

export default Result;
