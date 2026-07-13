import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import service from "../../services/service.config";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function Login() {

    const { authenticateUser } = useContext(AuthContext)

    const navigate = useNavigate()

    // user detail states
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    // async consideration
    const [loggingIn, setLoggingIn] = useState(false)

    // conditional error message filled when the user enters wrong login information, recieved from the backend with error 400
    const [errorMessage, setErrorMessage] = useState(null)

    // stores values in the inputs in states
    const handleEmailChange = (e) => setEmail(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)

    // creates a token for the user after logging in
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // setting the async function to true to disable button
            setLoggingIn(true)

            // sends the entered details to check if they match a user in the database
            const body = { email, password }
            const response = await service.post("/auth/login", body)
            console.log(response);

            // if true, gives the user a usable token which stores exclusive information for the user (payload) for user flow
            localStorage.setItem("authToken", response.data.authToken)

            // AuthContext function verifies if the token is correct with another async request, then sets the logged in user states
            await authenticateUser()

            // sets the async state to false after completing
            setLoggingIn(false)

            // navigates to the home if the user logs in
            navigate("/")

        } catch (error) {
            // if the log in is false, it sets the error message to the message sent from the db, which conditionally renders the message below the form
            if (error.response && error.response.status === 400) {
                console.log(error.response.data.message)
                setErrorMessage(error.response.data.message)
                // sets the async state to false 
                setLoggingIn(false)
                return
            }
            // if there is a different error not related to a wrong login, sends the user to the error page
            navigate("/error")
        }
    }

    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">

                {/* Header */}
                <h1 className="text-2xl font-medium text-[#f0f2f7] mb-1">Welcome back</h1>
                <p className="text-sm text-[#555c78] mb-8">Sign in to your Indie Vault account</p>

                {/* login form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email1" className="text-[#8b90a0] text-sm mb-2 block">Email</label>
                        <TextInput
                            id="email1"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={handleEmailChange}
                            className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password1" className="text-[#8b90a0] text-sm mb-2 block">Password</label>
                        <TextInput
                            id="password1"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={handlePasswordChange}
                            className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                        />
                    </div>

                    {/* conditionally rendered error message that renders when incorrect info has been entered */}
                    {errorMessage && (
                        <p className="text-sm text-red-400 bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2">
                            {errorMessage}
                        </p>
                    )}

                    {/* Login Button */}
                    <Button
                        type="submit"
                        className="w-full bg-[#6b8cde] text-white border-none mt-1"
                        disabled={loggingIn}
                    >
                        Login
                    </Button>

                    {/* styled or divider */}
                    <div className="flex items-center gap-3 text-[#555c78] text-xs">
                        <div className="flex-1 h-px bg-[#1e2236]" />
                        or
                        <div className="flex-1 h-px bg-[#1e2236]" />
                    </div>

                    {/* Create Account Button, navigates to the signup page */}
                    <Button
                        color="dark"
                        className="w-full border border-[#2a3050] text-[#8b90a0] bg-transparent hover:bg-[#0d1020]"
                        onClick={() => navigate("/signup")}
                        disabled={loggingIn}
                    >
                        Create an account
                    </Button>

                </form>
            </div>
        </div>
    )
}

export default Login
