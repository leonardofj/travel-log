import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { Table } from "@tanstack/react-table";
import { CityTable } from "../routes/Cities";

interface PaginationProps {
  table: Table<CityTable>;
}

const Pagination = ({ table }: PaginationProps) => {
  const pageIndex = table.getState().pagination.pageIndex;
  const totalRows = table.getRowCount();
  const pageSize = table.getState().pagination.pageSize;

  // Calculate the range of displayed results
  const firstResult = pageIndex * pageSize + 1;
  const lastResult = Math.min(pageIndex * pageSize + pageSize, totalRows);

  // Create the pagination summary string
  const paginationSummary =
    totalRows === 0
      ? "No results"
      : `${firstResult}-${lastResult} of ${totalRows} results`;

  return (
    <Box>
      <Flex my={2} alignItems={"center"}>
        <Button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
        <Button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
        <Text fontWeight={"bold"} mx={4}>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount().toLocaleString()}
        </Text>

        <Spacer />
        <Text fontWeight={"bold"}>{paginationSummary}</Text>
      </Flex>
    </Box>
  );
};

export default Pagination;
