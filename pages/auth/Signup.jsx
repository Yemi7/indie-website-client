import { useState } from "react"
import service from "../../services/service.config"
import { useNavigate } from "react-router"
import { Button, TextInput, Label } from "flowbite-react"

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
        <div className="flex min-h-screen flex-col justify-center items-center">
            <h1>Signup Form</h1>

            <form onSubmit={handleSignup} className="flex max-w-md flex-col gap-4 w-full" >
                <div>
                    <div className="mb-2 block">
                        <label htmlFor="username1">Username:</label>
                        <TextInput
                            type="text"
                            name="username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>
                </div>


                <div>
                    <div className="mb-2 block">
                        <label htmlFor="email1">Email:</label>
                        <TextInput
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                </div>

                <div>
                    <div className="mb-2 block">
                        <label htmlFor="password1">Password:</label>
                        <TextInput
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                </div>


                <Button type="submit" className="m-0">Signup</Button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
        </div>
    )
}

export default Signup
