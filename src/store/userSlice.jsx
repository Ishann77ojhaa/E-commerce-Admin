import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../globals/misc/statuses";
import { APIAuthenticated } from "../globals/http";

const initialState = {
  users: [],
  selectedUser: null,
  status: STATUSES.IDLE,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },

    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },

    setStatus(state, action) {
      state.status = action.payload;
    },

    removeUser(state, action) {
      state.users = state.users.filter(
        (user) => user._id !== action.payload
      );
    },

    clearUsers(state) {
      state.users = [];
    },
  },
});

export const {
  setUsers,
  setSelectedUser,
  setStatus,
  removeUser,
  clearUsers,
} = userSlice.actions;


// =========================================
// GET ALL USERS
// =========================================

export function getAllUsers() {
  return async function getAllUsersThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await APIAuthenticated.get("/admin/users");

      dispatch(setUsers(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));

    } catch (error) {
      console.log(
        "GET USERS ERROR:",
        error.response?.data || error.message
      );

      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}


// =========================================
// GET SINGLE USER
// =========================================

export function getUserById(id) {
  return async function getUserByIdThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await APIAuthenticated.get(
        `/admin/users/${id}`
      );

      dispatch(setSelectedUser(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));

      return true;

    } catch (error) {
      console.log(
        "GET USER ERROR:",
        error.response?.data || error.message
      );

      dispatch(setStatus(STATUSES.ERROR));

      return false;
    }
  };
}


// =========================================
// DELETE USER
// =========================================

export function deleteUser(id) {
  return async function deleteUserThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));

    try {
      await APIAuthenticated.delete(
        `/admin/users/${id}`
      );

      dispatch(removeUser(id));
      dispatch(setStatus(STATUSES.SUCCESS));

      return true;

    } catch (error) {
      console.log(
        "DELETE USER ERROR:",
        error.response?.data || error.message
      );

      dispatch(setStatus(STATUSES.ERROR));

      return false;
    }
  };
}


export default userSlice.reducer;