import { useContext, useEffect, useState } from "react"
import service from "../services/service.config"
import { Button, Carousel, Spinner } from "flowbite-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/auth.context"
import LoadingSpinner from "../components/LoadingSpinner"

function GameDetails() {

    // id for a game recieved from the dynamic link
    const { gameId } = useParams()

    // logged in state and admin state recieved from universal AuthContext
    const { loggedUserId, isAdmin } = useContext(AuthContext)

    // game object and posts array recieved from backend 
    const [game, setGame] = useState(null)
    const [posts, setPosts] = useState([])

    // delete confirmation, conditionally changing the delete button element 
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    // async consideration states 
    const [loading, setLoading] = useState(true)
    const [loadingPost, setLoadingPost] = useState(true)

    const navigate = useNavigate();

    // upon first load, it fetches the game object and the array of posts
    useEffect(() => {
        getGameDetails()
        getPostList()
    }, [])

    // fetches the game object
    const getGameDetails = async () => {
        try {
            // fetches the game using the id in the dynamic link to the page, and sets the game object in the state
            const gameDetailsRequest = await service.get(`/game/${gameId}`)
            setGame(gameDetailsRequest.data)

            // clears the async consideration state
            setLoading(false)
        } catch (error) {
            // if a backend error occurs it navigates to the error screen
            console.log(error);
            navigate("/error")
        }
    }

    // fetches the posts linked to the specific game
    const getPostList = async () => {
        try {
            // fetches the posts using the game id in the dynamic link, and sets the posts state with the found list of posts
            const postRequest = await service.get(`/post/${gameId}/by-game`)
            setPosts(postRequest.data)

            // clears the async consideration state
            setLoadingPost(false)
        } catch (error) {

            // if a backend error occurs it navigates to the error screen
            console.log(error);
            navigate("/error")
        }
    }

    // deleting a game function
    const handleDeleteGame = async () => {
        try {

            // deletes a game using the id in the dynamic link to find it
            await service.delete(`/game/${gameId}`)

            // navigates to the list of games after deleting the game
            navigate("/game-list")
        } catch (error) {

            // if a backend error occurs it navigates to the error screen
            console.log(error)
            navigate("/error")
        }
    }

    const getDate = (dateInput) => {

        // recieves a date as a paramter and changes it to british date format
        const convertedDate = new Date(dateInput)
        return convertedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    }

    const getTimeElapsed = (dateInput) => {
        // current date
        const now = new Date()
        // date the target was created (in this case post)
        const created = new Date(dateInput);
        // subtracting both dates gives the difference in dates in milliseconds
        const diffMs = now - created;

        // calculation for each time unit
        const mins = Math.floor(diffMs / 1000 / 60);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);
        const years = Math.floor(days / 365)

        // conditionals for the most relevant time unit, and pluralized
        if (mins < 60) return `${mins} ${mins === 1 ? "minute" : "minutes"}  ago`;
        if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        if (days < 365) return `${days} ${days === 1 ? "day" : "days"} ago`;
        return `${years} ${years === 1 ? "year" : "years"} ago`;
    }

    // async consideration showing spinner while recieving game from backend
    if (loading || loadingPost) return <LoadingSpinner />

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">

            {/* Carousel */}
            <div className="rounded-xl overflow-hidden h-80 mb-8 border border-[#1e2236]">
                <Carousel>
                    {/* recieves the multiple images from the game object and makes an array of images in a carousel */}
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
                    {/* Header */}
                    <h1 className="text-3xl font-medium mb-2 text-[#f0f2f7]">{game.title}</h1>

                    {/* Link to user profile */}
                    <Link to={`/user-details/${game.user._id}`}>
                        <span className="inline-flex items-center gap-1 bg-[#0c1535] text-[#6b8cde] border border-[#1a2a55] text-sm px-3 py-1 rounded-md mb-4">
                            {game.user.username}
                        </span>
                    </Link>

                    {/* Game Description */}
                    <p className="text-[#8b90a0] leading-relaxed">{game.description}</p>
                </div>

                {/* Game Details Grid */}
                <div className="grid grid-cols-2 gap-2 content-start">

                    {/* Engine */}
                    <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3">
                        <p className="text-xs text-[#555c78] mb-1">Engine</p>
                        <p className="text-sm font-medium text-[#c8ccd8]">{game.engine}</p>
                    </div>

                    {/* Genre */}
                    <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3">
                        <p className="text-xs text-[#555c78] mb-1">Genre</p>
                        <p className="text-sm font-medium text-[#c8ccd8]">{game.genre}</p>
                    </div>

                    {/* Start date */}
                    <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3">
                        <p className="text-xs text-[#555c78] mb-1">Started</p>
                        <p className="text-sm font-medium text-[#c8ccd8]">{getDate(game.startDate)}</p>
                    </div>

                    {/* Expected Release date */}
                    <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3">
                        <p className="text-xs text-[#555c78] mb-1">Expected release</p>
                        <p className="text-sm font-medium text-[#c8ccd8]">{getDate(game.expectedRelease)}</p>
                    </div>

                    {/* Edit button — owner only */}
                    {/* Conditionally renders if the user id from the context matches the user in the game obj */}
                    {loggedUserId === game.user._id && (
                        <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3 col-span-2 flex justify-center">
                            <Button color="alternative" onClick={() => navigate(`/game-edit/${game._id}/edit`)}>
                                Edit game
                            </Button>
                        </div>
                    )}

                    {/* Delete button — admin only */}
                    {/* Conditionally renders the delete button if the Admin state is true in the context */}
                    {isAdmin && (
                        <div className="bg-[#0d1020] border border-[#1e2236] rounded-lg p-3 col-span-2">
                            {/* Conditionally renders a first step delete button, which changes the state to display the real delete button */}
                            {confirmingDelete ? (
                                <div className="flex items-center justify-between bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2">
                                    <p className="text-xs text-red-400">Permanently delete this game and all its posts?</p>
                                    <div className="flex gap-2">
                                        {/* cancel button, returns the state to false */}
                                        <button
                                            onClick={() => setConfirmingDelete(false)}
                                            className="text-xs text-[#555c78] hover:text-[#c8ccd8] px-3 py-1 border border-[#2a3050] rounded-lg"
                                        >
                                            Cancel
                                        </button>

                                        {/* real delete button */}
                                        <button
                                            onClick={handleDeleteGame}
                                            className="text-xs text-white bg-red-700 hover:bg-red-600 px-3 py-1 rounded-lg"
                                        >
                                            Confirm delete
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // the button sets the deleting state to true, which then renders the actual delete button
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

                {/* Conditionally checks if the loggedUserId in the context matches the user id in the game, and allows the user to make a post if true */}
                {loggedUserId === game.user._id && (
                    <Button color="alternative" size="sm" onClick={() => navigate(`/post/create-post/${gameId}`)}>
                        Create post
                    </Button>
                )}
            </div>

            {/* Posts list */}
            <div className="flex flex-col gap-3">
                {/* uses the fetched posts state to render an array of styled posts */}
                {posts.map((post) => (
                    // post card
                    <div key={post._id} className="bg-[#0d1020] border border-[#1e2236] rounded-xl px-5 py-4 flex items-center justify-between">

                        {/* post details */}
                        <div>
                            <p className="font-medium mb-1 text-[#dde0ea]">{post.title}</p>
                            <p className="text-sm text-[#555c78]">{getTimeElapsed(post.createdAt)}</p>
                        </div>

                        {/* view post button */}
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