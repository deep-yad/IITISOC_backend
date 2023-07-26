const express=require("express");
const {viewDetailsOfCreatedEvent,viewUserCreatedEvents, viewUserBookedEvents, userCreatedEvent,createUser, deleteUser, editUser, getUser, getUsers ,getUserCount} = require("../controllers/user");
const User=require("../models/user.js")
const router=express.Router();
const {verifyToken, verifyAdmin, verifyUser, verifyMajorAdmin}= require("../utils/verifyToken");

router.get("/:id",verifyUser, getUser);

router.get("/",verifyMajorAdmin, getUsers);

//router.get("/count" , getUserCount);

router.get("/events/created/:id", viewUserCreatedEvents);

router.get("/events/booked/:id", viewUserBookedEvents);

router.get("/admin/events/created/:id",verifyMajorAdmin, viewUserCreatedEvents);

router.get("/admin/events/booked/:id",verifyMajorAdmin, viewUserBookedEvents);

router.put("/:id",verifyUser, editUser);

router.delete("/:id",verifyMajorAdmin, deleteUser);

router.post("/event",verifyUser, userCreatedEvent);

router.get("/events/details/booked/:id",verifyUser, viewDetailsOfCreatedEvent);



module.exports=router;
