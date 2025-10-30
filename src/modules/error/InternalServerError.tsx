import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const InternalServerError = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-9xl font-bold text-destructive">500</h1>
        <h2 className="text-3xl font-semibold">Internal Server Error</h2>
        <p className="text-muted-foreground text-center max-w-[500px]">
          Oops! Something went wrong on our servers. We're working to fix the issue. Please try again later or contact our support team if the problem persists.
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline">
          <Link to={`${import.meta.env.VITE_INITIAL_URL}`}>Go Home</Link>
        </Button>
        <Button>
          <Link to="/support">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}

export default InternalServerError
