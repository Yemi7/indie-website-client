import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Avatar, Dropdown, DropdownHeader, DropdownItem, DropdownDivider } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../services/service.config";
import { AuthContext } from "../context/auth.context";

function MyNavbar() {
    // values retrieved from authenitcation context
    const { loggedUserPfp, loggedUserId, loggedUserEmail, authenticateUser, isLoggedIn } = useContext(AuthContext)

    const navigate = useNavigate()

    // removes the token from local storage when the user signs out
    const signout = () => {
        localStorage.removeItem("authToken")
        authenticateUser()
        navigate("/login")
    }
    // sends user to the sign in page
    const signIn = () => {
        navigate("/login")
    }

    return (
        // Navbar component
        <Navbar fluid rounded>
            {/* Navbar icon (page name) */}
            <NavbarBrand as={Link} to="/">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Indie Vault</span>
            </NavbarBrand>
            <div className="flex md:order-2">
                {/* user profile pic, clicking gives the user options*/}
                <Dropdown
                    arrowIcon={true}
                    inline
                    label={
                        <Avatar alt="User settings" img={loggedUserPfp} rounded />
                    }
                >
                    <DropdownHeader>
                        <span className="block truncate text-sm font-medium">{loggedUserEmail}</span>
                    </DropdownHeader>
                    {/* both the User Page and Edit User page buttons only appear if the user is logged in, checked using the AuthContext */}
                    {isLoggedIn && <DropdownItem onClick={() => { navigate(`/user-details/${loggedUserId}`) }} >User Page</DropdownItem>}
                    {isLoggedIn && <DropdownItem onClick={() => { navigate(`/edit-user/${loggedUserId}`) }} >Edit User</DropdownItem>}
                    <DropdownDivider />
                    {   // if the user is logged in it will display sign out, if they aren't it displays sign in
                        isLoggedIn ?
                            <DropdownItem onClick={() => { signout() }} >Sign out</DropdownItem> :
                            <DropdownItem onClick={() => { signIn() }} >Sign In</DropdownItem>
                    }
                </Dropdown>
            </div>
            {/* if the screen becomes small the navbar displays the links in a dropdown instead */}
            <NavbarToggle />
            <NavbarCollapse className="align-self-end">
                <NavbarLink as={Link} to="/" active>
                    Home
                </NavbarLink>
                <NavbarLink as={Link} to="/game-list" >
                    Games
                </NavbarLink>
                <NavbarLink as={Link} to="/game-form" >Create Game</NavbarLink>

            </NavbarCollapse>
        </Navbar>
    )
}
export default MyNavbar
