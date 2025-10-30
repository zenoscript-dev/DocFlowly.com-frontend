import { ClientsCardGrid } from '@/components/Clients/ClientsCardGrid'
import { ClientsFilterSidebar } from '@/components/Clients/ClientsFilterSidebar'
import { ClientsHeader } from '@/components/Clients/ClientsHeader'
import { ClientsTable } from '@/components/Clients/ClientsTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCustomQuery } from '@/hooks/useTanstackQuery'
import { clientService } from '@/services/clients/clientService'
import { FileText, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ClientWithStats {
  id: string
  companyName: string
  email: string
  updatedAt?: string
  documents: number
  pending: number
  lastActiveDays: number
}

export default function Clients() {
  const navigate = useNavigate()
  const [view, setView] = useState<'card' | 'table'>('card')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')
  const [sort, setSort] = useState<'recent' | 'az' | 'za' | 'docs'>('recent')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [sidebarVisible, setSidebarVisible] = useState(false)

  const queryParams = useMemo(() => ({ query, filter: filter === 'all' ? undefined : filter, sort }), [query, filter, sort])
  const { data: clientsData, isLoading, error } = useCustomQuery(
    ['clients', 'list', JSON.stringify(queryParams)],
    () => clientService.getAll({ ...queryParams, limit: 100 }),
    { enabled: true, staleTime: 30000 }
  )

  const clientsWithStats: ClientWithStats[] = useMemo(() => {
    const clients = (clientsData?.data || []) as Array<Partial<ClientWithStats> & { id: string; companyName: string; email: string; updatedAt?: string }>
    return clients.map(client => ({
      id: client.id,
      companyName: client.companyName,
      email: client.email,
      updatedAt: client.updatedAt,
      documents: 0,
      pending: 0,
      lastActiveDays: client.updatedAt
        ? Math.floor((new Date().getTime() - new Date(client.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    }))
  }, [clientsData?.data])

  const filtered: ClientWithStats[] = useMemo(() => {
    let list = clientsWithStats
    if (filter === 'pending') list = list.filter(c => c.pending > 0)
    return list
  }, [clientsWithStats, filter])

  return (
    <div className="space-y-8 pb-8">
      <ClientsHeader
        query={query}
        setQuery={setQuery}
        view={view}
        setView={setView}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
        onNewClient={() => navigate('/clients/new')}
      />

      <div className={`flex transition-all duration-300 ${sidebarVisible ? 'gap-6' : 'gap-0'}`}>
        {sidebarVisible && (
          <ClientsFilterSidebar
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            totalCount={filtered.length}
            pendingTotal={filtered.reduce((acc, c) => acc + c.pending, 0)}
          />
        )}

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <Card className="border-dashed border-2 bg-muted/20 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-primary/10 rounded-full p-6">
                    <FileText className="h-12 w-12 text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Loading clients...</h3>
                <p className="text-muted-foreground">Please wait while we fetch your clients</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-dashed border-2 bg-destructive/10 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-destructive/10 rounded-full p-6">
                    <FileText className="h-12 w-12 text-destructive" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Error loading clients</h3>
                <p className="text-muted-foreground mb-6">
                  {(error as Error)?.message || 'Failed to load clients. Please try again.'}
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/20 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-primary/10 rounded-full p-6">
                    <FileText className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">No clients found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {query
                    ? "We couldn't find any clients matching your search. Try adjusting your filters or search terms."
                    : "Get started by adding your first client to begin managing your relationships."}
                </p>
                <Button onClick={() => navigate('/clients/new')} size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all">
                  <Plus className="mr-2 h-5 w-5" /> Add Your First Client
                </Button>
              </CardContent>
            </Card>
          ) : view === 'card' ? (
            <ClientsCardGrid items={filtered} onClickItem={(id) => navigate(`/clients/${id}`)} />
          ) : (
            <ClientsTable items={filtered} isLoading={isLoading} error={error} onClickRow={(id) => navigate(`/clients/${id}`)} />
          )}
        </div>
      </div>
    </div>
  )
}
