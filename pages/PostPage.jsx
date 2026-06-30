import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import service from "../services/service.config";
import { useParams } from "react-router-dom";


function PostPage() {
    const API_URL = import.meta.env.VITE_API_URL

    const { post } = useParams()

    const holderRef = useRef(null);
    const editorRef = useRef(null);
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState("")

    useEffect(() => {
        if (!post) return
        if (editorRef.current) return
        const loadPost = async () => {
            const response = await service.get(`/post/${post}`);
            const data = response.data
            console.log(data);
            setTitle(data.title)
            setContent(data.content)
        };
        loadPost();
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
            editor.destroy();
            editorRef.current = null;
            if (holderRef.current) {
                holderRef.current.innerHTML = "";
            }
        };
    }, [content]);



    return (
        <div>
            <h1>{title}</h1>
            <div ref={holderRef} />
        </div>
        // add conditional button verified by specific user
    )
}

export default PostPage