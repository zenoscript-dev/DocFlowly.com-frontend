import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const ForbiddenPage = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-9xl font-bold text-destructive">403</h1>
        <h2 className="text-3xl font-semibold">Forbidden Access</h2>
        <p className="text-muted-foreground text-center max-w-[500px]">
          Sorry, you don't have permission to access this resource. This area may be restricted or require additional privileges.
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

export default ForbiddenPage
