import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Editor from "../components/Editor"
import Home from "../pages/Home"
import { Route, Routes } from "react-router"
import Login from "../pages/auth/Login"
import Signup from "../pages/auth/Signup"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </>
  )
}

export default App
