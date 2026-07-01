import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { Link } from "react-router-dom";

function MyNavbar() {
    return (
        <Navbar fluid rounded>
            <NavbarBrand as={Link} to="/">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Indie Website</span>
            </NavbarBrand>
            <NavbarToggle />
            <NavbarCollapse>
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
