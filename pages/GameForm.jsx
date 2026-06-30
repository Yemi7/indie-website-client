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
    const [coverUrl, setCoverUrl] = useState(null)
    const [imageUrls, setImageUrls] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadingMany, setUploadingMany] = useState(false)

    const handleTitleChange = (e) => setTitle(e.target.value)
    const handleEngineChange = (e) => setEngine(e.target.value)
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
        <div>
            <h1 className="text-5xl text-center" >This is the game form</h1>
            <div className="flex min-h-screen flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4" >
                    <div>
                        <div className="mb-2 block ">
                            <Label htmlFor="title">Title</Label>
                        </div>
                        <TextInput
                            id="title"
                            type="text"
                            placeholder="Game Title"
                            value={title}
                            onChange={handleTitleChange}
                            required

                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="Engine">Engine</Label>
                        </div>
                        <TextInput
                            id="engine"
                            type="text"
                            placeholder="Engine"
                            value={engine}
                            onChange={handleEngineChange}
                            required

                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="mb-2 block">
                            <Label htmlFor="start-date">Start Date</Label>
                        </div>
                        {/* Flowbite datepicker causing warning */}
                        <Datepicker
                            value={startDate}
                            onChange={handleStartDateChange}
                            label=""

                        />
                        <div className="buttons flex gap-2">

                            <Button type="button" size="xs" onClick={() => setStartDate(new Date())}>
                                Set to Today
                            </Button>
                            <Button type="button" size="xs" onClick={() => setStartDate(null)}>
                                Clear
                            </Button>

                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="mb-2 block">
                            <Label htmlFor="end-date">Expected Release Date</Label>
                        </div>
                        {/* Flowbite datepicker causing warning */}
                        <Datepicker
                            value={expectedRelease}
                            onChange={handleExpectedReleaseChange}
                            label=""
                            minDate={new Date()}

                        />
                        <div className="buttons flex gap-2">

                            <Button type="button" size="xs" onClick={() => setExpectedRelease(new Date())}>
                                Set to Today
                            </Button>
                            <Button type="button" size="xs" onClick={() => setExpectedRelease(null)}>
                                Clear
                            </Button>

                        </div>
                    </div>
                    <div> {/* need to implement a remove image function */}
                        <Label className="mb-2 block" htmlFor="file-upload-helper-text">
                            Upload file
                        </Label>
                        <FileInput
                            id="file-upload-helper-text"
                            name="cover"
                            accept="image/png,image/jpeg"
                            onChange={handleCoverUpload}
                            disabled={uploading}
                        />
                        <HelperText className="mt-1">JPG or PNG.</HelperText>
                        {uploading ? <h3>... uploading image</h3> : null}

                        {coverUrl ? (<div><img src={coverUrl} alt="img" width={200} /></div>) : null}
                    </div>
                    <div> {/* need to implement a remove image function */}
                        <Label className="mb-2 block" htmlFor="images-upload">
                            Game Images
                        </Label>

                        <FileInput
                            id="images-upload"
                            name="images"
                            multiple
                            accept="image/png,image/jpeg"
                            onChange={handleImagesUpload}
                            disabled={uploading}
                        />

                        <HelperText className="mt-1">
                            Upload up to 5 JPG or PNG images.
                        </HelperText>

                        {imageUrls.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-4">
                                {imageUrls.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        width={150}
                                    />
                                ))}
                            </div>
                        )}
                        {uploadingMany ? <h3>... uploading image</h3> : null}
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </div>

    )
}

export default GameForm
