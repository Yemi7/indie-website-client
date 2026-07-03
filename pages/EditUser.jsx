import { useContext, useState } from "react"
import { AuthContext } from "../context/auth.context"
import { useNavigate } from "react-router-dom"
import service from "../services/service.config"
import { Button, FileInput, HelperText, Label, TextInput } from "flowbite-react"

function EditUser() {

    const { loggedUserId, setLoggedUser, authenticateUser } = useContext(AuthContext)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [bio, setBio] = useState("")
    const [profilePic, setProfilePic] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")

    const handleEmailChange = (e) => setEmail(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)
    const handleBioChange = (e) => setBio(e.target.value)

    const [uploading, setUploading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const body = {
            email,
            password,
            bio,
            profilePic
        }
        try {
            const response = await service.patch(`/auth/edit-user`, body)
            console.log(response.data);
            localStorage.setItem("authToken", response.data.authToken)
            await authenticateUser()
            navigate(`/user-details/${loggedUserId}`)
        } catch (error) {
            console.log(error)
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message || "Please check your inputs.")
                return
            }
            if (error.response && error.response.status === 403) {
                setErrorMessage("You are not allowed to update this user.")
                return
            }
        }
    }

    const handleProfilePicUpload = async (e) => {
        if (!e.target.files[0]) {
            return
        }
        setUploading(true)

        const uploadData = new FormData()
        uploadData.append("image", e.target.files[0])
        try {
            const response = await service.post("/upload/upload-one", uploadData)
            console.log(response.data);
            setProfilePic(response.data.imageUrl)
            setUploading(false)

        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.errorMessage || "Upload failed. Check image format and size.")
                setUploading(false)
                return
            }
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

                    {/* Email */}
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

                    {/* Password */}
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

                    {/* Bio */}
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

                    {/* Profile pic */}
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

                        {uploading && (
                            <p className="text-sm text-[#6b8cde] mt-2">Uploading image...</p>
                        )}

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

                    {/* Submit */}
                    {errorMessage && (
                        <p className="text-sm text-red-400 bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2">
                            {errorMessage}
                        </p>
                    )}
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