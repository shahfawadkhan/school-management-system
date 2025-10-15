import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import studentReducer from "./slices/studentSlice.js"
const store = configureStore({
    reducer : {
        auth : authReducer,
        students : studentReducer
    }
})

export default store;