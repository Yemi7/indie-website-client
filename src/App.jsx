import { useState } from 'react'
import Editor from "../components/Editor"
import Home from "../pages/Home"

import Login from "../pages/auth/Login"
import Signup from "../pages/auth/Signup"
import PrivatePage from "../pages/PrivatePage"
import OnlyPrivate from "../components/OnlyPrivate"
import GameList from "../pages/GameList"
import GameDetails from "../pages/GameDetails"
import GameForm from "../pages/GameForm"
import { Route, Routes } from "react-router-dom"
import PostEditor from "../pages/PostEditor"


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
        <Route path="/game-form" element={<GameForm />} />{/* future private route */}
        <Route path="/game-edit/:id/edit" element={<GameForm />} />{/* future private route */}
        <Route path="/post/create-post/:game" element={<PostEditor />} ></Route>
        <Route path="/post/edit-post/:post" element={<PostEditor />} ></Route>
      </Routes>
    </>
  )
}

export default App
