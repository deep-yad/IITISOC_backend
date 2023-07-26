const express = require("express");
const mongoose = require("mongoose");



const TicketSchema =new mongoose.Schema({
    name:{
        type:String,
   
    },
    type: {
        type: String,
   
    },
    price:{
        type:Number,
     
        min:0,
    },
    date:{
        startDate: Date,
        endDate: Date,
        key: String
      },
    desc: {
        type: String,
      
    },
    totalTickets:{
        type:Number
    },
    remainingTickets:{
        type:Number
    },
    ticketNumber:{
        type:Number
    },
    ticketSale:{
        type:Boolean,
        default:true
    },eventId: {
        type: String,
   
    },



});

module.exports=mongoose.model("Ticket", TicketSchema)