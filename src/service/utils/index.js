//Util file including all used functions

/**
 * Data: object
 * Returns: return a cleansed object with multipleStartDates, multipleDays.
 */
export const removeDuplicateNames = (data) => {
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

export const sortByStartDate = (a, b) => {
  return new Date(a.startDate) - new Date(b.startDate);
};

export const formatAbsenceType = (absenceType) => {
  //replace any _ or uppercase values
  return absenceType.toLowerCase().replace(/_/g, " ");
};

export const sortByAbsenceType = (a, b) => {
  const typeA = formatAbsenceType(a.absenceType);
  const typeB = formatAbsenceType(b.absenceType);
  return typeA.localeCompare(typeB);
};

export const formatDate = (dateString) => {
  //ISO returns datetime/timezone info, split on the array in two parts after
  //timezone, take the first element in the array
  const dateParts = new Date(dateString).toISOString().split("T")[0].split("-");
  //date come back YYYY/MM/DD, this is useless to a user, reverse join backwards
  return dateParts.reverse().join("/");
};

export const calculateEndDate = (startDateString, days) => {
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

export const getMultipleStartDates = (multipleStartDates) => {
  if (!multipleStartDates) {
    return []; // Bail out if multipleStartDates doesn't exist or is not an array
  }

  return multipleStartDates.map((dateTimeString) => {
    const datePart = dateTimeString.split("T")[0]; // Extracting only the date part
    return datePart.split("-").reverse().join("/"); // Splitting, reversing, and joining the date parts
  });
};

export const addDaysToDate = (startDate, days) => {
  const startDateObj = new Date(startDate);
  const endDate = new Date(startDateObj.getTime() + days * 24 * 60 * 60 * 1000);

  //using this for minimum lengths on the dates
  const dd = String(endDate.getDate()).padStart(2, "0");
  const mm = String(endDate.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = endDate.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

export const calculateFutureDates = (startDates, daysArray) => {
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
