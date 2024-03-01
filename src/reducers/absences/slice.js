import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import performGetAbsence from "../../service/performGetAbsence";

const initialState = {
  values: [],
  status: "idle",
  error: null,
  conflict: false,
};

export const fetchAbsences = createAsyncThunk("getAbsence", async () => {
  try {
    return performGetAbsence();
  } catch (error) {
    return console.error(error);
  }
});

const absenceSlice = createSlice({
  name: "absence",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAbsences.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAbsences.fulfilled, (state, action) => {
      state.status = "succeded";
      state.values = action.payload;
    });
    builder.addCase(fetchAbsences.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message.toString();
    });
  },
  reducers: {
    setConflict(state, action) {
      state.conflict = action.payload;
    },
  },
});

//export the reducer to be allowed within a dispatch
export const { setConflict } = absenceSlice.actions;

export default absenceSlice.reducer;
