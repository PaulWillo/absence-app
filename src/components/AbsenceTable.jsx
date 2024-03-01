import React, { useState } from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";

const AbsenceTable = () => {
  const theme = useTheme();
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortedField, setSortedField] = useState("");

  const { values } = useSelector((state) => state.absences);

  console.log(values);

  const handleSort = (field) => {
    //check for strict equality on boolean result
    const isAsc = sortedField === field && sortDirection === "asc";
    //determine wether the current sorting order is true OR false
    setSortDirection(isAsc ? "desc" : "asc");

    setSortedField(field);
  };

  const sortByStartDate = (a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  };

  const formatAbsenceType = (absenceType) => {
    return absenceType.toLowerCase().replace(/_/g, " ");
  };

  const sortByAbsenceType = (a, b) => {
    const typeA = formatAbsenceType(a.absenceType);
    const typeB = formatAbsenceType(b.absenceType);
    return typeA.localeCompare(typeB);
  };

  const sortedValues = [...values].sort((a, b) => {
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

  const formatDate = (dateString) => {
    //ISO returns datetime/timezone info, split on the array in two parts after
    //timezone, take the first element in the array
    const dateParts = new Date(dateString)
      .toISOString()
      .split("T")[0]
      .split("-");
    //date come back YYYY/MM/DD, this is useless to a user, reverse join backwards
    return dateParts.reverse().join("/");
  };

  const calculateEndDate = (startDateString, days) => {
    //We dont care about how the startDate looks like when calculating the endDate
    const startDate = new Date(startDateString);

    //First, getTime() will return from the start of the universe (aka 1970 :) )
    //Second, we have an int of days specified that we need to check in milliseconds
    //Third, 24 hours in a day, 60 minutes in an hour, 60 seconds in a miniute, 1000 milliseconds in a second!!
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

    //Similar to the above, format on the first element in the array so that a human can read
    const formattedEndDate = endDate.toISOString().split("T")[0];

    //Same as the above again, we want readable strings that relate to the endDate
    const dateParts = formattedEndDate.split("-");

    //Join on the / for consistency
    return dateParts.reverse().join("/");
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortedField === "employeeName"}
                    direction={sortDirection}
                    onClick={() => handleSort("employeeName")}
                  >
                    Employee Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortedField === "startDate"}
                    direction={sortDirection}
                    onClick={() => handleSort("startDate")}
                  >
                    Start Date
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
                    Absence Type
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedValues.map((x) => (
                <TableRow>
                  <TableCell>{`${x.employee.firstName} ${x.employee.lastName}`}</TableCell>
                  <TableCell>{formatDate(x.startDate)}</TableCell>
                  <TableCell>{calculateEndDate(x.startDate, x.days)}</TableCell>
                  <TableCell align="center">
                    {x.approved ? (
                      <CheckCircleIcon
                        style={{ color: theme.palette.success.main }}
                      />
                    ) : (
                      <CancelIcon style={{ color: theme.palette.error.main }} />
                    )}
                  </TableCell>
                  <TableCell>{formatAbsenceType(x.absenceType)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default AbsenceTable;
