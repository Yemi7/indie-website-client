import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { Navigate } from "react-router-dom"


function OnlyPrivate(props) {

    const { isLoggedIn } = useContext(AuthContext)
    // returns to page in props only when the user is logged in
    if (isLoggedIn) {
        return props.children // show the page
    } else {
        return <Navigate to="/login" />
    }

}

export default OnlyPrivate