import { useEffect, useState } from "react"
import service from "../services/service.config"
import { Button, Carousel } from "flowbite-react"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"

function GameDetails() {

    const { gameId } = useParams()

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
    return (
        <div className="">
            <h1 className="text-5xl mb-10 text-center">This is the game details page</h1>
            <div className="mx-auto h-96 max-w-md">

                <Carousel>
                    {
                        game.images.map((image, i) => {

                            return (
                                <div className="relative h-full">
                                    <img key={i}
                                        src={image}
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                            )
                        })
                    }
                </Carousel>
            </div>
            <div className="game-details mb-20">
                <h2>{game.title}</h2>
                <p>{game.description}</p>
                {/* implement link to developer details using game.user.id */}
                <p>{game.user.username}</p>
                <p>{game.engine}</p>
                <p>Start Date: {new Date(game.startDate).toLocaleDateString("en-GB")}</p>
                <p>End Date: {new Date(game.expectedRelease).toLocaleDateString("en-GB")}</p>
            </div>
            <div className="post-list">
                {
                    posts.map((post, i) => {
                        return (
                            <div className="post-item mb-5">
                                <h2>{post.title}</h2>
                                <Button onClick={() => { navigate(`/post/view-post/${post._id}`) }} >go to post</Button>
                                {/* add conditional to send post owner to edit post, and others to view post */}
                                {/* implement a post description in model */}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default GameDetails