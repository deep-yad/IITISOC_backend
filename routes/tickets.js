const express=require("express");
const {purchaseTicket,createTicket, updateTicket, deleteTicket, getTicket, getTickets,updateTicketSale}=require("../controllers/ticket");
const {verifyToken, verifyUser}= require("../utils/verifyToken");



const router = express.Router();

router.post("/ticketsale/:id", updateTicketSale);
//CREATE
router.post("/:eventid",verifyUser, createTicket);

//UPDATE


router.put("/:id",verifyUser, updateTicket);
//DELETE
router.delete("/:id/:eventid",verifyUser, deleteTicket);
//GET

router.get("/:id", getTicket);
//GET ALL

router.get("/", getTickets);

router.post("/purchase/:eventId/:ticketId", purchaseTicket);



module.exports=router;
