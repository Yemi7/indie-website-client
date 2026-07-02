import { useContext, useEffect, useState } from "react"
import service from "../services/service.config"
import { Button, Carousel } from "flowbite-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/auth.context"

function GameDetails() {

    const { gameId } = useParams()
    const { loggedUserId, isAdmin } = useContext(AuthContext)

    const [game, setGame] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingPost, setLoadingPost] = useState(true)
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        getGameDetails()
        getPostList()
    }, [])

    const getGameDetails = async () => {
        try {
            const gameDetailsRequest = await service.get(`/game/${gameId}`)
            setGame(gameDetailsRequest.data)
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    const getPostList = async () => {
        try {
            const postRequest = await service.get(`/post/${gameId}/by-game`)
            setPosts(postRequest.data)
            setLoadingPost(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteGame = async () => {
        try {
            await service.delete(`/game/${gameId}`)
            navigate("/game-list")
        } catch (error) {
            console.log(error)
        }
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

    if (loading || loadingPost) {
        return <h1 className="text-center mt-20 text-[#8b90a0]">Loading...</h1>
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">

            {/* Carousel */}
            <div className="rounded-xl overflow-hidden h-80 mb-8 border border-[#1e2236]">
                <Carousel>
                    {game.images.map((image, i) => (
                        <div key={i} className="relative h-full">
                            <img src={image} className="object-cover w-full h-full" alt={`image ${i + 1}`} />
                        </div>
                    ))}
                </Carousel>
            </div>

            {/* Game info */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                    <h1 className="text-3xl font-medium mb-2 text-[#f0f2f7]">{game.title}</h1>
                    <Link to={`/user-details/${game.user._id}`}>
                        <span className="inline-flex items-center gap-1 bg-[#0c1535] text-[#6b8cde] border border-[#1a2a55] text-sm px-3 py-1 rounded-md mb-4">
                            {game.user.username}
                        </span>
                    </Link>
                    <p className="text-[#8b90a0] leading-relaxed">{game.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 content-start">
                    <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3">
                        <p className="text-xs text-[#555c78] mb-1">Engine</p>
                        <p className="text-sm font-medium text-[#c8ccd8]">{game.engine}</p>
                    </div>
                    <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3">
                        <p className="text-xs text-[#555c78] mb-1">Genre</p>
                        <p className="text-sm font-medium text-[#c8ccd8]">{game.genre}</p>
                    </div>
                    <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3">
                        <p className="text-xs text-[#555c78] mb-1">Started</p>
                        <p className="text-sm font-medium text-[#c8ccd8]">{getDate(game.startDate)}</p>
                    </div>
                    <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3">
                        <p className="text-xs text-[#555c78] mb-1">Expected release</p>
                        <p className="text-sm font-medium text-[#c8ccd8]">{getDate(game.expectedRelease)}</p>
                    </div>

                    {/* Edit button — owner only */}
                    {loggedUserId === game.user._id && (
                        <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3 col-span-2 flex justify-center">
                            <Button color="alternative" onClick={() => navigate(`/game-edit/${game._id}/edit`)}>
                                Edit game
                            </Button>
                        </div>
                    )}

                    {/* Delete button — admin only */}
                    {isAdmin && (
                        <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3 col-span-2">
                            {confirmingDelete ? (
                                <div className="flex items-center justify-between bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2">
                                    <p className="text-xs text-red-400">Permanently delete this game and all its posts?</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setConfirmingDelete(false)}
                                            className="text-xs text-[#555c78] hover:text-[#c8ccd8] px-3 py-1 border border-[#2a3050] rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDeleteGame}
                                            className="text-xs text-white bg-red-700 hover:bg-red-600 px-3 py-1 rounded-lg"
                                        >
                                            Confirm delete
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmingDelete(true)}
                                    className="w-full text-sm text-red-500 hover:text-red-400 py-1"
                                >
                                    Delete game
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Posts header */}
            <div className="flex items-center justify-between border-b border-[#1e2236] pb-3 mb-4">
                <h2 className="text-xl font-medium text-[#f0f2f7]">Posts</h2>
                {loggedUserId === game.user._id && (
                    <Button color="alternative" size="sm" onClick={() => navigate(`/post/create-post/${gameId}`)}>
                        Create post
                    </Button>
                )}
            </div>

            {/* Posts list */}
            <div className="flex flex-col gap-3">
                {posts.map((post) => (
                    <div key={post._id} className="bg-[#0d1020] border border-[#1e2236] rounded-xl px-5 py-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium mb-1 text-[#dde0ea]">{post.title}</p>
                            <p className="text-sm text-[#555c78]">{getTimeElapsed(post.createdAt)}</p>
                        </div>
                        <Button size="sm" color="alternative" onClick={() => navigate(`/post/view-post/${post._id}`)}>
                            View post
                        </Button>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default GameDetails