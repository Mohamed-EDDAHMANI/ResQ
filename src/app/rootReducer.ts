import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
// import authReducer from "../features/auth/authSlice";
// import usersReducer from "../features/users/usersSlice";

const rootReducer = combineReducers({
  user: userReducer,
//   auth: authReducer,
//   users: usersReducer,
});

export default rootReducer;
