import express from "express";
const router = express.Router();

import { signin, signup,googleSignUp,updateProfile } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/googleSignUp", googleSignUp);
router.put("/update", updateProfile);

export default router;