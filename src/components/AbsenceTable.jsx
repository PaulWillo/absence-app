import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";
import { ExpandMore } from "@mui/icons-material";
import performGetConflicts from "../service/performGetConflicts";
import { setConflict } from "../reducers/absences/slice";
import {
  calculateEndDate,
  formatAbsenceType,
  formatDate,
  removeDuplicateNames,
  sortByAbsenceType,
  sortByStartDate,
} from "../service/utils";
import ExpandedTable from "./ExpandedTable";
import TableHeaders from "./TableHeaders";

const AbsenceTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [sortDirection, setSortDirection] = useState("asc");
  const [sortedField, setSortedField] = useState("");
  const [expandedRow, setExpandedRow] = useState(false);

  const { values } = useSelector((state) => state.absences);
  const findConflict = useSelector((state) => state.absences.conflict);

  const newData = removeDuplicateNames(values);

  const handleSort = (field) => {
    //check for strict equality on boolean result
    const isAsc = sortedField === field && sortDirection === "asc";
    //determine wether the current sorting order is true OR false
    setSortDirection(isAsc ? "desc" : "asc");

    setSortedField(field);
  };

  const handleRowClick = async (index, id, employeeId) => {
    const conflictResponse = await performGetConflicts(employeeId);

    //deconstruct the returned object
    dispatch(setConflict(conflictResponse.conflicts));

    if (id === undefined) {
      setExpandedRow(false);
    } else {
      setExpandedRow(expandedRow === index ? false : index);
    }
  };

  const sortedValues = [...newData].sort((a, b) => {
    const nameA = `${a.employee.firstName} ${a.employee.lastName}`;
    const nameB = `${b.employee.firstName} ${b.employee.lastName}`;

    // Sort by employee names if sortedField is not specified or is "employeeName"
    if (!sortedField || sortedField === "employeeName") {
      return sortDirection === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }

    // Sort by startDate if sortedField is "startDate"
    if (sortedField === "startDate") {
      return sortDirection === "asc"
        ? sortByStartDate(a, b)
        : sortByStartDate(b, a);
    }

    if (sortedField === "absenceType") {
      return sortDirection === "asc"
        ? sortByAbsenceType(a, b)
        : sortByAbsenceType(b, a);
    }

    // No sorting for other fields
    return 0;
  });

  return (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <TableContainer component={Paper}>
          <Table>
            <TableHeaders
              handleSort={handleSort}
              sortedField={sortedField}
              sortDirection={sortDirection}
            />
            <TableBody>
              {sortedValues.map((data, index) => (
                <>
                  <TableRow
                    onClick={() =>
                      handleRowClick(index, data.multipleStartDates, data.id)
                    }
                  >
                    <TableCell>
                      {data.multipleStartDates ? (
                        <ExpandMore
                          style={{
                            transform:
                              expandedRow === index
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        />
                      ) : null}
                    </TableCell>
                    <TableCell>{`${data.employee.firstName} ${data.employee.lastName}`}</TableCell>
                    <TableCell>{formatDate(data.startDate)}</TableCell>
                    <TableCell>
                      {calculateEndDate(data.startDate, data.days)}
                    </TableCell>
                    <TableCell align="center">
                      {data.approved ? (
                        <CheckCircleIcon
                          style={{ color: theme.palette.success.main }}
                        />
                      ) : (
                        <CancelIcon
                          style={{ color: theme.palette.error.main }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatAbsenceType(data.absenceType)}</TableCell>
                  </TableRow>
                  <ExpandedTable
                    expandedRow={expandedRow}
                    index={index}
                    data={data}
                    findConflict={findConflict}
                  />
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default AbsenceTable;
