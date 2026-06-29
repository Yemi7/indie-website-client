import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router";
import service from "../../services/service.config";
import { Button, Label, TextInput } from "flowbite-react";

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
        <div className="flex min-h-screen flex-col justify-center items-center">
            <form onSubmit={handleLogin} className="flex max-w-md flex-col gap-4 w-full">
                <div>
                    <div className="mb-2 block">
                        <label htmlFor="email1">Email:</label>
                    </div>
                    <TextInput
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>

                <div>
                    <div className="mb-2 block">
                        <label htmlFor="password1">Password:</label>
                    </div>
                    <TextInput
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>

                <Button type="submit" >Login</Button>

                {errorMessage && <p>{errorMessage}</p>}

                <Button color="dark" onClick={() => { navigate("/signup") }}>Sign up</Button>


            </form>
        </div>
    )
}

export default Login
