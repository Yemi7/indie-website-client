import { useEffect, useState } from "react"
import service from "../services/service.config"
import { Button, Datepicker, Label, TextInput, FileInput, HelperText, Spinner } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

// this game form page is used both for creating a new game, and editing an existing game
function GameForm() {

    // game id recived from dynamic link (only in the instance of editing)
    const { id } = useParams()

    // if there is no id, it means this page wasn't reached through a dynamic link, and a new game is being created. So editing will be false
    const isEditing = Boolean(id)

    // game detail state
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState(null)
    const [expectedRelease, setExpectedRelease] = useState(null)
    const [engine, setEngine] = useState("")
    const [genre, setGenre] = useState("")
    const [coverUrl, setCoverUrl] = useState(null)
    const [imageUrls, setImageUrls] = useState([])
    const [description, setDescription] = useState("")

    // async considerationg states
    const [uploading, setUploading] = useState(false)
    const [uploadingMany, setUploadingMany] = useState(false)
    const [loadingGame, setLoadingGame] = useState(isEditing)

    // error message recieved from backend
    const [errorMessage, setErrorMessage] = useState("")

    // stores user input changes
    const handleTitleChange = (e) => setTitle(e.target.value)
    const handleEngineChange = (e) => setEngine(e.target.value)
    const handleGenreChange = (e) => setGenre(e.target.value)
    const handleDescriptionChange = (e) => setDescription(e.target.value)
    const handleStartDateChange = (date) => setStartDate(date)
    const handleExpectedReleaseChange = (date) => setExpectedRelease(date)

    // async considerationg for creating a game
    const [creating, setCreating] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        // if not editing, do not fetch a game, since there is no id to avoid error
        if (!isEditing) return
        // if the id changes, or the editing variable changes, the new game will be fetched from the backend.
        fetchGame()
    }, [id, isEditing])

    // fetches game from backend
    const fetchGame = async () => {

        try {
            // starts async consideration state
            setLoadingGame(true)

            // fetches game from backend using game id from dynamic link
            const response = await service.get(`/game/${id}`)
            const game = response.data
            console.log(response.data);

            // setting the input states to existing values for easier user flow when editing the game details
            setTitle(game.title)
            setEngine(game.engine)
            setGenre(game.genre || "")
            setDescription(game.description)
            setStartDate(game.startDate ? new Date(game.startDate) : null)
            setExpectedRelease(game.expectedRelease ? new Date(game.expectedRelease) : null)
            setCoverUrl(game.cover)
            setImageUrls(game.images || [])

            // clears async consideration state
            setLoadingGame(false)
        } catch (error) {
            // if there is a backend error it sends the user to the error page
            console.log(error);
            navigate("/error")
        }
    }
    // submits the updated data to the server to be posted or patched in the database
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true)
        setErrorMessage("")


        // contains user input data
        const body = {
            title,
            startDate,
            expectedRelease,
            engine,
            genre,
            description,
            cover: coverUrl,
            images: imageUrls,
        }


        try {
            // if editing, the body is patched to an existing game using the truthy gameId in the dynamic link
            if (isEditing) {

                const response = await service.patch(`/game/${id}`, body)
            } else {
                // if not editing the data is posted as a new game to the server the database
                const response = await service.post("/game", body)
            }

            // clears the async consideration state
            setCreating(false)
            navigate("/game-list")
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message)
                return
            }
            if (error.response && error.response.status === 403) {
                setErrorMessage("You are not allowed to do that.")
                return
            }
            navigate("/error")
        }

    }


    // handles the user uploading a cover of their own to cloudinary
    const handleCoverUpload = async (e) => {
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

            // sets the recieved cloudinary url to the state

            setCoverUrl(response.data.imageUrl)

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

            // sends the user to the error screen on generic errors
            setUploading(false)
            navigate("/error")
        }

    }
    // handles the user uploading games images of their own to cloudinary
    const handleImagesUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) {
            return
        }
        // sets async consideration to true
        setUploadingMany(true)

        // creates and appends each new image the user uploads
        const uploadData = new FormData();
        files.forEach((file) => {
            uploadData.append("images", file)
        })

        try {
            // uploads all images to multer storage
            const response = await service.post("/upload/upload-many", uploadData)
            console.log("New Added Image" + response.data);

            // sets the array of image urls for the user to see each image
            setImageUrls((prevUrls) => [
                ...prevUrls, ...response.data.imageUrls,
            ])

            // clears the async consideration state
            setUploadingMany(false)

        } catch (error) {
            // if the user uploads an incorrect file type, sets the conditional error message and renders it under the form
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.errorMessage || "Upload failed. Check image format and size.")

                // clears the async consideration state
                setUploadingMany(false)
                return
            }

            // clears the async consideration state
            setUploadingMany(false)

            // sends the user to the error screen on generic errors
            navigate("/error")
        }
    }

    // sets a loading spinner when a game is being fetched
    if (loadingGame) return <LoadingSpinner />

    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen text-[#e2e4ea] px-6 py-12">
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <h1 className="text-2xl font-medium text-[#f0f2f7] mb-1">
                    {isEditing ? "Edit game" : "New game"}
                </h1>
                <p className="text-sm text-[#555c78] mb-8">
                    {isEditing ? "Update your game details below" : "Fill in the details for your new game"}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Title */}
                    <div>
                        <Label htmlFor="title" className="text-[#8b90a0] text-sm mb-2 block">Title</Label>
                        <TextInput
                            id="title"
                            type="text"
                            placeholder="Game title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description" className="text-[#8b90a0] text-sm mb-2 block">Description</Label>
                        <TextInput
                            id="description"
                            type="text"
                            placeholder="Game description"
                            value={description}
                            onChange={handleDescriptionChange}
                            required
                            className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                        />
                    </div>

                    {/* Genre & Engine */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="genre" className="text-[#8b90a0] text-sm mb-2 block">Genre</Label>
                            <TextInput
                                id="genre"
                                type="text"
                                placeholder="Genre"
                                value={genre}
                                onChange={handleGenreChange}
                                required
                                className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                            />
                        </div>
                        <div>
                            <Label htmlFor="engine" className="text-[#8b90a0] text-sm mb-2 block">Engine</Label>
                            <TextInput
                                id="engine"
                                type="text"
                                placeholder="Engine"
                                value={engine}
                                onChange={handleEngineChange}
                                required
                                className="bg-[#0d1020] border-[#1e2236] text-[#c8ccd8] placeholder-[#555c78]"
                            />
                        </div>
                    </div>

                    {/* Start Date */}
                    <div>
                        <Label className="text-[#8b90a0] text-sm mb-2 block">Start date</Label>
                        <Datepicker
                            value={startDate}
                            onChange={handleStartDateChange}
                            label=""
                        />
                        <div className="flex gap-2 mt-2">
                            <Button type="button" size="xs" color="light" onClick={() => setStartDate(new Date())}>
                                Today
                            </Button>
                            <Button type="button" size="xs" color="light" onClick={() => setStartDate(null)}>
                                Clear
                            </Button>
                        </div>
                    </div>

                    {/* Expected Release */}
                    <div>
                        <Label className="text-[#8b90a0] text-sm mb-2 block">Expected release date</Label>
                        <Datepicker
                            value={expectedRelease}
                            onChange={handleExpectedReleaseChange}
                            label=""
                            minDate={new Date()}
                        />
                        <div className="flex gap-2 mt-2">
                            <Button type="button" size="xs" color="light" onClick={() => setExpectedRelease(new Date())}>
                                Today
                            </Button>
                            <Button type="button" size="xs" color="light" onClick={() => setExpectedRelease(null)}>
                                Clear
                            </Button>
                        </div>
                    </div>

                    {/* Cover image */}
                    <div>
                        <Label htmlFor="cover-upload" className="text-[#8b90a0] text-sm mb-2 block">Cover image</Label>
                        <FileInput
                            id="cover-upload"
                            name="cover"
                            accept="image/png,image/jpeg"
                            onChange={handleCoverUpload}
                            disabled={uploading}
                        />
                        <HelperText className="mt-1 text-[#555c78] text-xs">JPG or PNG</HelperText>

                        {/* conditional render for when an image is uploading */}
                        {uploading && <p className="text-sm text-[#6b8cde] mt-2">Uploading...</p>}

                        {/* conditionally renders an image when a user uploads one */}
                        {coverUrl && (
                            <div className="relative inline-block mt-3">
                                <img
                                    src={coverUrl}
                                    alt="cover preview"
                                    className="w-32 h-20 object-cover rounded-lg border border-[#1e2236]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setCoverUrl(null)}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Game images */}
                    <div>
                        <Label htmlFor="images-upload" className="text-[#8b90a0] text-sm mb-2 block">Game images</Label>
                        <FileInput
                            id="images-upload"
                            name="images"
                            multiple
                            accept="image/png,image/jpeg"
                            onChange={handleImagesUpload}
                            disabled={uploadingMany}
                        />
                        <HelperText className="mt-1 text-[#555c78] text-xs">Up to 5 JPG or PNG images</HelperText>

                        {/* conditional render for when an image is uploading */}
                        {uploadingMany && <p className="text-sm text-[#6b8cde] mt-2">Uploading...</p>}

                        {/* conditionally renders an array of images that the user has uploaded */}
                        {imageUrls.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-3">
                                {imageUrls.map((url, i) => (
                                    <div key={i} className="relative">
                                        <img
                                            src={url}
                                            alt={`game image ${i + 1}`}
                                            className="w-24 h-16 object-cover rounded-lg border border-[#1e2236]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrls(imageUrls.filter((image, index) => index !== i))}//filters the url at position i
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full bg-[#6b8cde] text-white border-none mt-2"
                    >
                        {isEditing ? "Save changes" : "Create game"}
                    </Button>
                    {errorMessage && (
                        <p className="text-sm text-red-400 bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2">
                            {errorMessage}
                        </p>
                    )}

                </form>
            </div>
        </div>
    )
}

export default GameForm
