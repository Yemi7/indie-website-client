import { useNavigate } from "react-router-dom"

function NotFound() {

    const navigate = useNavigate()

    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen flex items-center justify-center px-6">
            {/* content */}
            <div className="text-center">
                <h1 className="text-8xl font-medium text-[#1e2236] mb-4">404</h1>
                <h2 className="text-2xl font-medium text-[#f0f2f7] mb-2">Page not found</h2>
                <p className="text-sm text-[#555c78] mb-8">The page you're looking for doesn't exist or has been moved.</p>
                {/* buttons */}
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-sm text-[#8b90a0] border border-[#2a3050] rounded-lg hover:bg-[#0d1020]"
                    >
                        Go back
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 text-sm text-white bg-[#6b8cde] hover:bg-[#5a7bcd] rounded-lg"
                    >
                        Go home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound