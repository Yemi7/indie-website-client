import { createContext, useEffect, useState } from "react";
import service from "../services/service.config";

const AuthContext = createContext()

function AuthWrapper(props) {
    // states that universally store whether the user is logged in, and if so the some user information
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserRole, setLoggedUserRole] = useState(null)
    const [loggedUserPfp, setLoggedUserPfp] = useState(null)
    const [loggedUserEmail, setLoggedUserEmail] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)

    // state to consider async service call
    const [isAuthenticating, setIsAuthenticating] = useState(true)

    // function that checks the user
    async function authenticateUser(params) {
        // gets the user token from the local storage
        const authToken = localStorage.getItem("authToken")

        // if there is no token all states are set to false and null to ensure the user isn't logged in
        if (!authToken) {
            setIsLoggedIn(false)
            setLoggedUserId(null)
            setIsAuthenticating(false)
            setLoggedUserRole(null)
            setLoggedUserPfp(null)
            setLoggedUserEmail(null)
            setIsAdmin(false)
            return
        }
        try {
            // backend function to verify the local storage token is equal to the one made be JSON Web Token
            const response = await service.get("/auth/verify")
            console.log(response);
            // if true, on all pages needed it sets the user as logged in, and stores the user data in states
            setIsLoggedIn(true)
            setLoggedUserId(response.data._id)
            setIsAuthenticating(false)
            setLoggedUserRole(response.data.role)
            setLoggedUserPfp(response.data.profilePic)
            setLoggedUserEmail(response.data.email)
            setIsAdmin(response.data.role === "admin")
        } catch (error) {
            // an error means the token was wrong or tampered with, so it logs out the user and removes its data from states
            console.log(error);
            setIsLoggedIn(false)
            setLoggedUserId(null)
            setIsAuthenticating(false)
            setLoggedUserRole(null)
            setIsAdmin(false)
            return
        }
    }


    const passedContext = { isLoggedIn, loggedUserId, loggedUserPfp, loggedUserEmail, isAdmin, authenticateUser }

    // upon every new load the user is verified
    useEffect(() => {
        authenticateUser()
    }, [])

    // async consideration
    if (isAuthenticating) {
        return <h3>is authenticating</h3>
    }

    // returns the AuthContext wrapper
    return (
        <AuthContext.Provider value={passedContext}>
            {props.children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthWrapper
}