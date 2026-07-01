import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Avatar, Dropdown, DropdownHeader, DropdownItem, DropdownDivider } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../services/service.config";
import { AuthContext } from "../context/auth.context";

function MyNavbar() {

    const { loggedUserPfp, loggedUserId, loggedUserEmail, authenticateUser } = useContext(AuthContext)

    const navigate = useNavigate()

    const signout = () => {
        localStorage.removeItem("authToken")
        authenticateUser()
        navigate("/login")
    }

    return (
        <Navbar fluid rounded>
            <NavbarBrand as={Link} to="/">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Indie Website</span>
            </NavbarBrand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img={loggedUserPfp} rounded />
                    }
                >
                    <DropdownHeader>
                        <span className="block truncate text-sm font-medium">{loggedUserEmail}</span>
                    </DropdownHeader>
                    <DropdownItem onClick={() => { navigate(`/user-details/${loggedUserId}`) }} >User Page</DropdownItem>
                    <DropdownItem onClick={() => { navigate(`/edit-user/${loggedUserId}`) }} >Edit User</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={() => { signout() }} >Sign out</DropdownItem>
                </Dropdown>
            </div>
            <NavbarToggle />
            <NavbarCollapse className="align-self-end">
                <NavbarLink as={Link} to="/" active>
                    Home
                </NavbarLink>
                <NavbarLink as={Link} to="/game-list" >
                    Games
                </NavbarLink>
                <NavbarLink as={Link} to="/game-form" >Create Game</NavbarLink>
                {/* conditional render pfp with option to update it */}

            </NavbarCollapse>
        </Navbar>
    )
}
export default MyNavbar
