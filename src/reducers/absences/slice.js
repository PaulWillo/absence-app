import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import performGetAbsence from '../../service/performGetAbsence';

const initialState = {
    values: [],
    status: 'idle',
    error: null,
};

export const fetchAbsences = createAsyncThunk('getAbsence', async () => {
    try {
        return performGetAbsence();
    } catch(error) {
        return console.error(error);
    }
})

const absenceSlice = createSlice({
    name: 'absence',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchAbsences.pending, (state) => {
            state.status = 'loading';
        })
        builder.addCase(fetchAbsences.fulfilled, (state, action) => {
            state.status = 'succeded';
            state.values = action.payload;
        })
        builder.addCase(fetchAbsences.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message.toString();
        })
    },
});

export default absenceSlice.reducer;