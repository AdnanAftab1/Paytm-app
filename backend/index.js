const express = require("express");
const cors = require("cors");
const {User,Account}= require("./db");
const zod=require("zod");
const authmiddleware  = require("./middleware");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const JWTSIGN="ILUVEXPRESS"

const signupBody = zod.object({
    username: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
})
const signinBody = zod.object({
    username: zod.string(),
    password: zod.string()
})
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})
const app=express();
app.use(cors());
app.use(express.json());


app.post("/signin",async (req,res)=>{
    const {success}=signinBody.safeParse(req.body);
    console.log(req.body);
    console.log(success);
    if(success){
        const finder = await User.findOne(
            {
            username: req.body.username,
            password:req.body.password
        });
        console.log(finder);
        if(finder){
            res.status(200).send({token:jwt.sign({
                    userId: finder._id
                },JWTSIGN)});
        }else{
            res.status(404).send({message:"User not found"});
        }
    }else{
        console.log(req.body);
        res.status(404).send({message:"Invalid Input"});
    }
})

app.post("/signup",async (req,res)=>{
    const body=req.body;
    console.log("finder");

    const {success}=signupBody.safeParse(body);
    console.log(success)
    if(success){
        const finder=await User.findOne({username: req.body.username});
            if(finder!==null){
                console.log(finder);
                res.status(404).send({message:"User already exist"});
            }
             else{
                console.log(finder);

                const done= await User.create({
                username:body.username,
                password:body.password,
                firstname:body.firstname,
                lastname:body.lastname,
            })
                Account.create({
                    userId:done._id,
                    balance:200,
                })
            res.status(200).send({token:jwt.sign({
                    userId: done._id
                },JWTSIGN)});
        }
    }
    else{
        console.log("finder2");
        res.status(400).send({message:"Invalid Input"});
    }
})

app.get("/bulk",async (req,res)=>{
    const filter=req.query.filter || "";

    const users=await User.find({

            username:{
                $ne:filter
            }
    });
    res.json({
        users:users.map(user=>({
            user__id:user._id,
            username:user.username,
            password:user.password,
            firstname:user.firstname,
            lastname:user.lastname

        }))
    });
})

app.get("/balance",authmiddleware,async (req,res)=>{
    const account=await Account.findOne({
        userId:req.userId.userId
    });
    const user=await User.findOne({
        _id:req.userId.userId
    });

    console.log(user);

    res.status(200).send(
        {
            userId:user._id,
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            balance:account.balance
        }
    )
})

app.get("/update",authmiddleware,async (req,res)=>{
    const {success}=updateBody.safeParse(req.body);
    if(!success){
        return res.status(400).send({message:"Failure to comply"})
    }
        const used=await User.updateOne({
        _id:req.userId.userId
    },req.body)

    console.log(used);
    res.json({message:"Successfully Updated"})
})

app.post("/transfer",authmiddleware,async (req,res)=>{
    const sessioner=await mongoose.startSession();
    const {amount,to}=req.body;
    sessioner.startTransaction();
    const Myaccount=await Account.findOne({userId:req.userId.userId}).session(sessioner);
    console.log(Myaccount)
    if(!Myaccount || Myaccount.balance<amount){
        await sessioner.abortTransaction();
        return res.status(403).send({message:`Not Found || Amount:${Myaccount.balance}`});
    }
    const Hisaccount=await Account.findOne({userId:to}).session(sessioner);
    console.log(Hisaccount);
    if(!Hisaccount){
        await sessioner.abortTransaction();
        return res.status(403).send({message:`Not Found`});
    }


    const MT=await Account.updateOne({userId:req.userId.userId},{ $inc: { balance: -amount } }).session(sessioner);
    const HT=await Account.updateOne({userId:to},{ $inc: { balance: amount } }).session(sessioner);

    console.log(MT);
    console.log(HT);
    await sessioner.commitTransaction();


    res.send({message:"Successfully transferred"})
})

app.listen(3000,()=>{
    console.log("Server started on port 3000");
})



