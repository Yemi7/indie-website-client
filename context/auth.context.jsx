import { createContext, useEffect, useState } from "react";
import service from "../services/service.config";

const AuthContext = createContext()

function AuthWrapper(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserRole, setLoggedUserRole] = useState(null)
    const [loggedUserPfp, setLoggedUserPfp] = useState(null)
    const [loggedUserEmail, setLoggedUserEmail] = useState(null)

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
        } catch (error) {
            console.log(error);
            setIsLoggedIn(false)
            setLoggedUserId(null)
            setIsAuthenticating(false)
            setLoggedUserRole(null)
            return
        }
    }

    const passedContext = { isLoggedIn, loggedUserId, loggedUserPfp, loggedUserEmail, authenticateUser }

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