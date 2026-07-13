import { useContext, useEffect, useState } from "react"
import service from "../services/service.config"
import { Route, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import LoadingSpinner from "../components/LoadingSpinner"


function GameList() {
    const navigate = useNavigate()

    // user id received from universal AuthContext
    const { loggedUserId } = useContext(AuthContext)

    // get the games
    const [gamesArr, setGamesArr] = useState([]);

    // async consideration state
    const [loading, setLoading] = useState(true)

    // On a new load it carries out the getGames function
    useEffect(() => {
        getGames();
    }, [])

    // fetches a list of all uploaded games in the database
    const getGames = async () => {
        try {
            const gamesRequest = await service.get("/game")
            const gamesData = gamesRequest.data
            // gamesData contains an array of all the games in the database

            // sets gamesArr with an array of all games
            setGamesArr(gamesData)

            // clears async consideration state
            setLoading(false)

        } catch (error) {
            console.log(error);
            navigate("/error")
        }
    }

    // if fetching the games, returns a spinner to let the user know it's loading
    if (loading) return <LoadingSpinner />

    return (
        <div className="min-h-screen px-4 py-10 text-gray-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Banner */}
                <div className="mb-10 rounded-3xl bg-slate-900/70 p-8 shadow-2xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">Discover</p>
                    <h1 className="text-4xl font-bold sm:text-5xl">Explore the indie games library</h1>
                    <p className="mt-4 max-w-2xl text-lg text-slate-300">
                        Browse titles, discover new creators, and jump into the details of each game.
                    </p>
                </div>

                {/* Games List */}
                <div className="flex flex-wrap justify-center gap-6">

                    {/* renders an array of all of the games, styled as cards */}
                    {
                        gamesArr.map((game) => {
                            return (
                                <>
                                    <div key={game._id} onClick={() => { navigate(`/game-details/${game._id}`) }} className="bg-[#0d1020] rounded-xl overflow-hidden w-80 min-h-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.05] hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)] [&>img]:h-48 [&>img]:object-cover hover:cursor-pointer">
                                        <img
                                            src={game.cover}
                                            alt={game.title}
                                            className="w-full h-36 object-cover"
                                        />
                                        <div className="p-3">
                                            <h5 className="text-2xl font-bold text-[#dde0ea] mb-1">{game.title}</h5>
                                            <p className="font-normal text-md text-[#555c78]">{game.user.username}</p>
                                        </div>
                                    </div>
                                </>

                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default GameList