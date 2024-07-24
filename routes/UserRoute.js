import express from "express";
import {
    DeleteUser,
     ForgotPassword,
     GetAllUsers,
     GetAUser,
    GetUserDetails,
    LoginUser,
     LogoutUser,
     RegisterUser,
     ResetPassword,
     UpdatePassword,
     UpdateProfile,
     UpdateUserRole,
} from "../controllers/UserControler.js";
import { AuthorizeRoles, isAuthenticatedUser } from "../middleware/Auth.js";

const router = express.Router();

 router.route("/register").post(RegisterUser);
router.route("/login").post(LoginUser);
 router.route("/password/forgot").post(ForgotPassword);
 router.route("/password/update").put(isAuthenticatedUser, UpdatePassword);
 router.route("/password/reset/:token").put(ResetPassword);
router.route("/me").get(isAuthenticatedUser, GetUserDetails);
 router.route("/me/update").put(isAuthenticatedUser, UpdateProfile);
 router.route("/logout").get(LogoutUser);
 router
     .route("/admin/users")
     .get(isAuthenticatedUser, AuthorizeRoles("admin"), GetAllUsers);
 router
     .route("/admin/user/:id")
     .get(isAuthenticatedUser, AuthorizeRoles("admin"), GetAUser)
     .put(isAuthenticatedUser, AuthorizeRoles("admin"), UpdateUserRole)
     .delete(isAuthenticatedUser, AuthorizeRoles("admin"), DeleteUser);

export default router;
