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
                header: Header,
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
        <div>
            <h1>{title}</h1>
            <div ref={holderRef} />
            <div className="comments">
                {
                    comments.map((comment) => {
                        return (
                            <div className="comment-item" key={comment._id}>
                                <h3>{comment.user.username}</h3>
                                <p>{comment.description}</p>
                            </div>
                        )
                    })
                }
            </div>
            <Button onClick={() => (navigate(`/game-details/${gameId}`))}>Back</Button>
        </div>
        // add conditional button verified by specific user

    )
}

export default PostPage