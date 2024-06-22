const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/get-user/:userId", userController.getMe);
router.post("/verify/:verificationToken", userController.verificationMail);
router.post("/forgot-password/:vertificatonToken", userController.sendResetPasswordLink);
router.post("/edit-profile/:userId", userController.editUser);
router.post("/change-password/:token", userController.updatePassword);
router.post("/delete-account/:userId", userController.deleteUser);
module.exports = router