import { useState } from "react"
import { useNavigate } from "react-router"
import service from "../services/service.config"
import { Button, Datepicker, Label, TextInput } from "flowbite-react";
import { v2 as cloudinary } from 'cloudinary'

function CreateGame() {
    // add description
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState(null)
    const [expectedRelease, setExpectedRelease] = useState(null)
    const [engine, setEngine] = useState("")
    const [cover, setCover] = useState("")
    const [images, setImages] = useState([])

    const handleTitleChange = (e) => setTitle(e.target.value)
    const handleEngineChange = (e) => setEngine(e.target.value)
    const handleStartDateChange = (date) => setStartDate(date)
    const handleExpectedReleaseChange = (date) => setExpectedRelease(date)
    // const handleCoverChange = (e) => setCover(e.target.value)
    // const handleImagesChange = (e) => setImages(e.target.value)

    const [creating, setCreating] = useState(true)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            title,
            startDate,
            expectedRelease,
            engine,
            cover,
            images,
        }
        try {
            const response = await service.post("/game", body)
            setCreating(false)
            navigate("/game-list")
        } catch (error) {
            console.log(error);
        }

    }



    return (
        <div>
            <h1 className="text-5xl text-center" >This is the create game forum</h1>
            <div className="flex min-h-screen flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4" >
                    <div>
                        <div className="mb-2 block ">
                            <Label htmlFor="title">Title</Label>
                        </div>
                        <TextInput
                            id="engine"
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
                            id="title"
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
                </form>
            </div>
        </div>

    )
}

export default CreateGame
