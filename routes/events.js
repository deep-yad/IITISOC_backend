const express=require("express");
const {searchOrders,getOrders,getEvents, countByCountry,createEvent, deleteEvent, editEvent, getEvent, LandingPageEvent, BookTicket, CreatedEvent, ConfirmationMail , EventsbyType, EventsbyCountry, getOrganizer} = require("../controllers/events");
const Event=require("../models/event.js")
const router=express.Router();
const {verifyToken, verifyUser, verifyAdmin, verifyMajorAdmin}= require("../utils/verifyToken");

router.get("/find/:id",getEvent);

router.get("/organizer/:id",getOrganizer);

router.post("/",verifyAdmin, createEvent);

// router.put("/:id",verifyUser, editEvent);

router.delete("/:id", verifyMajorAdmin,deleteEvent);

router.get("/countbycountries",countByCountry);

router.get('/genre/:type',EventsbyType);

router.get("/location/:country",EventsbyCountry);

router.get("/online",LandingPageEvent);

router.post("/sendconfirmation",ConfirmationMail);

router.get("/",getEvents);

router.get("/orders/search",searchOrders);

router.get("/orders/:id",verifyUser, getOrders);

router.get("/ticket/:id",verifyUser, BookTicket);



module.exports=router;
