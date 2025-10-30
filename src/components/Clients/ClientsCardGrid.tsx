import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, FileText, Mail, PenLine, TrendingUp } from 'lucide-react'

interface ClientItem {
  id: string
  companyName: string
  email: string
  documents: number
  pending: number
  lastActiveDays: number
}

interface ClientsCardGridProps {
  items: ClientItem[]
  onClickItem: (id: string) => void
}

export function ClientsCardGrid({ items, onClickItem }: ClientsCardGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((c) => (
        <Card
          key={c.id}
          className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-card/95 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          onClick={() => onClickItem(c.id)}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Avatar className="h-14 w-14 ring-2 ring-border/50 group-hover:ring-primary/30 transition-all duration-300 relative z-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-lg font-bold">
                    {c.companyName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {c.companyName}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Documents</div>
                  <div className="text-sm font-semibold">{c.documents}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
                <PenLine className="h-4 w-4 text-orange-500 shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                  <div className="text-sm font-semibold">{c.pending}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Active {c.lastActiveDays}d ago</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-all"
              onClick={(e) => {
                e.stopPropagation()
                onClickItem(c.id)
              }}
            >
              View Details
              <TrendingUp className="ml-2 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


