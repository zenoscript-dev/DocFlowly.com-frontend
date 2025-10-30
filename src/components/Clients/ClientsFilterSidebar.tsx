import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ClientsFilterSidebarProps {
  filter: 'all' | 'active' | 'inactive' | 'pending'
  setFilter: (val: 'all' | 'active' | 'inactive' | 'pending') => void
  sort: 'recent' | 'az' | 'za' | 'docs'
  setSort: (val: 'recent' | 'az' | 'za' | 'docs') => void
  filtersOpen: boolean
  setFiltersOpen: (open: boolean) => void
  totalCount: number
  pendingTotal: number
}

export function ClientsFilterSidebar({
  filter,
  setFilter,
  sort,
  setSort,
  filtersOpen,
  setFiltersOpen,
  totalCount,
  pendingTotal,
}: ClientsFilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <Card className="sticky top-6 border-border/50 shadow-lg bg-gradient-to-br from-card via-card/95 to-card backdrop-blur-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Filter & Sort
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="h-8 w-8 p-0 hover:bg-muted/50 transition-all"
            >
              {filtersOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            filtersOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <CardContent className="space-y-6 pb-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground/90">Filter by Status</Label>
              <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <SelectTrigger className="h-11 bg-background/50 border-border/50 hover:border-border transition-colors">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">With Pending Docs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground/90">Sort by</Label>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger className="h-11 bg-background/50 border-border/50 hover:border-border transition-colors">
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="az">Name (A-Z)</SelectItem>
                  <SelectItem value="za">Name (Z-A)</SelectItem>
                  <SelectItem value="docs">Most Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Clients</span>
                  <span className="font-semibold">{totalCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending Docs</span>
                  <span className="font-semibold text-orange-500">{pendingTotal}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </aside>
  )
}


