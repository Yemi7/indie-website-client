import { useEffect, useState } from "react"
import service from "../services/service.config"

function Home() {

    const [games, setGames] = useState([])
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getGames()
        getPosts()
    }, [])

    const getGames = async () => {
        try {
            const response = await service.get("/home/games")

            const data = response.data
            setGames(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getPosts = async () => {
        try {
            const response = await service.get("/home/posts")
            console.log(response.data);
            const data = response.data
            setPosts(data)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>this is the home page</h1>
            <div className="games mb-10">
                {
                    games.map((game) => {
                        return (
                            <div className="game-item" key={game._id}>
                                <h1>{game.title}</h1>
                                <p>{game.user.username}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className="posts">
                {
                    posts.map((post) => {
                        return (
                            <div className="game-item" key={post._id}>
                                <h1>{post.title}</h1>
                                <p>{post.user.username}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>

    )
}

export default Home