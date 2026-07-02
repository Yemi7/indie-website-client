import { createContext, useEffect, useState } from "react";
import service from "../services/service.config";

const AuthContext = createContext()

function AuthWrapper(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserRole, setLoggedUserRole] = useState(null)
    const [loggedUserPfp, setLoggedUserPfp] = useState(null)
    const [loggedUserEmail, setLoggedUserEmail] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)

    const [isAuthenticating, setIsAuthenticating] = useState(true)

    async function authenticateUser(params) {
        const authToken = localStorage.getItem("authToken")
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
            const response = await service.get("/auth/verify")
            console.log(response);

            setIsLoggedIn(true)
            setLoggedUserId(response.data._id)
            setIsAuthenticating(false)
            setLoggedUserRole(response.data.role)
            setLoggedUserPfp(response.data.profilePic)
            setLoggedUserEmail(response.data.email)
            setIsAdmin(response.data.role === "admin")
        } catch (error) {
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

    useEffect(() => {
        authenticateUser()
    }, [])

    if (isAuthenticating) {
        return <h3>is authenticating</h3>
    }

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