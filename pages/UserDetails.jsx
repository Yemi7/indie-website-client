import { useEffect, useState } from "react"
import service from "../services/service.config";
import { useParams } from "react-router-dom";

function UserDetails() {

    const [userObj, setUserObj] = useState(null)
    const [userGames, setUserGames] = useState([])
    const [userComments, setUserComments] = useState([])
    const { user } = useParams()
    useEffect(() => {
        getUser()
        getUserGames()
        getUserComments()
    }, [])

    const getUser = async () => {
        try {
            const response = await service.get(`/user/user/${user}`)
            const data = response.data
            setUserObj(data)

        } catch (error) {
            console.log(error);
        }
    }

    const getUserGames = async () => {
        try {
            const response = await service.get(`/user/games/${user}/public`)
            const data = response.data
            setUserGames(data)
        } catch (error) {
            console.log(error);
        }
    }

    const getUserComments = async () => {
        try {
            const response = await service.get(`/user/comments/${user}/public`)
            const data = response.data
            setUserComments(data)
        } catch (error) {
            console.log(error);
        }
    }

    if (!userObj) {
        return <h1>LOADING</h1>
    }


    return (
        <div>
            <h1>This is the user details Page</h1>
            <div className="user-details">
                <img src={userObj.profilePic} alt="user avatar" className="w-50 h-auto" />
                <h1>{userObj.username}</h1>
                <p>{userObj.bio}</p>
            </div>
            <div className="user-games">
                <h1>Games made: {userGames.length}</h1>
                {
                    userGames.map((game) => {
                        return (
                            <div className="game-item" key={game._id}>
                                <h3>{game.title}</h3>
                                <p>{game.description}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className="user-comments">
                <h1>Comments made: {userComments.length}</h1>
                {
                    userComments.map((comment) => {
                        return (
                            <div className="comment-item" key={comment._id}>
                                <p>{comment.description}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        //add conditional button if loggedUserId = userId for user to edit their details
    )
}

export default UserDetails