import  '../App.css';
import  CircleIcon from "./Other.jsx";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import axios from "axios";

export default function TransferPage(){
    const tok=localStorage.getItem("token");
    const recieved = localStorage.getItem("receiver");
    console.log("Reciever:",recieved);

    const [Name,setName] = useState("");
    const [reciever,setReciever] = useState("");
    const [token,setToken] = useState(tok ||  "");
    const amount=useRef(0);
    const navigate=useNavigate();


    useEffect( () => {
        const fetchData = async () => {
            setToken(tok);
            setReciever(recieved);
            console.log("Token:",token);

            if(!token){
                alert("You are not logged in");
                navigate("/")
            }
            const response =await axios("http://localhost:3000/balance",{
                headers:{"Authorization":`Bearer ${token}`}
            })
            const res=response.data;
            console.log("Response:",res);
            setName(res.firstname + " " + res.lastname);
        }
        fetchData();
    },[])

    const handleClick=async ()=>{
        console.log("Sending "+Number(amount.current.value)+ " to",reciever);
        axios.post("http://localhost:3000/transfer",{amount:Number(amount.current.value),to:reciever},{
            method:"POST",
            headers:{"Authorization":`Bearer ${token}`}
        })
        navigate("/Dashboard");

    }
    return (
        <div className="bg-white rounded-xl drop-shadow-lg">
            <p className="mt-2 mb-8 flex justify-center font-bold text-3xl w-full">Send Money</p>
            <div className="m-6">
                <div className="flex ">
                    <CircleIcon Color="bg-green-500" TextColor="text-white" Char={Name.charAt(0)}/>
                    <p className="font-semibold text-2xl m-2 leading-4">{Name}</p>
                </div>
                <p className="font-semibold text-sm">Amount (in Rs)</p>
                <input ref={amount} type={"text"} className="w-full border-solid border-2 border-gray-200 rounded-[4px] mt-1"
                       placeholder="Enter amount"/>
                <button type={"text"} className="w-full bg-green-500  rounded-lg mt-3 text-white hover:cursor-pointer active:bg-green-600" onClick={handleClick}>Initiate Transfer</button>
            </div>


        </div>
    )
}