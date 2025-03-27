import { useState } from 'react'
import SignupPage from "./assets/SignupPage.jsx";
import LoginPage from "./assets/LoginPage.jsx";
import TransferPage from "./assets/TransferPage.jsx";
import DashboardPage from "./assets/Dashboard.jsx";
import {BrowserRouter,Routes,Route} from  'react-router'

import './App.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <div className="flex justify-center items-center h-screen w-screen font-sans">
        <Routes>
          <Route path="/" element={<LoginPage />} />
           <Route path="/Signup" element={<SignupPage />} />
            <Route path="/Transfer" element={<TransferPage />} />
            <Route path="/Dashboard" element={<DashboardPage />} />
        </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
