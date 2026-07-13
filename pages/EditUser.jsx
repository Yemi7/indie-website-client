import { useContext, useState } from "react"
import { AuthContext } from "../context/auth.context"
import { useNavigate } from "react-router-dom"
import service from "../services/service.config"
import { Button, FileInput, HelperText, Label, TextInput } from "flowbite-react"

function EditUser() {

    // states from universal AuthContext containing login state and user details in payload
    const { loggedUserId, setLoggedUser, authenticateUser } = useContext(AuthContext)

    // states with user details
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [bio, setBio] = useState("")
    const [profilePic, setProfilePic] = useState(null)

    // conditional error message recieved from backend
    const [errorMessage, setErrorMessage] = useState("")

    // stores user inputs in the details states
    const handleEmailChange = (e) => setEmail(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)
    const handleBioChange = (e) => setBio(e.target.value)

    // async consideration
    const [uploading, setUploading] = useState(false)

    const navigate = useNavigate()

    // sends the user inputs to the server, which patches the updates in the database, 
    const handleSubmit = async (e) => {
        e.preventDefault()
        // body of the user inputs
        const body = {
            email,
            password,
            bio,
            profilePic
        }
        try {
            // sends the user inputs to the server, to patch in the db
            const response = await service.patch(`/auth/edit-user`, body)
            console.log(response.data);

            // sets the new token in the local storage
            localStorage.setItem("authToken", response.data.authToken)

            // AuthContext function verifies if the token is correct with another async request, then sets the logged in user states
            await authenticateUser()

            // Navigates to the user-details page using the new userId
            navigate(`/user-details/${loggedUserId}`)

        } catch (error) {
            // if the user enters insufficient data like a weak password or false email, sets the error message state using message recieved from db
            console.log(error)
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message || "Please check your inputs.") // conditional if there is no server message
                return
            }
            // if a user tries to update the information of another user, sets a different error message
            if (error.response && error.response.status === 403) {
                setErrorMessage("You are not allowed to update this user.")
                return
            }
        }
    }

    // handles the user uploading a profile picture of their own to cloudinary
    const handleProfilePicUpload = async (e) => {

        if (!e.target.files[0]) {
            return
        }

        // sets async consideration to disable upload button while a picture is uploading
        setUploading(true)

        // creates and appends the image the user uploads
        const uploadData = new FormData()
        uploadData.append("image", e.target.files[0])

        try {
            // uploads the image to multer storage in the server
            const response = await service.post("/upload/upload-one", uploadData)
            console.log(response.data);

            // sets the recieved cloudinary url to the state
            setProfilePic(response.data.imageUrl)

            // clears the async consideration state
            setUploading(false)

        } catch (error) {
            // if the user uploads an incorrect file type, sets the conditional error message and renders it under the form
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.errorMessage || "Upload failed. Check image format and size.")

                // clears the async consideration state
                setUploading(false)
                return
            }
            // for generic errors, sends the user to the error screen
            setUploading(false)
            navigate("/error")
        }
    }
    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen text-[#e2e4ea] flex flex-col items-center justify-center px-6 py-12">

            <div className="w-full max-w-md">

                {/* Header */}
                <h1 className="text-2xl font-medium text-[#f0f2f7] mb-1">Edit profile</h1>
                <p className="text-sm text-[#555c78] mb-8">Update your account details below</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Email Input */}
                    <div>
                        <Label htmlFor="email" className="text-[#8b90a0] text-sm mb-2 block">Email</Label>
                        <TextInput
                            id="email"
                            type="text"
                            placeholder="Change email"
                            value={email}
                            onChange={handleEmailChange}
                            className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <Label htmlFor="password" className="text-[#8b90a0] text-sm mb-2 block">Password</Label>
                        <TextInput
                            id="password"
                            type="password"
                            placeholder="Change password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                        />
                    </div>

                    {/* Bio Input */}
                    <div>
                        <Label htmlFor="bio" className="text-[#8b90a0] text-sm mb-2 block">Bio</Label>
                        <TextInput
                            id="bio"
                            type="text"
                            placeholder="Change bio"
                            value={bio}
                            onChange={handleBioChange}
                            className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                        />
                    </div>

                    {/* Profile pic Input */}
                    <div>
                        <Label htmlFor="file-upload-helper-text" className="text-[#8b90a0] text-sm mb-2 block">
                            Profile picture
                        </Label>
                        <FileInput
                            id="file-upload-helper-text"
                            name="profile-pic"
                            accept="image/png,image/jpeg"
                            onChange={handleProfilePicUpload}
                            disabled={uploading}
                            className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8]"
                        />
                        <HelperText className="mt-1 text-[#555c78] text-xs">JPG or PNG</HelperText>

                        {/* conditional uploading message to tell user image is uploading */}
                        {uploading && (
                            <p className="text-sm text-[#6b8cde] mt-2">Uploading image...</p>
                        )}

                        {/* conditional img element to display to the user what they're uploading */}
                        {profilePic && (
                            <div className="mt-3">
                                <img
                                    src={profilePic}
                                    alt="profile preview"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-[#1e2236]"
                                />
                            </div>
                        )}
                    </div>

                    {/* conditional error message set if the user input insufficient data, recieved from the server */}
                    {errorMessage && (
                        <p className="text-sm text-red-400 bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2">
                            {errorMessage}
                        </p>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full bg-[#6b8cde] text-white border-none mt-2"
                    >
                        Save changes
                    </Button>


                </form>
            </div>
        </div>
    )
}
export default EditUser