import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import service from "../../services/service.config";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function Login() {

    const { authenticateUser } = useContext(AuthContext)

    const navigate = useNavigate()

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const [errorMessage, setErrorMessage] = useState(null)

    const handleEmailChange = (e) => setEmail(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const body = { email, password }

            const response = await service.post("/auth/login", body)
            console.log(response);

            localStorage.setItem("authToken", response.data.authToken)

            await authenticateUser()

            navigate("/")

        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(error.response.data.message)
                setErrorMessage(error.response.data.message)
            }
        }
    }

return (
    <div className="bg-[rgb(8,11,19)] min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">

            <h1 className="text-2xl font-medium text-[#f0f2f7] mb-1">Welcome back</h1>
            <p className="text-sm text-[#555c78] mb-8">Sign in to your Indie Vault account</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">

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
                    Login
                </Button>

                <div className="flex items-center gap-3 text-[#555c78] text-xs">
                    <div className="flex-1 h-px bg-[#1e2236]" />
                    or
                    <div className="flex-1 h-px bg-[#1e2236]" />
                </div>

                <Button
                    color="dark"
                    className="w-full border border-[#2a3050] text-[#8b90a0] bg-transparent hover:bg-[#0d1020]"
                    onClick={() => navigate("/signup")}
                >
                    Create an account
                </Button>

            </form>
        </div>
    </div>
)
}

export default Login
