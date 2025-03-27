import CircleIcon from "./Other.jsx";
import '../App.css';
import {useEffect,useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router";

export default function DashboardPage() {

    const [Name, setName] = useState("No one");
    const [balance, setBalance] = useState(0);
    const [User, setUserList] = useState([]);
    const token=localStorage.getItem("token");
    const navigate=useNavigate();

    console.log("Token:", token);
    let res;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios("http://localhost:3000/balance",{headers:{"Authorization":`Bearer ${token}`}});
                res=response.data;
                console.log("Response:", res);
                setName(res.firstname + " " + res.lastname);
                setBalance(res.balance);
                const bulk = await axios("http://localhost:3000/bulk",{
                    params:{
                        filter:res.username
                    }
                }
                );
                console.log(bulk.data.users);
                setUserList(bulk.data.users);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        fetchData();
    }, [token]);

    console.log("DashboardPage rendered");

    return (
        <div className="bg-white w-screen h-screen">
            <nav className="navbar p-2 drop-shadow-lg flex justify-between h-15 bg-neutral-100">
                <p className="m-2 font-semibold">Paytm App</p>
                <div className="flex">
                    <p className="m-2 font-semibold">{Name}</p>
                    <CircleIcon Color="bg-slate-500 m-1" TextColor="text-gray-900" Char={Name.charAt(0)} />
                </div>
            </nav>
            <div className={"m-3 w-[90%]"}>
                <div className={"font-semibold mt-3"}>Your balance: {balance}</div>
                <div className={"font-semibold mt-4 "}>Users</div>
                <input type={"text"} className={"w-full border-solid border-2 border-gray-300 rounded-[4px] "} />
                {User.map(used => (
                    <Listings
                        key={used.username}
                        Name={used.username}
                        onClick={() => {
                            console.log(Name + " sent money to " + used.username);
                            console.log(used);
                            localStorage.setItem("receiver",used.user__id);
                            console.log("Receiver:",used.user__id);
                            navigate("/Transfer");
                        }}
                    />
                ))}
            </div>
        </div>
    );
    function Listings({ Name, onClick }) {
        return (
            <div className="w-full shadow-sm flex flex-row justify-between items-center ">
                <div className="flex items-center">
                    <CircleIcon Color="bg-gray-900 m-2" TextColor="text-slate-500" Char={Name.charAt(0)}/>
                    <p className="p-2">{Name}</p>
                </div>
                <button onClick={onClick} className="bg-black text-white opacity-80 m-2 rounded-md
                border-solid border-1 border-white hover:cursor-pointer active:invert p-2 ">
                    Send Money
                </button>
            </div>
        );
    }
}