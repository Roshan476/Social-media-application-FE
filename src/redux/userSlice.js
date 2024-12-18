import { createSlice } from "@reduxjs/toolkit"; // Importing the `createSlice` function to create a Redux slice.
import { user } from "../assets/data";

// Initial state for the user slice. This includes:
// - `user`: Fetched from localStorage or defaulting to an empty object.
// - `edit`: A boolean flag to track if the profile is in edit mode.
const initialState = {
    user: JSON.parse(window?.localStorage.getItem("user")) ?? user,
    edit: false,
};

// Creating the Redux slice for user-related state and actions.
const userSlice = createSlice({
    name: "user", // The name of the slice, used as the key in the Redux store.
    initialState, // The initial state of the slice.
    reducers: {
        // Reducer to handle user login.
        // `action.payload` contains the new user data to be stored.
        login(state, action) {
            state.user = action.payload; // Update the `user` state with the new user data.
            localStorage.setItem("user", JSON.stringify(action.payload)); // Save the user data to localStorage.
        },

        // Reducer to handle user logout.
        // This clears the user data and removes it from localStorage.
        logout(state) {
            state.user = null; // Clear the `user` state.
            localStorage?.removeItem("user"); // Remove the user data from localStorage.
        },

        // Reducer to handle toggling the profile edit state.
        // `action.payload` contains the new value for the `edit` state.
        updateProfile(state, action) {
            state.edit = action.payload; // Update the `edit` state.
        },
    },
});

export default userSlice.reducer; // Exporting the reducer so it can be added to the Redux store.

// An action creator for user login.
// `user` is the data to be logged in.
// `dispatch` is used to dispatch the `login` action created by `userSlice.actions.login`.
export function UserLogin(user) {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.login(user)); // Dispatch the login action with the user data.
    };
}

// An action creator for user logout.
// `dispatch` is used to dispatch the `logout` action created by `userSlice.actions.logout`.
export function Logout() {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.logout()); // Dispatch the logout action to clear user data.
    };
}
