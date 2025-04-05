const mongoose = require("mongoose");

mongoose.connect("Post your own link here").then(()=>{
    console.log("MongoDB Connected");
});
const UserSchema=mongoose.Schema({
    username:String,
    password:String,
    firstname:String,
    lastname:String,
});
const User=mongoose.model("Users",UserSchema);


const AccountSchema=mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    balance:{
        type: Number,
        required: true,
        default:0
    }})

const Account=mongoose.model("Accounts",AccountSchema);

const transferFunds = async (fromAccountId, toAccountId, amount) => {
    // Decrement the balance of the fromAccount
    await Account.findByIdAndUpdate(fromAccountId, { $inc: { balance: -amount } });

    // Increment the balance of the toAccount
    await Account.findByIdAndUpdate(toAccountId, { $inc: { balance: amount } });
}

module.exports= {User,Account,transferFunds};