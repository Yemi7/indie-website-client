import { useEffect, useState } from "react"
import service from "../services/service.config"
import bannerImg from "../src/assets/banner.png"
import LoadingSpinner from "../components/LoadingSpinner"

import {
    Avatar,
    Button,
    List,
    ListItem,
    Spinner,
    Timeline,
    TimelineBody,
    TimelineContent,
    TimelineItem,
    TimelinePoint,
    TimelineTime,
    TimelineTitle,
} from "flowbite-react";
import { HiCalendar } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate()

    // list of recent games and recent posts
    const [games, setGames] = useState([])
    const [posts, setPosts] = useState([])

    // async consideration states
    const [loadingGames, setLoadingGames] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(true)

    // fetches games and posts on first load
    useEffect(() => {
        getGames()
        getPosts()
    }, [])

    // fetches a list of recent games
    const getGames = async () => {
        try {

            const response = await service.get("/home/games")
            const data = response.data

            // sets games with a list of recent games, sorted with createdAt
            setGames(response.data)

            // clears async consideration
            setLoadingGames(false)
        } catch (error) {
            console.log(error)
            navigate("/error")
        }
    }

    // fetches a list of recent posts
    const getPosts = async () => {
        try {
            const response = await service.get("/home/posts")
            console.log(response.data);
            const data = response.data

            // sets posts with a list of the recent posts, sorted with createdAt
            setPosts(data)

            // clears async considerations
            setLoadingPosts(false)
        } catch (error) {
            console.log(error);
            navigate("/error")
        }
    }

    // changes the format of created date into a specified date format
    const getDate = (createdDate) => {
        const date = new Date(createdDate);

        const year = date.getFullYear();
        const month = date.toLocaleString("en-GB", { month: "long" });
        const day = date.getDate();
        const hours = String(date.getHours()).padStart(2, "0");
        const mins = String(date.getMinutes()).padStart(2, "0");

        return `${year} ${month} ${day}, ${hours}:${mins}`
    }

    // if any of the async states are true, it returns the spinner component
    if (loadingGames || loadingPosts) return <LoadingSpinner />

    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen text-[#e2e4ea]">

            {/* Banner */}
            <div
                className="min-h-[420px] banner-image bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center px-6 border-b border-[#1e2236] "
            >
                <h1 className="text-5xl font-medium text-[#f0f2f7] mb-3">Welcome to Indie Vault</h1>
                <p className="text-[#555c78] text-base">Discover and follow indie games in development</p>
            </div>

            {/* Main content */}
            <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 gap-12">

                {/* Posts timeline */}
                <div>
                    <p className="text-xs font-medium text-[#555c78] uppercase tracking-widest mb-6">Latest posts</p>
                    <Timeline>

                        {/* Renders the array of posts each styled in Flowbites Timeline */}
                        {posts.map((post) => (
                            <TimelineItem key={post._id}>
                                <TimelinePoint icon={HiCalendar} />
                                <TimelineContent>
                                    <TimelineTime className="text-[#555c78] text-xs">
                                        {getDate(post.createdAt)}
                                    </TimelineTime>
                                    <Link to={`/post/view-post/${post._id}`}>
                                        <TimelineTitle className="text-[#dde0ea] hover:text-purple-400 font-medium text-sm">
                                            {post.title}
                                        </TimelineTitle>
                                    </Link>
                                    <TimelineBody className="text-xs text-[#6b8cde]">
                                        {post.game?.title}
                                    </TimelineBody>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </div>

                {/* Games list */}
                <div>
                    <p className="text-xs font-medium text-[#555c78] uppercase tracking-widest mb-6">Recent games</p>
                    {/* Renders the array of games each styled with Flowbites List component */}
                    <List unstyled className="divide-y divide-[#1e2236]">
                        {games.map((game) => (
                            <ListItem key={game._id} className="py-3">
                                <div className="flex items-center gap-3">
                                    <Link to={`/user-details/${game.user._id}`}>
                                        <Avatar
                                            img={game.cover}
                                            alt="game cover"
                                            size="lg"

                                        />
                                    </Link>
                                    <div>
                                        <Link to={`/game-details/${game._id}`}>
                                            <p className="text-[#dde0ea] font-medium hover:text-purple-400 truncate">
                                                {game.title}
                                            </p>
                                        </Link>
                                        <Link to={`/user-details/${game.user._id}`}>
                                            <p className="text-sm text-[#555c78] hover:text-purple-400 truncate">
                                                {game.user.username}
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </div>

            </div>
        </div>
    )
}

export default Home