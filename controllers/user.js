const Created= require('../models/sold.js');
const User=require('../models/user.js');
const Event =require('../models/event.js');
const Purchase=require('../models/purchased.js')
const Sold=require('../models/sold.js')
const Ticket=require('../models/tickets.js')



// EDIT User
module.exports.editUser= async (req,res,next)=>{
    
    try{
            const updatedUser=await User.findByIdAndUpdate(
                req.params.id, 
                { $set: req.body },
                { new: true }
              );
              console.log("edited")
              console.log(updatedUser)
              res.status(200).json(updatedUser);       
    }
    catch(err){
        next(err);
    }
};
// DELETE User
module.exports.deleteUser= async (req,res,next)=>{
  const ide=req.params.id;
  // const events=await Sold.find({userId:ide});
  // const fn =await Promise.all(events.map(event=>{
  //   Event.findByIdAndDelete(event.eventId);
  //   Ticket.deleteMany({eventId:event.eventId});
// }));
    try{
        await User.findByIdAndDelete(ide);
        // await Purchase.deleteMany({ userId:ide });
        // await Sold.deleteMany({ userId:ide});
        
     
    
        res.status(200).json("User has been deleted.");
    }
    catch(err){
        next(err);
    }

};

// GET User
module.exports.getUser= async (req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
      } catch (err) {
        next(err);
      }

};

module.exports.getUsers = async (req,res,next)=>{
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }



  module.exports.viewUserCreatedEvents = async (req,res,next)=>{
    try {
     
      // const users = await User.findById(userId);
      const details = await Created.find({userId:req.params.id}).populate('ticketId').populate('eventId').exec();
      console.log(details);
      console.log("hiii");
      const createdEvents=await Promise.all(details.map(detail=>{
   
          return Event.findById(detail.eventId._id)
        
      }));
      const uniqueEvents = [...new Set(createdEvents)];  //REMOVES DUPLICATES

      // console.log(event);
      console.log(uniqueEvents);
      console.log("problem")
      res.status(200).json(uniqueEvents);
    } catch (err) {
      next(err);
    }
  }

  module.exports.userCreatedEvent= async(req,res,next)=>{

    const usercreatedEvent = {
      eventId:req.body.eventId,
      ticketId:req.body.ticketId,
      userId:req.body.userId,
      soldDate:new Date(),
    }
  try{

    //  const ticketAlreadyMade=await Created.find({eventId:usercreatedEvent.eventId});
    //  console.log(ticketAlreadyMade)
    //  if(ticketAlreadyMade){
    //   return await Created.findByIdAndUpdate(ticketAlreadyMade._id,{
    //     $push: { ticketId: usercreatedEvent.ticketId },
    //   }).then(()=>{console.log("Updated")});
    //  }



    const savedCreatedEvent= new Created(usercreatedEvent);
    await savedCreatedEvent.save();
    console.log(savedCreatedEvent);
    res.status(200).json(savedCreatedEvent);

  }
  catch(error){
    next(error);
  }

}

module.exports.viewUserBookedEvents = async (req,res,next)=>{
  try {
    
    // const users = await User.findById(userId);
    const purchase = await Purchase.find({userId:req.params.id}).populate('eventId').populate('ticketId').populate('orderDetail').exec(); //exec Function is used to populate multiple fields here see in documentation
    // const events= await Promise.all(purchase.map((e)=>{
    //   return Event.findById(e.eventId);
    // })); 
    console.log(purchase);
    
   
    res.status(200).json(purchase);
  } catch (err) {
    next(err);
  }
}

module.exports.viewDetailsOfCreatedEvent=async (req,res,next)=>{
  try {
    
    
    const createdDetails = await Event.findById(req.params.id).populate({ 
     
     
        path: 'tickettitle',
     
      
   }); 
    // const eventDetails=createdDetails.eventId;
    console.log(createdDetails);
   
    res.status(200).json(createdDetails);
  } catch (err) {
    next(err);
  }
}

module.exports.getUserCount = async (req, res, next) => {

  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    next(error);
  }
}