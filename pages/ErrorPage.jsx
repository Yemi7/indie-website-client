import { useNavigate } from "react-router-dom"

function ErrorPage() {

    const navigate = useNavigate()

    return (
        // full page
        <div className="bg-[rgb(8,11,19)] min-h-screen flex items-center justify-center px-6">
            <div className="text-center">

                {/* styled red exclamation mark */}
                <div className="w-16 h-16 rounded-full bg-[#1a0a0a] border border-[#3d1515] flex items-center justify-center mx-auto mb-6">
                    <span className="text-red-500 text-2xl">!</span>
                </div>

                {/* Generic error message */}
                <h1 className="text-2xl font-medium text-[#f0f2f7] mb-2">Something went wrong</h1>
                <p className="text-sm text-[#555c78] mb-8 max-w-sm mx-auto">
                    We ran into a problem processing your request. This is on our end — please try again.
                </p>

                {/* Button to return to home */}
                <div className="flex gap-3 justify-center">
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

export default ErrorPage