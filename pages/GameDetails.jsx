import { useContext, useEffect, useState } from "react"
import service from "../services/service.config"
import { Button, Carousel } from "flowbite-react"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/auth.context"

function GameDetails() {

    const { gameId } = useParams()
    const { loggedUserId } = useContext(AuthContext)

    const [game, setGame] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingPost, setLoadingPost] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        getGameDetails()
        getPostList()
    }, [])

    const getGameDetails = async () => {
        try {
            const gameDetailsRequest = await service.get(`/game/${gameId}`)
            const gameDetails = gameDetailsRequest.data
            setGame(gameDetails)
            setLoading(false)

        } catch (error) {
            console.log(error);
        }
    }

    const getPostList = async () => {
        try {
            const postRequest = await service.get(`/post/${gameId}/by-game`)
            const postData = postRequest.data
            console.log(postData);
            setPosts(postData)
            setLoadingPost(false)
        } catch (error) {
            console.log(error);
        }
    }

    if (loading || loadingPost) {
        return <h1>Loading...</h1>

    }

    const getDate = (dateInput) => {
        const convertedDate = new Date(dateInput)
        return convertedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    }

    const getTimeElapsed = (dateInput) => {
        const now = new Date()
        const created = new Date(dateInput);
        const diffMs = now - created;

        const mins = Math.floor(diffMs / 1000 / 60);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (mins < 60) return `${mins} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 365) return `${days} days ago`;
        return `${Math.floor(days / 365)} years ago`;
    }

    return (
        <div className="details-page max-w-4xl mx-auto px-6 py-8 ">

            <div className="rounded-md overflow-hidden h-80 mb-8 border border-gray-700">
                <Carousel>
                    {game.images.map((image, i) => (
                        <div key={i} className="relative h-full">
                            <img src={image} className="object-cover w-full h-full" alt={`image ${i + 1}`} />
                        </div>
                    ))}
                </Carousel>

            </div>

            <div className="details-grid grid grid-cols-2 gap-8 mb-10 px-6 py-8  ">
                <div className="dev-details col-start-1 col-end-2">
                    <h1 className="text-3xl font-medium mb-2 text-[#f0f2f7]">{game.title}</h1>
                    <p className="username-label inline-flex items-center gap-1 bg-[#0c1535] text-[#6b8cde] text-sm px-3 py-1 rounded-md mb-4">
                        {game.user.username}
                    </p>
                    <p className="description text-[#8b90a0] leading-relaxed">
                        {game.description}
                    </p>
                </div>
                <div className="game-details col-start-2 grid grid-cols-2 gap-2 content-start">
                    <div className="engine-label bg-[#0d1020]  rounded-lg p-3 col-start-1 col-end-2 ">
                        <p className="text-xs text-gray-500 mb-1">Engine</p>
                        <p className="text-sm font-semibold" >{game.engine}</p>
                    </div>
                    <div className="engine-label bg-[#0d1020]  rounded-lg p-3 col-start-2 col-end-3 ">
                        <p className="text-xs text-gray-500 mb-1">Genre</p>
                        <p className="text-sm font-semibold" >{game.genre}</p>
                    </div>
                    <div className="engine-label bg-[#0d1020]  rounded-lg p-3 col-start-1 col-end-2 ">
                        <p className="text-xs text-gray-500 mb-1">Started</p>
                        <p className="text-sm font-semibold" >{getDate(game.startDate)}</p>
                    </div>
                    <div className="engine-label bg-[#0d1020] rounded-lg p-3 col-start-2 col-end-3 ">
                        <p className="text-xs text-[#555c78] mb-1">Expected Release</p>
                        <p className="text-sm font-semibold" >{getDate(game.expectedRelease)}</p>
                    </div>
                </div>
            </div>
            <div className="post-header border-b border-[#1e2236] pb-3 mb-4 flex place-content-between">
                <h2 className="text-xl font-medium text-[#f0f2f7] inline-block ">Posts </h2>
                {loggedUserId === game.user._id &&
                    <Button className="inline-block text-xl" color="alternative" size="sm" onClick={() => { navigate(`/post/create-post/${gameId}`) }}> Create Post</Button>}
            </div>
            <div className="posts flex flex-col gap-3">
                {
                    posts.map((post) => {
                        return (

                            <div key={post._id} className="bg-[#0d1020]  rounded-xl px-5 py-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium mb-1">{post.title}</p>
                                    <p className="text-sm text-gray-500">{getTimeElapsed(post.createdAt)}</p>
                                </div>
                                <Button size="sm" color="alternative" onClick={() => { navigate(`/post/view-post/${post._id}`) }}>
                                    View post
                                </Button>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default GameDetails