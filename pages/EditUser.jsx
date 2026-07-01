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
            console.log(error);
        }
    }
    return (
        <div>
            <h1>This it the edit user page</h1>
            <div className="flex min-h-screen flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4" >
                    <div>
                        <div className="mb-2 block ">
                            <Label htmlFor="email">Email</Label>
                        </div>
                        <TextInput
                            id="email"
                            type="text"
                            placeholder="Change Email"
                            value={email}
                            onChange={handleEmailChange}

                        />
                    </div>
                    <div>
                        <div className="mb-2 block ">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            placeholder="Change Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block ">
                            <Label htmlFor="bio">Bio</Label>
                        </div>
                        <TextInput
                            id="bio"
                            type="text"
                            placeholder="Change Bio"
                            value={bio}
                            onChange={handleBioChange}
                        />
                    </div>
                    <div> {/* need to implement a remove image function */}
                        <Label className="mb-2 block" htmlFor="file-upload-helper-text">
                            Upload file
                        </Label>
                        <FileInput
                            id="file-upload-helper-text"
                            name="profile-pic"
                            accept="image/png,image/jpeg"
                            onChange={handleProfilePicUpload}
                            disabled={uploading}
                        />
                        <HelperText className="mt-1">JPG or PNG.</HelperText>
                        {uploading ? <h3>... uploading image</h3> : null}

                        {profilePic ? (<div><img src={profilePic} alt="img" width={200} /></div>) : null}
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </div>
    )
}
export default EditUser