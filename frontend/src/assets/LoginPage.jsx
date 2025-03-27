import '../App.css';
import {useRef, forwardRef} from "react";
import axios from "axios";
import {useNavigation,useNavigate} from "react-router";
function LoginPage() {
    const Mail = useRef("");
    const Password = useRef("");
    const navigate=useNavigate();



    const handleLogin = async () => {
        const email = Mail.current.value;
        const password = Password.current.value;
        console.log(email, password);
        try {
            const reply = await axios.post("http://localhost:3000/signin", {
                username: email,
                password: password
            });

            if (reply.status === 200) {
                console.log("Logged in successfully");
                localStorage.setItem("token",reply.data.token);
                navigate("/Dashboard");
            } else {
                alert("Error Logging in");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div className="drop-shadow-lg contrast-90 bg-white rounded-[5px] flex flex-col items-center w-72 p-5">
            <h1 className="font-bold text-3xl">
                Login
            </h1>
            <p className="text-gray-500">
                Enter your credential to access your account.
            </p>
            <InputBox ref={Mail} Title="Email" PlaceHolder="whatever@email.com" />
            <InputBox ref={Password} Title="Password" PlaceHolder="" />

            <button className="bg-black text-white item-center w-full hover:cursor-pointer border-solid border-1 border-white mt-5 active:invert rounded-md p-2" onClick={handleLogin}>Log In</button>
            <p>Dont have an account?<a href="/SignUp" className="underline">Sign Up</a></p>
        </div>
    )
}

const InputBox = forwardRef(({ Title, PlaceHolder }, ref) => {
    return (
        <div className="w-full mt-3">
            <p className="text-black font-bold text-md w-full">{Title}</p>
            <input type={(Title === "Password" ? "password" : "text")} className="w-full border-solid border-2 border-gray-200 p-1 rounded-[4px]"
                   placeholder={PlaceHolder} ref={ref} />
        </div>
    )
});

export default LoginPage;