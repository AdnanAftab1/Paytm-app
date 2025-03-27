import  '../App.css';
import {useRef, forwardRef} from "react";
import axios from "axios";
import {tokenContext} from "./contexts.jsx";


function SignupPage() {

    const FirstName = useRef("");
    const LastName = useRef("");
    const Mail = useRef("");
    const Password = useRef("");

    const handleSignup = async () => {
        const firstname = FirstName.current.value;
        const lastname = LastName.current.value;
        const email = Mail.current.value;
        const password = Password.current.value;
        console.log(firstname, lastname, email, password);
        console.log(firstname, lastname, email, password);

        try {
            const reply = await axios.post("http://localhost:3000/signup", {
                username: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            });

            if (reply.status === 200) {
                console.log("Signed up successfully");
                localStorage.setItem("token",reply.data.token);
                window.location.href = "/Dashboard";
            } else {
                alert("Error Signing up");

            }
        } catch (error) {
            console.error("Error during signup:", error);
        }
    }

    return (
        <div className="drop-shadow-lg contrast-90 bg-white rounded-[5px] flex flex-col items-center w-72 p-5">
            <h1 className="font-bold text-3xl">
                Sign Up
            </h1>
            <p className="text-gray-500">
                Enter your information to create an account.
            </p>
            <br/>
            <InputBox ref={FirstName} Title="First Name" PlaceHolder="Enter Your First Name" />
            <InputBox ref={LastName} Title="Last Name" PlaceHolder="Enter Your Last Name" />
            <InputBox ref={Mail} Title="Email" PlaceHolder="whatever@email.com" />
            <InputBox ref={Password} Title="Password" PlaceHolder="" />

            <button className="bg-black text-white item-center w-full mt-5 rounded-md border-solid border-1 border-white hover:cursor-pointer active:invert p-2 " onClick={handleSignup}>Sign Up</button>
            <p>Already have an account?<a href="/" className="underline">Login</a></p>
        </div>

    )

}

const InputBox=forwardRef(({Title,PlaceHolder},ref)=>{
    return (
        <div className="w-full mt-3">
            <p className="text-black font-bold text-md w-full">{Title}</p>
            <input type={(Title==="Password"?"password":"text")} ref={ref} className="w-full border-solid border-2 border-gray-200 rounded-[4px]"
                   placeholder={PlaceHolder}/>
        </div>
    )
});


export default SignupPage
