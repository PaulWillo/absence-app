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
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";
import { ExpandMore } from "@mui/icons-material";

const AbsenceTable = () => {
  const theme = useTheme();
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortedField, setSortedField] = useState("");
  const [expandedRow, setExpandedRow] = useState(false);

  const { values } = useSelector((state) => state.absences);

  const removeDuplicateNames = (data) => {
    const uniqueNames = {}; // Object to keep track of unique names

    // Iterate through the dataset
    data.forEach((entry) => {
      const { firstName, lastName } = entry.employee;
      const fullName = `${firstName} ${lastName}`;

      // If the name is not already in uniqueNames, add it and keep the entry as is
      if (!uniqueNames[fullName]) {
        uniqueNames[fullName] = { ...entry }; // Clone the entry object
      } else {
        // If the name already exists, store the start date of the removed object
        if (!uniqueNames[fullName].multipleStartDates) {
          uniqueNames[fullName].multipleStartDates = [
            uniqueNames[fullName].startDate,
          ];
        }
        if (!uniqueNames[fullName].multipleDays) {
          uniqueNames[fullName].multipleDays = [uniqueNames[fullName].days];
        }
        uniqueNames[fullName].multipleStartDates.push(entry.startDate);
        uniqueNames[fullName].multipleDays.push(entry.days);

        // Merge the data into the existing entry
        Object.keys(entry).forEach((key) => {
          // Skip employee key as it should not be overridden
          if (key !== "employee") {
            // Copy data from the entry to the existing uniqueNames entry
            uniqueNames[fullName][key] = entry[key];
          }
        });
      }
    });

    // Convert uniqueNames object back to an array
    const newData = Object.values(uniqueNames);

    return newData;
  };

  const newData = removeDuplicateNames(values);

  const handleSort = (field) => {
    //check for strict equality on boolean result
    const isAsc = sortedField === field && sortDirection === "asc";
    //determine wether the current sorting order is true OR false
    setSortDirection(isAsc ? "desc" : "asc");

    setSortedField(field);
  };

  const handleRowClick = (index, id) => {
    if (id === undefined) {
      setExpandedRow(false);
    } else {
      setExpandedRow(expandedRow === index ? false : index);
    }
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

  const getMultipleStartDates = (multipleStartDates) => {
    if (!multipleStartDates) {
      return []; // Bail out if multipleStartDates doesn't exist or is not an array
    }

    return multipleStartDates.map((dateTimeString) => {
      const datePart = dateTimeString.split("T")[0]; // Extracting only the date part
      return datePart.split("-").reverse().join("/"); // Splitting, reversing, and joining the date parts
    });
  };

  const addDaysToDate = (startDate, days) => {
    const startDateObj = new Date(startDate);
    const endDate = new Date(
      startDateObj.getTime() + days * 24 * 60 * 60 * 1000
    );

    const dd = String(endDate.getDate()).padStart(2, "0");
    const mm = String(endDate.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = endDate.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  };

  const calculateFutureDates = (startDates, daysArray) => {
    const futureDates = startDates.map((startDate, index) => {
      // Check if startDate and daysArray[index] are defined
      if (startDate && daysArray[index]) {
        return addDaysToDate(startDate, daysArray[index]);
      } else {
        return "Employee returns on the same day";
      }
    });
    return futureDates;
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Expand Employee Details</TableCell>
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
              {sortedValues.map((x, index) => (
                <>
                  <TableRow
                    onClick={() => handleRowClick(index, x.multipleStartDates)}
                  >
                    <TableCell>
                      {x.multipleStartDates ? (
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
                    <TableCell>{`${x.employee.firstName} ${x.employee.lastName}`}</TableCell>
                    <TableCell>{formatDate(x.startDate)}</TableCell>
                    <TableCell>
                      {calculateEndDate(x.startDate, x.days)}
                    </TableCell>
                    <TableCell align="center">
                      {x.approved ? (
                        <CheckCircleIcon
                          style={{ color: theme.palette.success.main }}
                        />
                      ) : (
                        <CancelIcon
                          style={{ color: theme.palette.error.main }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatAbsenceType(x.absenceType)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={expandedRow === index}
                        timeout="auto"
                        unmountOnExit
                      >
                        <TableContainer component={Paper}>
                          <Table size="small" aria-label="multiple-start-dates">
                            <TableHead>
                              <TableRow>
                                <TableCell>Absence Start Dates</TableCell>
                                <TableCell>Absence End Dates</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {getMultipleStartDates(x.multipleStartDates).map(
                                (startDate, i) => (
                                  //this is a bit of a mess, I have to iterate through the above to map values correctly
                                  //if I could turn back the clock a few hours I would of loaded the data better in redux (cleanse it on load)
                                  <TableRow key={i}>
                                    <TableCell>{startDate}</TableCell>
                                    <TableCell>
                                      {
                                        calculateFutureDates(
                                          x.multipleStartDates,
                                          x.multipleDays
                                        )[i]
                                      }
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Collapse>
                    </TableCell>
                  </TableRow>
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
