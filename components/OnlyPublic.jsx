import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { Navigate } from "react-router-dom"

function OnlyPublic(props) {


    const { isLoggedIn } = useContext(AuthContext)
    // returns the page in props only when the user is logged out
    if (!isLoggedIn) {
        return props.children // show the page
    } else {
        return <Navigate to="/" />
    }

}
export default OnlyPublic