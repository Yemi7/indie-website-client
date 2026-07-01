import EditorJS from "@editorjs/editorjs"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import service from "../services/service.config"
import { Button } from "flowbite-react"
import { useParams } from "react-router-dom"
import Header from "@editorjs/header"
import ImageTool from "@editorjs/image"
import LinkTool from '@editorjs/link';


function PostEditor() {

    const { game, post } = useParams()

    const [title, setTitle] = useState("")
    const API_URL = `${import.meta.env.VITE_SERVER_URL}/api`
    const holderRef = useRef(null)
    const editorRef = useRef(null)
    // if there isn't a post we are creating
    const isEditing = Boolean(post)


    useEffect(() => {
        if (!holderRef.current) return;

        const initEditor = async () => {
            const editor = new EditorJS({
                holder: holderRef.current,
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

            await editor.isReady;

            if (post) {
                const response = await service.get(`/post/${post}`);
                const data = response.data
                setTitle(data.title);
                await editor.render(data.content);
            }
        };

        initEditor();

        return () => {
            editorRef.current?.destroy();
            editorRef.current = null;
        };

    }, [post]);




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

        } catch (error) {
            console.log(error);
        }

    }


    return (
        <div>
            <h1>This is the post page</h1>
            <div>
                <input
                    type="text"
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div ref={holderRef} />
                <Button onClick={handleSave}>
                    Save
                </Button>
            </div>
        </div>
    )
}

export default PostEditor