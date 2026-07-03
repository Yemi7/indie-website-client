import EditorJS from "@editorjs/editorjs"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import service from "../services/service.config"
import { Button } from "flowbite-react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "@editorjs/header"
import ImageTool from "@editorjs/image"
import LinkTool from '@editorjs/link';
import LoadingSpinner from "../components/LoadingSpinner"


function PostEditor() {

    const { game, post } = useParams()

    const isEditing = Boolean(post)
    const [title, setTitle] = useState("")
    const [gameId, setGameId] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const API_URL = `${import.meta.env.VITE_SERVER_URL}/api`
    const holderRef = useRef(null)
    const editorRef = useRef(null)
    // if there isn't a post we are creating
    const navigate = useNavigate()


    useEffect(() => {
        if (!holderRef.current) return;

        const initEditor = async () => {
            const editor = new EditorJS({
                holder: holderRef.current,
                tools: {
                    // fix header font size being the same
                    header: {
                        class: Header,
                        config: {
                            levels: [1, 2, 3, 4],
                            defaultLevel: 2
                        },
                        toolbox: [
                            { title: "Heading 1", data: { level: 1 } },
                            { title: "Heading 2", data: { level: 2 } },
                            { title: "Heading 3", data: { level: 3 } },
                            { title: "Heading 4", data: { level: 4 } },
                        ]
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

            await editor.isReady;

            if (post) {
                try {
                    const response = await service.get(`/post/${post}`);
                    const data = response.data
                    setTitle(data.title);
                    setGameId(data.game._id)
                    await editor.render(data.content);
                } catch (error) {
                    console.log(error);
                    navigate("/error")
                }
            }
        };

        initEditor();

        return () => {
            editorRef.current?.destroy();
            editorRef.current = null;
        };

    }, [post]);


    console.log("game param", game);

    const handleSave = async () => {
        try {
            const content = await editorRef.current.save()
            if (isEditing) {
                const response = await service.patch(`/post/${post}`, {
                    title,
                    content,
                });
                console.log("post updated: ", response.data);
            } else {

                const response = await service.post("/post", {
                    title,
                    content,
                    game
                })
                console.log("post saved: ", response.data);
            }
            navigate(`/game-details/${isEditing ? gameId : game}`)
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErrorMessage("You are not allowed to create a post for this game.")
                return
            }
            navigate("/error")
        }

    }



    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen text-[#e2e4ea] px-6 py-10">
            <div className="max-w-3xl mx-auto">

                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                    <span className="text-sm text-[#555c78]">
                        {isEditing ? "Edit post" : "New post"}
                    </span>
                    <Button onClick={handleSave} color="alternative" className="bg-[#6b8cde] text-white border-none">
                        Save post
                    </Button>
                </div>

                {/* Title */}
                <input
                    type="text"
                    placeholder="Post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#1e2236] outline-none text-3xl font-medium text-[#f0f2f7] placeholder-[#2a3050] pb-4 mb-6 focus:ring-0"
                />

                {/* Editor */}

                <div className="bg-[#0d1020] border border-[#1e2236] rounded-xl p-6 min-h-[420px]">
                    <div ref={holderRef} />
                </div>
                {errorMessage && (
                    <p className="text-sm text-red-400 bg-[#1a0a0a] border border-[#3d1515] rounded-lg px-3 py-2 mt-4">
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    )
}

export default PostEditor