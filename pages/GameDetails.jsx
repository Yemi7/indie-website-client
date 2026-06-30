import { useEffect, useState } from "react"
import service from "../services/service.config"
import { Carousel } from "flowbite-react"
import { Route, Routes, useParams } from "react-router-dom"

function GameDetails() {

    const { gameId } = useParams()

    const [game, setGame] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getGameDetails()
    }, [])

    const getGameDetails = async () => {
        const gameDetailsRequest = await service.get(`/game/${gameId}`)
        const gameDetails = gameDetailsRequest.data
        console.log(gameDetails);
        setGame(gameDetails)
        setLoading(false)
    }

    if (loading) {
        return <h1>Loading...</h1>

    }
    console.log(game.images)
    return (
        <div className="">
            <h1 className="text-5xl mb-10 text-center">This is the game details page</h1>
            <div className="mx-auto h-96 max-w-md">

                <Carousel>

                    {/* game.images.map((image, i) => {

                            return (
                                <img key={i}
                                    src={images}
                                    className="object-cover w-full h-full"
                                />
                            )
                        })*/ }
                        <div className="flex h-full items-center justify-center bg-green-500">slide 1</div>
                        <div className="flex h-full items-center justify-center bg-blue-500">slide 2</div>
                        <div className="flex h-full items-center justify-center bg-red-500">slide 3</div>
                    {/*<img src={game.images[0]}/>
                    <img src={game.images[1]}/>
                    <img src={game.images[2]}/>*/}

                </Carousel>
            </div>
            <div className="max-w-md mx-auto mt-10" >
                {game.images.map((image, i) => {
                    return (
                        <img
                            key={i}
                            src={image}
                            className="object-cover w-full h-full"
                        />

                    )
                })}
            </div>
            <div className="game-details">
                <h2>{game.title}</h2>
                {/* implement link to developer details using game.user.id */}
                <p>{game.user.username}</p>
                <p>{game.engine}</p>
                <p>Start Date: {new Date(game.startDate).toLocaleDateString("en-GB")}</p>
                <p>End Date: {new Date(game.expectedRelease).toLocaleDateString("en-GB")}</p>
            </div>
        </div>
    )
}

export default GameDetails