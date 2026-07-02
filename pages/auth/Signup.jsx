import { useState } from "react"
import service from "../../services/service.config"
import { Button, TextInput, Label } from "flowbite-react"
import { useNavigate } from "react-router-dom"

function Signup() {

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const handleUsernameChange = (e) => setUsername(e.target.value)
    const handleEmailChange = (e) => setEmail(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)

    const handleSignup = async (e) => {
        e.preventDefault();

        //stops unneeded request to the backend
        if (!email || !password || !username) {
            setErrorMessage("Please enter all fields")
        }

        try {
            const body = {
                username,
                email,
                password,
            }

            const response = await service.post("/auth/signup", body)
            console.log(response);

            navigate("/login")

        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message)
            }
        }
    }

    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">

                <h1 className="text-2xl font-medium text-[#f0f2f7] mb-1">Create an account</h1>
                <p className="text-sm text-[#555c78] mb-8">Join Indie Vault and share your games</p>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">

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

                    {errorMessage && (
                        <p className="text-sm text-red-400 bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2">
                            {errorMessage}
                        </p>
                    )}

                    <Button type="submit" className="w-full bg-[#6b8cde] text-white border-none mt-1">
                        Sign up
                    </Button>

                    <div className="flex items-center gap-3 text-[#555c78] text-xs">
                        <div className="flex-1 h-px bg-[#1e2236]" />
                        or
                        <div className="flex-1 h-px bg-[#1e2236]" />
                    </div>

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
