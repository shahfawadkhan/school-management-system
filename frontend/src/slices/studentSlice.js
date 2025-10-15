import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllStudents } from "../api/studentApi";

const initialState = {
  allStudents: null,
  success: null,
  loading: false,
  error: null,
};

export const fetchAllStudents = createAsyncThunk(
  "students/fetchAllStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllStudents();
    console.log("API Response:", response.data); 
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error while fetching All Students"
      );
    }
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload || "Failed to fetch students";
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload?.message || "Fetched successfully";
      state.allStudents = action.payload.students || action.payload; // ✅ pick the array
    });

  },
});

export default studentSlice.reducer;
