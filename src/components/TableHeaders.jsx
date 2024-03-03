import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import { useContext } from "react";
import { Language } from "./Context";

const TableHeaders = ({ handleSort, sortedField, sortDirection }) => {
  const language = useContext(Language);
  const headers = language.tableHeaders.employeeHeaders;
  return (
    <TableHead>
      <TableRow>
        <TableCell>{headers.details}</TableCell>
        <TableCell>
          <TableSortLabel
            active={sortedField === "employeeName"}
            direction={sortDirection}
            onClick={() => handleSort("employeeName")}
          >
            {headers.employeeHeader}
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortedField === "startDate"}
            direction={sortDirection}
            onClick={() => handleSort("startDate")}
          >
            {headers.startDate}
          </TableSortLabel>
        </TableCell>
        <TableCell>End Date</TableCell>
        <TableCell>Approval</TableCell>
        <TableCell>
          <TableSortLabel
            active={sortedField === "absenceType"}
            direction={sortDirection}
            onClick={() => handleSort("absenceType")}
          >
            {headers.absenceType}
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableHeaders;
