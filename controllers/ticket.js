const Event =require("../models/event");
const Ticket =require("../models/tickets");
const Purchase=require('../models/purchased')
const createError=require("../utils/error");

module.exports.createTicket= async (req, res, next) => {
  const EventId= req.params.eventid;
  const newTicket= new Ticket(req.body);
  console.log(EventId,newTicket);

  try {
    newTicket.eventId=EventId;
    const savedTicket = await newTicket.save();
    try {
      await Event.findByIdAndUpdate(EventId, {
        $push: { tickettitle: savedTicket._id },
      });
      // await Event.findByIdAndUpdate(EventId, { tickettitle: savedTicket._id });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedTicket);
  } catch (err) {
    next(err);
  }
};
module.exports.updateTicketSale = async (req, res, next) => {
  try {
    const updatedTicket= await Ticket.findByIdAndUpdate(
      req.params.id,
      {ticketSale:req.body.ticketSale}
    );
    console.log(updatedTicket)
    res.status(200).json(updatedTicket);
  } catch (err) {
    next(err);
  }
};

module.exports.updateTicket = async (req, res, next) => {
  try {
    const updatedTicket= await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTicket);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTicket = async (req, res, next) => {
    const EventId= req.params.eventid;
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    try {
      await Event.findByIdAndUpdate(EventId, {
        $pull: { tickets: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Ticket  has been deleted.");
  } catch (err) {
    next(err);
  }
};

module.exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
};
module.exports.getTickets= async (req, res, next) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (err) {
    next(err);
  }
};
module.exports.purchaseTicket= async (req, res, next) => {
  try {
    const PurchaseInfo={
      eventId:req.body.eventId,
      ticketId:req.body.ticketId,
      quantity:req.body.ticket,
      purchaseDate:new Date(),
      userId:  req.body.userId,
      orderDetail:req.body.orderId
    }
    
    const TicketPurchaseInfo= new Purchase(PurchaseInfo);
    await TicketPurchaseInfo.save().then(()=>console.log("Ticket Booked"));
    try{

      const ticketInfo=await Ticket.findById(PurchaseInfo.ticketId);
      var RemainingTickets=ticketInfo.totalTickets-PurchaseInfo.quantity;


      await Ticket.findByIdAndUpdate(PurchaseInfo.ticketId,{totalTickets:RemainingTickets}).then(()=>{console.log("Updated")});
     
      console.log(TicketPurchaseInfo)
      res.status(200).json(TicketPurchaseInfo)
    
    }
    catch(err){
      next(err);
    }

    
  } catch (err) {
    next(err);
  }
};