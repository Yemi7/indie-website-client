import { useState } from 'react'
import Editor from "../components/Editor"
import Home from "../pages/Home"
import { Route, Routes } from "react-router"
import Login from "../pages/auth/Login"
import Signup from "../pages/auth/Signup"
import PrivatePage from "../pages/PrivatePage"
import OnlyPrivate from "../components/OnlyPrivate"
import GameList from "../pages/GameList"
import GameDetails from "../pages/GameDetails"
import CreateGame from "../pages/CreateGame"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Just testing using a private guard */}
        <Route path="/private" element={<OnlyPrivate> <PrivatePage /> </OnlyPrivate>} />

        <Route path="/game-list" element={<GameList />} />
        <Route path="/game-details/:gameId" element={<GameDetails />} />
        <Route path="/create-game" element={<CreateGame />} />{/* future private route */}
      </Routes>
    </>
  )
}

export default App
