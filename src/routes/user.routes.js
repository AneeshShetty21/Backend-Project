import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router=Router()

router.post(
    "/register",
    (req, res, next) => {
        console.log("Before multer");
        next();
    },

    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),

    (req, res, next) => {
        console.log("After multer");
        console.log("Body:", req.body);
        console.log("Files:", req.files);
        next();
    },

    registerUser
);

export default router;