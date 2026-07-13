import { useState } from "react"
import service from "../../services/service.config"
import { Button, TextInput, Label } from "flowbite-react"
import { useNavigate } from "react-router-dom"

function Signup() {

    const navigate = useNavigate()

    // user input states
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // async consideration state
    const [signingUp, setSigningUp] = useState(false)

    // conditional error message recieved when the user enters insufficient signup data, recived from the back end with error 400
    const [errorMessage, setErrorMessage] = useState("")

    // states that store the user inputs
    const handleUsernameChange = (e) => setUsername(e.target.value)
    const handleEmailChange = (e) => setEmail(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)

    // creates a user in the database
    const handleSignup = async (e) => {
        e.preventDefault();

        // conditionally disables the signup button when the async service is occuring
        setSigningUp(true)

        // stops unneeded request to the backend
        if (!email || !password || !username) {
            setErrorMessage("Please enter all fields")
            setSigningUp(false)
            return
        }

        // sends the inputed data to the database and creates a user if the inputted data can be validated by the model
        try {
            const body = {
                username,
                email,
                password,
            }

            const response = await service.post("/auth/signup", body)
            console.log(response);

            // navigates to the login page after signing up
            navigate("/login")

        } catch (error) {
            // if the inputted data doesn't match the model, sets error message state with the response and will be conditionally rendered
            console.log(error);
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message)
                // re-enables button so the user can try again
                setSigningUp(false)
                return
            }

            // for errors other than insufficient user inputs, navigates to the error page
            navigate("/error")
        }
    }

    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                
                {/* Header */}
                <h1 className="text-2xl font-medium text-[#f0f2f7] mb-1">Create an account</h1>
                <p className="text-sm text-[#555c78] mb-8">Join Indie Vault and share your games</p>

                {/* sign up form */}
                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    {/* Username Input */}
                    <div>
                        <label htmlFor="username1" className="text-[#8b90a0] text-sm mb-2 block">Username</label>
                        <TextInput
                            id="username1"
                            type="text"
                            name="username"
                            placeholder="Your username"
                            value={username}
                            onChange={handleUsernameChange}
                            className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                        />
                    </div>

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

                    {/* condtional error message rendered when the user inputs insufficient information */}
                    {errorMessage && (
                        <p className="text-sm text-red-400 bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2">
                            {errorMessage}
                        </p>
                    )}

                    {/* signup button */}
                    <Button
                        type="submit"
                        className="w-full bg-[#6b8cde] text-white border-none mt-1"
                        disabled={signingUp}
                    >
                        Sign up
                    </Button>

                    {/* styled or divider */}
                    <div className="flex items-center gap-3 text-[#555c78] text-xs">
                        <div className="flex-1 h-px bg-[#1e2236]" />
                        or
                        <div className="flex-1 h-px bg-[#1e2236]" />
                    </div>

                    {/* button that navigate to login page */}
                    <Button
                        color="dark"
                        className="w-full border border-[#2a3050] text-[#8b90a0] bg-transparent hover:bg-[#0d1020]"
                        onClick={() => navigate("/login")}
                    >
                        Already have an account? Login
                    </Button>

                </form>
            </div>
        </div>
    )
}

export default Signup
