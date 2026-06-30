import { useEffect, useState } from "react"
import service from "../services/service.config"
import { Button, Card } from "flowbite-react";
import { Route, useNavigate } from "react-router-dom";

function GameList() {
    const navigate = useNavigate()

    // get the games
    const [gamesArr, setGamesArr] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getGames();
    }, [])

    const getGames = async () => {
        const gamesRequest = await service.get("/game")
        const gamesData = gamesRequest.data
        // gamesData contains an array of all the games in the database
        setGamesArr(gamesData)
        setLoading(false)
    }

    return (
        <div className="">
            <h1 className="text-5xl mb-10 text-center" >This is the game list page</h1>
            <div className="games-list flex gap-5 px-10">
                {
                    gamesArr.map((game) => {
                        return (
                            <Card
                                className="max-w-sm"
                                imgAlt="cover image for the game"
                                imgSrc={game.cover}
                                key={game._id}
                            >
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{game.title}</h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">Game Developer: {game.user.username}</p>
                                <Button color="purple" onClick={() => { navigate(`/game-details/${game._id}`) }}>See Details</Button>
                            </Card>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default GameList