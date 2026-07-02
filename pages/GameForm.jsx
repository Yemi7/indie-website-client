import { useEffect, useState } from "react"
import service from "../services/service.config"
import { Button, Datepicker, Label, TextInput, FileInput, HelperText } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";

function GameForm() {
    // add description
    const { id } = useParams()
    const isEditing = Boolean(id)
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState(null)
    const [expectedRelease, setExpectedRelease] = useState(null)
    const [engine, setEngine] = useState("")
    const [genre, setGenre] = useState("")
    const [coverUrl, setCoverUrl] = useState(null)
    const [imageUrls, setImageUrls] = useState([])
    const [description, setDescription] = useState("")
    const [uploading, setUploading] = useState(false)
    const [uploadingMany, setUploadingMany] = useState(false)

    const handleTitleChange = (e) => setTitle(e.target.value)
    const handleEngineChange = (e) => setEngine(e.target.value)
    const handleGenreChange = (e) => setGenre(e.target.value)
    const handleDescriptionChange = (e) => setDescription(e.target.value)
    const handleStartDateChange = (date) => setStartDate(date)
    const handleExpectedReleaseChange = (date) => setExpectedRelease(date)
    // const handleCoverChange = (e) => setCover(e.target.value)
    // const handleImagesChange = (e) => setImages(e.target.value)

    const [creating, setCreating] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (!isEditing) return
        fetchGame()
    }, [id, isEditing])

    const fetchGame = async () => {
        try {
            const response = await service.get(`/game/${id}`)
            const game = response.data
            console.log(response.data);

            setTitle(game.title)
            setEngine(game.engine)
            setGenre(game.genre || "")
            setDescription(game.description)
            setStartDate(game.startDate ? new Date(game.startDate) : null)
            setExpectedRelease(game.expectedRelease ? new Date(game.expectedRelease) : null)
            setCoverUrl(game.cover)
            setImageUrls(game.images || [])

        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();



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
            if (isEditing) {
                const response = await service.patch(`/game/${id}`, body)
            } else {

                const response = await service.post("/game", body)
            }
            setCreating(false)
            navigate("/game-list")
        } catch (error) {
            // need to create error handler similar to login and signup for incorrect image formats
            console.log(error);
        }

    }

    const handleCoverUpload = async (e) => {
        if (!e.target.files[0]) {
            return
        }

        setUploading(true)

        const uploadData = new FormData()
        uploadData.append("image", e.target.files[0])

        try {
            const response = await service.post("/upload/upload-one", uploadData)
            setCoverUrl(response.data.imageUrl)
            setUploading(false)
        } catch (error) {
            console.log(error);
        }

    }

    const handleImagesUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) {
            return
        }

        setUploadingMany(true)
        const uploadData = new FormData();

        files.forEach((file) => {
            uploadData.append("images", file)
        })

        try {
            const response = await service.post("/upload/upload-many", uploadData)
            console.log("New Added Image" + response.data);
            setImageUrls((prevUrls) => [
                ...prevUrls, ...response.data.imageUrls,
            ])
            setUploadingMany(false)
        } catch (error) {
            console.log(error);
        }
    }

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
                        {uploading && <p className="text-sm text-[#6b8cde] mt-2">Uploading...</p>}
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
                        {uploadingMany && <p className="text-sm text-[#6b8cde] mt-2">Uploading...</p>}
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

                </form>
            </div>
        </div>
    )
}

export default GameForm
