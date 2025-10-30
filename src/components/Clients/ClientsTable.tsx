import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText } from 'lucide-react'

interface ClientItem {
  id: string
  companyName: string
  email: string
  documents: number
  pending: number
  lastActiveDays: number
}

interface ClientsTableProps {
  items: ClientItem[]
  isLoading: boolean
  error: unknown
  onClickRow: (id: string) => void
}

export function ClientsTable({ items, isLoading, error, onClickRow }: ClientsTableProps) {
  if (isLoading) {
    return (
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
    )
  }

  if (error) {
    return (
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
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-muted/30">
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Documents</TableHead>
                <TableHead className="font-semibold">Pending</TableHead>
                <TableHead className="font-semibold">Last Active</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow
                  key={c.id}
                  className="group border-border/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent cursor-pointer transition-all duration-200"
                  onClick={() => onClickRow(c.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-border/50 group-hover:ring-primary/30 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                          {c.companyName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold group-hover:text-primary transition-colors">
                        {c.companyName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">{c.documents}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {c.pending > 0 ? (
                      <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                        {c.pending} Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-border/50">None</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.lastActiveDays} days ago
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        onClickRow(c.id)
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


