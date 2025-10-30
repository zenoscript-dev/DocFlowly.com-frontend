import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomQuery } from '@/hooks/useTanstackQuery'
import { clientService } from '@/services/clients/clientService'
import { CalendarDays, FileText, Mail, PenLine, Phone, Pin } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function ClientDetails() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { data: clientData, isLoading, error } = useCustomQuery(
    ['clients', 'detail', id || ''],
    () => clientService.getOne(id!),
    {
      enabled: !!id,
    }
  )

  const client = clientData?.data

  // Format address
  const formatAddress = () => {
    if (!client) return ''
    const parts = [
      client.streetAddress,
      client.city,
      client.state,
      client.zipCode,
      client.country,
    ].filter(Boolean)
    return parts.join(', ') || 'No address provided'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/clients')}>← Back to Clients</Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>Edit</Button>
            <Button disabled>Send Document</Button>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Loading client...</div>
            <div className="text-sm text-muted-foreground">Please wait while we fetch client data</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/clients')}>← Back to Clients</Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>Edit</Button>
            <Button disabled>Send Document</Button>
          </div>
        </div>
        <Card className="border-dashed border-2 bg-destructive/10 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-destructive/10 rounded-full p-6">
                <FileText className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Error loading client</h3>
            <p className="text-muted-foreground mb-4">
              {(error as { message?: string })?.message || 'Failed to load client. Please try again.'}
            </p>
            <Button variant="outline" onClick={() => navigate('/clients')}>
              Back to Clients
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/clients')}>← Back to Clients</Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/clients/${id}/edit`)}>Edit</Button>
          <Button>Send Document</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{client.companyName}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {client.companyName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" /> {client.email}
              </div>
              {client.phone && (
                <div className="flex items-center text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" /> {client.phone}
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Pin className="mr-2 h-4 w-4" /> {formatAddress()}
              </div>
              {client.contactPersonName && (
                <div>Contact Person: <span className="font-medium">{client.contactPersonName}</span></div>
              )}
              {client.taxId && (
                <div>Tax ID: <span className="font-medium">{client.taxId}</span></div>
              )}
              {client.notes && (
                <div>
                  <div className="font-medium">Notes:</div>
                  <div className="text-muted-foreground">{client.notes}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats - TODO: Replace with real document stats when API is available */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<FileText className="h-6 w-6" />} label="Documents" value="0" />
        <StatCard icon={<PenLine className="h-6 w-6" />} label="Pending" value="0" />
        <StatCard icon={<Badge>✅</Badge>} label="Signed" value="0" />
        <StatCard icon={<CalendarDays className="h-6 w-6" />} label="Avg Time" value="N/A" />
      </div>

      {/* Documents History - TODO: Replace with real document data when API is available */}
      <Card>
        <CardHeader>
          <CardTitle>Documents History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">All</Button>
            <Button size="sm" variant="ghost">Invoices</Button>
            <Button size="sm" variant="ghost">Proposals</Button>
            <Button size="sm" variant="ghost">Contracts</Button>
          </div>
          <div className="space-y-3">
            <div className="text-center py-8 text-muted-foreground">
              No documents found for this client yet.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="text-primary/90">{icon}</div>
        <div>
          <div className="text-muted-foreground text-sm">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}
