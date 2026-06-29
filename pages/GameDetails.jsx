import { useEffect, useState } from "react"
import { useParams } from "react-router"
import service from "../services/service.config"
import { Carousel } from "flowbite-react"

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

    return (
        <div className="">
            <h1 className="text-5xl mb-10 text-center">This is the game details page</h1>
            <div className="mx-auto h-96 max-w-md">
                <Carousel className="max-w-md">
                    {
                        game.images.map((image) => {
                            return (
                                <img key={image} src={image} />
                            )
                        })
                    }
                </Carousel>
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