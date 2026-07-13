import { useContext, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import service from "../services/service.config";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Spinner } from "flowbite-react";
import LoadingSpinner from "../components/LoadingSpinner";

function PostPage() {
    // base url used for editor image uploads
    const API_URL = import.meta.env.VITE_API_URL

    // authenticated user info for action permissions
    const { loggedUserId, isAdmin } = useContext(AuthContext)

    // current post id from the route params
    const { post } = useParams()

    // references the editor container and editor instance
    const holderRef = useRef(null);
    const editorRef = useRef(null);

    // stores the post content, title, and related ids
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState("")
    const [comments, setComments] = useState([])
    const [gameId, setGameId] = useState("")
    const [postUserId, setPostUserId] = useState(null)

    // manages comment input and editing state
    const [newComment, setNewComment] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editingText, setEditingText] = useState("")
    const [confirmingDeleteId, setConfirmingDeleteId] = useState(null)
    const [confirmingDeletePost, setConfirmingDeletePost] = useState(false)

    // tracks errors and loading states for the post and comments
    const [errorMessage, setErrorMessage] = useState("")
    const [loadingPost, setLoadingPost] = useState(true)
    const [loadingComments, setLoadingComments] = useState(true)

    // redirects the user after navigation actions or failures
    const navigate = useNavigate()

    // loads the post details when the route param changes
    useEffect(() => {
        if (!post) return
        const loadPost = async () => {
            try {
                console.log("Loading post...");
                const response = await service.get(`/post/${post}`);
                const data = response.data
                setTitle(data.title)
                setContent(data.content)
                setGameId(data.game._id)
                setPostUserId(data.user._id)


            } catch (error) {
                console.log(error);
                navigate("/error")
            }
        };
        loadPost();
        getComments()
    }, [post]);

    // renders the post content in read-only editor mode
    useEffect(() => {
        console.log(content);
        if (!holderRef.current || !content) return;
        if (editorRef.current) {
            editorRef.current.destroy();
            editorRef.current = null;
        }
        const editor = new EditorJS({
            holder: holderRef.current,
            readOnly: true,
            data: content,
            tools: {
                header: {
                    class: Header,
                    config: { levels: [1, 2, 3, 4], defaultLevel: 2 }
                },
                paragraph: {
                    inlineToolbar: ["link", "bold", "italic"],
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: { byFile: `${API_URL}/upload/upload-editor` },
                        additionalRequestHeaders: {
                            authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                        features: { caption: false }
                    },
                },
            },
        });

        editorRef.current = editor;

        editor.isReady.then(() => {
            setLoadingPost(false)
        })

        return () => {
            editorRef.current?.destroy();
            editorRef.current = null;
        };


    }, [content]);

    // fetches the comments for the current post
    const getComments = async () => {
        try {
            const response = await service.get(`/comment/${post}/by-post`)
            setComments(response.data);
            setLoadingComments(false)
        } catch (error) {
            console.log(error)
            console.log("comments error", error)
            navigate("/error")
        }
    }

    // adds a new comment to the current post
    const handleAddComment = async () => {
        if (!newComment.trim()) return
        setSubmitting(true)
        try {
            await service.post("/comment", {
                description: newComment,
                post
            })
            setNewComment("")
            await getComments()
            setSubmitting(false)

        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("You must be logged in to comment.")
                setSubmitting(false)
                return
            }
            setSubmitting(false)
            navigate("/error")
        }
    }

    // deletes a comment if the user has permission
    const handleDeleteComment = async (commentId) => {
        try {
            await service.delete(`/comment/${commentId}`)
            await getComments()
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErrorMessage("You are not allowed to do that.")
                return
            }
            navigate("/error")
        }
    }

    // updates an existing comment when the user edits it
    const handleEditComment = async (commentId) => {
        if (!editingText.trim()) return
        try {
            await service.patch(`/comment/${commentId}`, {
                description: editingText
            })
            setEditingCommentId(null)
            setEditingText("")
            await getComments()
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErrorMessage("You are not allowed to do that.")
                return
            }
            navigate("/error")
        }
    }

    // removes the current post and sends the user back to the game page
    const handleDeletePost = async () => {
        try {
            await service.delete(`/post/${post}`)
            navigate(`/game-details/${gameId}`)
        } catch (error) {
            console.log(error)
            navigate("/error")
        }
    }

    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen text-[#e2e4ea]">
            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* Back button */}
                <button
                    onClick={() => navigate(`/game-details/${gameId}`)}
                    className="flex items-center gap-2 text-sm text-[#555c78] hover:text-[#c8ccd8] mb-8"
                >
                    ← Back to game
                </button>

                {/* Title and post actions */}
                <div className="flex items-start justify-between gap-4 mb-8">
                    <h1 className="text-4xl font-medium text-[#f0f2f7]">{title}</h1>
                    <div className="flex gap-2 shrink-0 mt-1">
                        {loggedUserId === postUserId && (
                            <button
                                onClick={() => navigate(`/post/edit-post/${post}`)}
                                className="text-xs text-[#555c78] hover:text-[#c8ccd8] px-3 py-1 border border-[#2a3050] rounded-lg"
                            >
                                Edit post
                            </button>
                        )}
                        {isAdmin && (
                            confirmingDeletePost ? (
                                <div className="flex items-center gap-2 bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2">
                                    <p className="text-xs text-red-400">Delete this post?</p>
                                    <button
                                        onClick={() => setConfirmingDeletePost(false)}
                                        className="text-xs text-[#555c78] hover:text-[#c8ccd8] px-3 py-1 border border-[#2a3050] rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeletePost}
                                        className="text-xs text-white bg-red-700 hover:bg-red-600 px-3 py-1 rounded-lg"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmingDeletePost(true)}
                                    className="text-xs text-red-500 hover:text-red-400 px-3 py-1 border border-[#3d1515] rounded-lg"
                                >
                                    Delete post
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Post content */}
                <div className="bg-[#0d1020] border border-[#1e2236] rounded-xl p-6 mb-10">
                    <div ref={holderRef} />
                </div>

                {/* Comments section */}
                <div>
                    <p className="text-xs font-medium text-[#555c78] uppercase tracking-widest mb-4">
                        Comments {comments.length > 0 && `· ${comments.length}`}
                    </p>

                    {/* Add comment form */}
                    <div className="bg-[#0d1020] border border-[#1e2236] rounded-xl px-5 py-4 mb-4">
                        {errorMessage && (
                            <p className="text-sm text-red-400 bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2 mb-4">
                                {errorMessage}
                            </p>
                        )}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={3}
                            className="w-full bg-transparent outline-none text-sm text-[#c8ccd8] placeholder-[#555c78] resize-none"
                        />
                        <div className="flex justify-end mt-3 border-t border-[#1e2236] pt-3">
                            <button
                                onClick={handleAddComment}
                                disabled={submitting || !newComment.trim()}
                                className="px-4 py-2 bg-[#6b8cde] hover:bg-[#5a7bcd] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg"
                            >
                                {submitting ? "Posting..." : "Post comment"}
                            </button>
                        </div>
                    </div>

                    {comments.length === 0 ? (
                        <p className="text-sm text-[#555c78]">No comments yet.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="bg-[#0d1020] border border-[#1e2236] rounded-xl px-5 py-4"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <Link to={`/user-details/${comment.user._id}`} >
                                            <p className="text-sm font-medium text-[#6b8cde]">
                                                {comment.user.username}
                                            </p>
                                        </Link>

                                        {(loggedUserId === comment.user._id || isAdmin) && (
                                            <div className="flex gap-2">
                                                {loggedUserId === comment.user._id && (
                                                    <button
                                                        onClick={() => {
                                                            setEditingCommentId(comment._id)
                                                            setEditingText(comment.description)
                                                        }}
                                                        className="text-xs text-[#555c78] hover:text-[#c8ccd8]"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setConfirmingDeleteId(comment._id)}
                                                    className="text-xs text-red-500 hover:text-red-400"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Delete confirmation UI */}
                                    {confirmingDeleteId === comment._id && (
                                        <div className="flex items-center justify-between bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2 mt-2 mb-2">
                                            <p className="text-xs text-red-400">Delete this comment?</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setConfirmingDeleteId(null)}
                                                    className="text-xs text-[#555c78] hover:text-[#c8ccd8] px-3 py-1 border border-[#2a3050] rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDeleteComment(comment._id)
                                                        setConfirmingDeleteId(null)
                                                    }}
                                                    className="text-xs text-white bg-red-700 hover:bg-red-600 px-3 py-1 rounded-lg"
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Edit mode or display mode */}
                                    {editingCommentId === comment._id ? (
                                        <div>
                                            <textarea
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                rows={3}
                                                className="w-full bg-transparent border border-[#2a3050] rounded-lg p-2 outline-none text-sm text-[#c8ccd8] resize-none mt-1"
                                            />
                                            <div className="flex gap-2 justify-end mt-2">
                                                <button
                                                    onClick={() => setEditingCommentId(null)}
                                                    className="text-xs text-[#555c78] hover:text-[#c8ccd8] px-3 py-1 border border-[#2a3050] rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleEditComment(comment._id)}
                                                    className="text-xs text-white bg-[#6b8cde] hover:bg-[#5a7bcd] px-3 py-1 rounded-lg"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#c8ccd8] leading-relaxed">
                                            {comment.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default PostPage