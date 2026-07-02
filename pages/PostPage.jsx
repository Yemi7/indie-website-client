import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import service from "../services/service.config";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "flowbite-react";


function PostPage() {
    const API_URL = import.meta.env.VITE_API_URL

    const { post } = useParams()

    const holderRef = useRef(null);
    const editorRef = useRef(null);
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState("")
    const [comments, setComments] = useState([])
    const [gameId, setGameId] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        if (!post) return
        if (editorRef.current) return
        const loadPost = async () => {
            const response = await service.get(`/post/${post}`);
            const data = response.data
            console.log(data);
            setTitle(data.title)
            setContent(data.content)
            setGameId(data.game._id)
        };
        loadPost();
        getComments()
    }, [post]);

    useEffect(() => {
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
                // fix header font size being the same
                header: {
                    class: Header,
                    config: {
                        levels: [1, 2, 3, 4],
                        defaultLevel: 2
                    }
                },
                paragraph: {
                    inlineToolbar: ["link", "bold", "italic"],
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: `${API_URL}/upload/upload-editor`,
                        },
                        additionalRequestHeaders: {
                            authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                        features: {
                            caption: false,
                        }
                    },
                },
            },
        });

        editorRef.current = editor;
        return () => {
            if (editorRef.current?.destroy) {
                editorRef.current.destroy();
            }

            editorRef.current = null;

            if (holderRef.current) {
                holderRef.current.innerHTML = "";
            }
        };
    }, [content]);

    const getComments = async () => {
        try {
            const response = await service.get(`/comment/${post}/by-post`)
            const data = response.data

            setComments(data);
        } catch (error) {
            console.log(error)
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

                {/* Title */}
                <h1 className="text-4xl font-medium text-[#f0f2f7] mb-8">{title}</h1>

                {/* Post content */}
                <div className="bg-[#0d1020] border border-[#1e2236] rounded-xl p-6 mb-10">
                    <div ref={holderRef} />
                </div>

                {/* Comments */}
                <div>
                    <p className="text-xs font-medium text-[#555c78] uppercase tracking-widest mb-4">
                        Comments {comments.length > 0 && `· ${comments.length}`}
                    </p>

                    {comments.length === 0 ? (
                        <p className="text-sm text-[#555c78]">No comments yet.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="bg-[#0d1020] border border-[#1e2236] rounded-xl px-5 py-4"
                                >
                                    <p className="text-sm font-medium text-[#6b8cde] mb-1">
                                        {comment.user.username}
                                    </p>
                                    <p className="text-sm text-[#c8ccd8] leading-relaxed">
                                        {comment.description}
                                    </p>
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