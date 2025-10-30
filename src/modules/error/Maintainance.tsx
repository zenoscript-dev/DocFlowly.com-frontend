import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Maintenance = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <h1 className="text-9xl font-bold text-primary/20">503</h1>
          <h2 className="text-4xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">Under Maintenance</h2>
        </div>
        <p className="text-muted-foreground text-center max-w-[500px] mt-4">
          We're currently performing scheduled maintenance to improve our services. We'll be back online shortly. Thank you for your patience!
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline">
          <Link to={`${import.meta.env.VITE_INITIAL_URL}`}>Check Status</Link>
        </Button>
        <Button>
          <Link to="/support">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}

export default Maintenance
