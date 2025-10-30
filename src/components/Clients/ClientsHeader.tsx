import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Filter, Plus, Rows, Search, Table as TableIcon } from 'lucide-react'

interface ClientsHeaderProps {
  query: string
  setQuery: (val: string) => void
  view: 'card' | 'table'
  setView: (val: 'card' | 'table') => void
  sidebarVisible: boolean
  onToggleSidebar: () => void
  onNewClient: () => void
}

export function ClientsHeader({
  query,
  setQuery,
  view,
  setView,
  sidebarVisible,
  onToggleSidebar,
  onNewClient,
}: ClientsHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Clients
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage and track your client relationships efficiently
          </p>
        </div>

        <Button 
          onClick={onNewClient} 
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90"
        >
          <Plus className="mr-2 h-5 w-5" /> New Client
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
          <Input
            placeholder="Search by company name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 pl-12 pr-4 text-base bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={onToggleSidebar}
            className="hidden lg:flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {sidebarVisible ? 'Hide' : 'Show'} Filters
          </Button>

          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v as 'card' | 'table')}
            className="bg-muted/30 p-1 rounded-lg border border-border/50"
          >
            <ToggleGroupItem
              value="card"
              aria-label="Card view"
              className="px-4 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm transition-all"
            >
              <Rows className="mr-2 h-4 w-4" /> Cards
            </ToggleGroupItem>
            <ToggleGroupItem
              value="table"
              aria-label="Table view"
              className="px-4 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm transition-all"
            >
              <TableIcon className="mr-2 h-4 w-4" /> Table
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}


