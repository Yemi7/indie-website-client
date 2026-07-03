import { Spinner } from "flowbite-react"

function LoadingSpinner() {
    return (
        <div className="bg-[rgb(8,11,19)] min-h-screen flex flex-col items-center justify-center gap-4">
            <Spinner size="xl" color="info" />
            <p className="text-sm text-[#555c78]">Loading...</p>
        </div>
    )
}

export default LoadingSpinner