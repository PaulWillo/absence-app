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
        <TableCell data-cy={headers.details} aria-label={headers.details}>
          {headers.details}
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortedField === "employeeName"}
            direction={sortDirection}
            onClick={() => handleSort("employeeName")}
            data-cy={headers.employeeHeader}
            aria-label={headers.employeeHeader}
          >
            {headers.employeeHeader}
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortedField === "startDate"}
            direction={sortDirection}
            onClick={() => handleSort("startDate")}
            data-cy={headers.startDate}
            aria-label={headers.startDate}
          >
            {headers.startDate}
          </TableSortLabel>
        </TableCell>
        <TableCell data-cy={headers.endDate} aria-label={headers.endDate}>
          {headers.endDate}
        </TableCell>
        <TableCell data-cy={headers.approval} aria-label={headers.approval}>
          {headers.approval}
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortedField === "absenceType"}
            direction={sortDirection}
            onClick={() => handleSort("absenceType")}
            data-cy={headers.absenceType}
            aria-label={headers.absenceType}
          >
            {headers.absenceType}
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableHeaders;
