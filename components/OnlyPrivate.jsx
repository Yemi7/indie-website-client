import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { Navigate } from "react-router"


function OnlyPrivate(props) {

    const { isLoggedIn } = useContext(AuthContext)

    if (isLoggedIn) {
        return props.children // show the page
    } else {
        return <Navigate to="/login" />
    }

}

export default OnlyPrivate