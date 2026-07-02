import { useState } from 'react'
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
import PostPage from "../pages/PostPage"
import MyNavbar from "../components/MyNavbar"
import UserDetails from "../pages/UserDetails"
import EditUser from "../pages/EditUser"
import OnlyPublic from "../components/OnlyPublic"


function App() {

  return (
    <>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<OnlyPublic><Login /></OnlyPublic>} />
        <Route path="/signup" element={<OnlyPublic><Signup /></OnlyPublic>} />

        {/* Just testing using a private guard */}
        <Route path="/private" element={<OnlyPrivate> <PrivatePage /> </OnlyPrivate>} />

        <Route path="/game-list" element={<GameList />} />
        <Route path="/game-details/:gameId" element={<GameDetails />} />
        <Route path="/game-form" element={<OnlyPrivate><GameForm /></OnlyPrivate>} />
        <Route path="/game-edit/:id/edit" element={<OnlyPrivate><GameForm /></OnlyPrivate>} />
        <Route path="/post/create-post/:game" element={<OnlyPrivate><PostEditor /></OnlyPrivate>} />
        <Route path="/post/edit-post/:post" element={<OnlyPrivate><PostEditor /></OnlyPrivate>} />
        <Route path="/post/view-post/:post" element={<PostPage />} />
        <Route path="/user-details/:user" element={<OnlyPrivate><UserDetails /></OnlyPrivate>} />
        <Route path="/edit-user/:user" element={<OnlyPrivate><EditUser /></OnlyPrivate>} />
      </Routes>
    </>
  )
}

export default App
