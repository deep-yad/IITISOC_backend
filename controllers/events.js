const Event=require('../models/event.js');
const Ticket=require('../models/tickets.js');
const Order=require('../models/order.js');
const Purchase =require("../models/purchased.js");
const User =require("../models/user.js");
const CreatedEvent= require("../models/sold.js");
const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const Sold = require('../models/sold.js');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword'
    }
  });

// CREATE EVENT

module.exports.createEvent= async (req,res,next)=>{

   
    const newEvent= new Event(req.body);
    try{
        const savedEvent = await newEvent.save();
        
        console.log(savedEvent);
        res.status(200).json(savedEvent);
    }
    catch(err){
        next(err);
    }
};

// EDIT EVENT
module.exports.editEvent= async (req,res,next)=>{
    
    try{
            const updatedEvent=await Event.findByIdAndUpdate(
                req.params.id, 
                { $set: req.body },
                { new: true }
              );
              res.status(200).json(updatedEvent);       
    }
    catch(err){
        next(err);
    }
};
// DELETE EVENT
module.exports.deleteEvent= async (req,res,next)=>{
    const ide=req.params.id;
    try{
        await Event.findByIdAndDelete(ide);
        // await Ticket.deleteMany({eventId:ide});
        // await Sold.deleteMany({eventId:ide});
        // await Purchase.deleteMany({eventId:ide});
        res.status(200).json("Event has been deleted.");
    }
    catch(err){
        next(err);
    }

};
// GET EVENT
module.exports.getEvent= async (req,res,next)=>{
    try {
        const event = await Event.findById(req.params.id).populate('tickettitle');
        res.status(200).json(event);
      } catch (err){
        next(err)
      }
};

module.exports.getOrganizer= async (req,res,next)=>{
  try {
      const event = await CreatedEvent.findOne({eventId:req.params.id});
      const organizer=await User.findById(event.userId)
      console.log(event)
      console.log(organizer)
      res.status(200).json(organizer);
    } catch (err){
      next(err)
    }
};

module.exports.getEvents = async (req,res,next)=>{
    const {type,location,name}=req.query;  //To segregate min and max and others
   
       try{
        let query = {};
        if (location && type && name) {
          query.city = { $regex: new RegExp(`^${location}$`, 'i') };
          query.type ={ $regex: new RegExp(`^${type}$`, 'i') };
          query.name = { $regex: new RegExp(`^${name}$`, 'i') };
          const events = await Event.find(query).limit(req.query.limit);
          console.log(events)
          return   res.status(200).json(events); 
        }
        if (location && name) {
          query.city = { $regex: new RegExp(`^${location}$`, 'i') };
          query.name = { $regex: new RegExp(`^${name}$`, 'i') };
          const events = await Event.find(query).limit(req.query.limit);
          console.log(events)
          return   res.status(200).json(events); 
        }
        if (name && type) {
          query.name = { $regex: new RegExp(`^${name}$`, 'i') };
          query.type = { $regex: new RegExp(`^${type}$`, 'i') };
          const events = await Event.find(query).limit(req.query.limit);
          console.log(events)
          return   res.status(200).json(events); 
        }

        if (location && type) {
          query.city ={ $regex: new RegExp(`^${city}$`, 'i') };
          query.type ={ $regex: new RegExp(`^${type}$`, 'i') };
          const events = await Event.find(query).limit(req.query.limit);
          console.log(events)
          return   res.status(200).json(events); 
        }

        if (type) {
          query.type = { $regex: new RegExp(`^${type}$`, 'i') }
          const events = await Event.find(query).limit(req.query.limit);
          console.log(events)
            return res.status(200).json(events); 
        }
    
        if (location) {
          query.city = { $regex: new RegExp(`^${location}$`, 'i') };
          const events = await Event.find(query).limit(req.query.limit);
          console.log(events)
          return   res.status(200).json(events); 
        }

        if (name) {
          query.name = { $regex: new RegExp(`^${name}$`, 'i') };
          const events = await Event.find(query).limit(req.query.limit);
          console.log(events)
          return   res.status(200).json(events); 
        }
   
        const events=await Event.find().limit(req.query.limit);
        return   res.status(200).json(events); 
       
          
        
        
      
      
       }
       catch(err){
           next(err);
      }
}

module.exports.countByCountry= async (req,res,next)=>{
    
     try {
        const countries=req.query.country.split(",")
        const list =await Promise.all(countries.map(country=>{
             return Event.countDocuments({country:country});
        }));
        console.log(list);
        res.status(200).json(list);
     }
     catch(err){
        next(err);
     }
};

module.exports.LandingPageEvent= async (req,res,next)=>{
    
    try {
       const event= await Event.find(req.query)
       res.status(200).json(event);
    }
    catch(err){
       next(err);
    }
};

module.exports.BookTicket= async (req,res,next)=>{
    const event=await Event.findById(req.params.id)
    try {
        const ticketTitleId= event.tickettitle;
        
        const list= await Promise.all(ticketTitleId.map(element=>{
             return  Ticket.findById(element);
        }))
        console.log(ticketTitleId);
        console.log(list);
        // console.log(event);
        res.status(200).json(list);
       
    }
    catch(err){
       next(err);
    }
};


module.exports.EventsbyType= async (req,res, next)=>{
  const { type } = req.params;
  

  try {
    const typeEvent= { $regex: new RegExp(`^${type}$`, 'i') };
    const events = await Event.find({ type: typeEvent});
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
}


module.exports.EventsbyCountry=async(req,res, next)=>{
  const { country } = req.params;

  
  try {
   const countryType= { $regex: new RegExp(`^${country}$`, 'i') }
    const events = await Event.find({ country: countryType});
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }


}

module.exports.getOrders=async(req,res, next)=>{
  const orders = await Purchase.find({eventId:req.params.id}).populate('orderDetail').populate('ticketId').populate('userId').exec();

  
  try {
   console.log(orders)
   res.status(200).json(orders);

  } catch (error) {
    next(error);
  }
}

module.exports.searchOrders=async(req,res, next)=>{
  const {orderId,paymentId} = req.query;
  console.log(req.query)
  let query={};
  
  try {
    if(orderId && paymentId){
      query.paymentId=paymentId;
      const searchOrder=await Order.find({razorpay:query});
      return res.status(200).json(searchOrder);
     }
     if(orderId){
      query.orderId=orderId;
      const searchOrder=await Order.find({razorpay:query});
      return res.status(200).json(searchOrder);
     }
     if(paymentId){
      query.paymentId=paymentId;
      const searchOrder=await Order.find({razorpay:query});
      return res.status(200).json(searchOrder);
     }
    


  //  console.log(searchOrder)


  } catch (error) {
    next(error);
  }
}

module.exports.ConfirmationMail = async (req, res) => {

  const { userId, purchaseId } = req.body;
  const user = await User.findById(userId);
  const purchase = await Purchase.findById(purchaseId).populate('orderDetail');
  console.log(purchase)
  const event = await Event.findById(purchase.eventId);
  const ticket = await Ticket.findById(purchase.ticketId);
  const created = await CreatedEvent.findOne({eventId:purchase.eventId})
  const organizer=await User.findById(created.userId)
  console.log("EMAIL")
  console.log(user.email)

  // const event= await  Event.findById(eventId);
  // const eventUserId= event.userId;
  // const sender=await User.findById(eventUserId);
  // const senderMail= sender.email;
  const userEmail = user.email;
  // const userName =user.name;
  // const eventname =event.name;




  let config = {
    service: 'gmail',
    auth: {
      user: 'eventticketing.team@gmail.com',
      pass: 'whlviiqznhpebwxj'
    }
  }
  let transporter = nodemailer.createTransport(config);
          const qrCodeText = `
          PaymentId: ${purchase.orderDetail.razorpay.paymentId},
          OrderId: ${purchase.orderDetail.razorpay.orderId}
          Name :${user.firstname} ${user.lastname}\n
          email : ${user.email}
          Ticket Type: ${ticket.type}\n
          Amount : Rs ${purchase.orderDetail.amount}
          Quantity: ${purchase.quantity}\n,`;
        const qrCodeOptions = {
          errorCorrectionLevel: 'H',
          type: 'png',
          quality: 0.9,
          margin: 1,
        };
  
        qrcode.toDataURL(qrCodeText, qrCodeOptions, (error, qrCodeDataUri) => {
                    if (error) {
                      console.error(error);
                      res.status(500).json({ message: 'Failed to generate QR code' });
                      return;
                    }


  let mailOptions = {
    from: organizer.email,
    to: userEmail,
    subject: 'Event Booking Confirmation',
    text: `Dear ${user.firstname},
    Thank you for booking your ticket for ${event.name}. We are pleased to inform you that your ticket has been successfully generated. Please find the details below:
    Organizer : ${organizer.email} , ${organizer.contactNo}
    Date: ${event.date.startDate} to ${event.date.endDate}
    Location: ${event.address},${event.city}
    Best Regards
  `,
    attachments: [
      {
        filename: 'qrcode.png',
        content: qrCodeDataUri.split(';base64,').pop(),
        encoding: 'base64',
      },
    ],
  };

  transporter.sendMail(mailOptions).then(() => { console.log("MAIL SEND SUCCESFULLY") })




})}