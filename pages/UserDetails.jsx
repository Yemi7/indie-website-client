import { useEffect, useState } from "react"
import service from "../services/service.config";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabItem } from "flowbite-react";

function UserDetails() {
    const { user } = useParams()

    const [userObj, setUserObj] = useState(null)
    const [userGames, setUserGames] = useState([])
    const [userComments, setUserComments] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getUser()
        getUserGames()
        getUserComments()
    }, [])

    const getUser = async () => {
        try {
            const response = await service.get(`/user/user/${user}`)
            setUserObj(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getUserGames = async () => {
        try {
            const response = await service.get(`/user/games/${user}/public`)
            setUserGames(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getUserComments = async () => {
        try {
            const response = await service.get(`/user/comments/${user}/public`)
            setUserComments(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getDate = (dateInput) => {
        const convertedDate = new Date(dateInput)
        return convertedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    }
    if (!userObj) return <h1 className="text-center mt-20 text-[#8b90a0]">Loading...</h1>

    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen text-[#e2e4ea]">

            <div className="user-details flex flex-col items-center py-12 px-6 border-b border-[#1e2236]">
                <img
                    src={userObj.profilePic}
                    alt="user avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#1e2236] mb-4"
                />
                <h1 className="text-2xl font-medium text-[#f0f2f7] mb-1">{userObj.username}</h1>
                <p className="text-sm text-[#555c78] mb-5">
                    <span>{userGames.length} games created</span>
                    <span className="mx-2">|</span>
                    <span>Joined {getDate(userObj.createdAt)}</span>
                </p>
                {userObj.bio && <p className="text-sm text-[#6b8cde]">{userObj.bio}</p>}
            </div>

            <div className="tabs max-w-4xl mx-auto px-6 py-6 flex justify-center">
                <Tabs theme={{
                    tablist: { base: "flex justify-center border-b border-[#1e2236]" }
                }} variant="underline" >
                    <TabItem title={`Games ${userGames.length}`}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {
                                userGames.map((game) => (
                                    <div onClick={() => { navigate(`/game-details/${game._id}`) }} key={game._id} className="bg-[#0d1020] border border-[#1e2236] rounded-xl overflow-hidden hover:cursor-pointer">
                                        <img
                                            src={game.cover}
                                            alt={game.title}
                                            className="w-full h-36 object-cover"
                                        />
                                        <div className="p-3">
                                            <p className="text-sm font-medium text-[#dde0ea] mb-1">{game.title}</p>
                                            <p className="text-xs text-[#555c78]">{game.engine}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </TabItem>

                    <TabItem title={`Comments ${userComments.length}`}>
                        <div className="flex flex-col gap-3">
                            {userComments.map((comment) => (
                                <div key={comment._id} className="bg-[#0d1020] border border-[#1e2236] rounded-xl px-5 py-4">
                                    <p className="text-sm text-[#c8ccd8] leading-relaxed">{comment.description}</p>
                                    <p className="text-xs text-[#555c78] mt-2">{getDate(comment.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    </TabItem>

                    <TabItem title="About">
                        <div className="bg-[#0d1020] border border-[#1e2236] rounded-xl px-5 py-4">
                            <p className="text-sm text-[#c8ccd8] leading-relaxed">
                                {userObj.bio || "This user hasn't added a bio yet."}
                            </p>
                        </div>
                    </TabItem>
                </Tabs>
            </div>

        </div>
    )
}

export default UserDetails