import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCustomMutation } from '@/hooks/useTanstackQuery'
import { useToast } from '@/hooks/useToast'
import { createClientFormSchema, type CreateClientFormData } from '@/models/clients/client.model'
import { clientService, type CreateClientDto } from '@/services/clients/clientService'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Building2, FileText, Mail, MapPin, Phone, Save, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export default function NewClient() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientFormSchema),
    defaultValues: {
      companyName: '',
      contactPersonName: '',
      email: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      taxId: '',
      notes: '',
    },
  })

  const createClientMutation = useCustomMutation(
    (data: CreateClientDto) => clientService.create(data),
    {
      onSuccess: () => {
        toast({
          title: 'Client created successfully',
          description: 'The client has been added to your list.',
          variant: 'default',
        })
        navigate('/clients')
      },
      onError: (error) => {
        const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message 
          || (error as { message?: string })?.message 
          || 'Failed to create client. Please try again.'
        toast({
          title: 'Error creating client',
          description: errorMessage,
          variant: 'destructive',
        })
      },
      invalidateQueries: [['clients', 'list']],
    }
  )

  const onSubmit = (data: CreateClientFormData) => {
    // Convert empty strings to undefined for optional fields
    const clientData: CreateClientDto = {
      companyName: data.companyName,
      email: data.email,
      contactPersonName: data.contactPersonName || undefined,
      phone: data.phone || undefined,
      streetAddress: data.streetAddress || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      zipCode: data.zipCode || undefined,
      country: data.country || undefined,
      taxId: data.taxId || undefined,
      notes: data.notes || undefined,
    }

    createClientMutation.mutate(clientData)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Modern Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Button
              variant="ghost"
              onClick={() => navigate('/clients')}
              className="mb-4 -ml-4 hover:bg-muted/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-primary to-primary/60" />
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Add New Client
              </h1>
            </div>
            <p className="text-muted-foreground text-sm ml-16">
              Create a new client and add them to your list
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-border/50 shadow-lg bg-gradient-to-br from-card via-card/95 to-card backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyName" className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="companyName"
                    className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                    placeholder="Enter company name"
                    {...register('companyName')}
                  />
                  {errors.companyName && (
                    <span className="text-destructive text-sm">
                      {errors.companyName.message}
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName" className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Contact Person
                  </Label>
                  <Input 
                    id="contactPersonName"
                    className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                    placeholder="Contact person name"
                    {...register('contactPersonName')}
                  />
                  {errors.contactPersonName && (
                    <span className="text-destructive text-sm">
                      {errors.contactPersonName.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Phone Number
                  </Label>
                  <Input 
                    id="phone"
                    className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <span className="text-destructive text-sm">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="email"
                    type="email" 
                    className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                    placeholder="client@company.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <span className="text-destructive text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="border-border/50 shadow-lg bg-gradient-to-br from-card via-card/95 to-card backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="streetAddress" className="text-sm font-semibold">Street Address</Label>
                <Input 
                  id="streetAddress"
                  className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                  placeholder="123 Main Street"
                  {...register('streetAddress')}
                />
                {errors.streetAddress && (
                  <span className="text-destructive text-sm">
                    {errors.streetAddress.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                  <Input 
                    id="city"
                    className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                    placeholder="City"
                    {...register('city')}
                  />
                  {errors.city && (
                    <span className="text-destructive text-sm">
                      {errors.city.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-semibold">State/Province</Label>
                  <Input 
                    id="state"
                    className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                    placeholder="State"
                    {...register('state')}
                  />
                  {errors.state && (
                    <span className="text-destructive text-sm">
                      {errors.state.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-sm font-semibold">ZIP/Postal Code</Label>
                  <Input 
                    id="zipCode"
                    className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                    placeholder="12345"
                    {...register('zipCode')}
                  />
                  {errors.zipCode && (
                    <span className="text-destructive text-sm">
                      {errors.zipCode.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-semibold">Country</Label>
                  <Input 
                    id="country"
                    className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                    placeholder="Country"
                    {...register('country')}
                  />
                  {errors.country && (
                    <span className="text-destructive text-sm">
                      {errors.country.message}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-border/50 shadow-lg bg-gradient-to-br from-card via-card/95 to-card backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="taxId" className="text-sm font-semibold">Tax ID <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <Input 
                  id="taxId"
                  className="h-12 bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" 
                  placeholder="Tax identification number"
                  {...register('taxId')}
                />
                {errors.taxId && (
                  <span className="text-destructive text-sm">
                    {errors.taxId.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold">Notes</Label>
                <Textarea 
                  id="notes"
                  className="min-h-[120px] bg-background/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all resize-none" 
                  placeholder="Add any additional notes or information about this client..."
                  {...register('notes')}
                />
                {errors.notes && (
                  <span className="text-destructive text-sm">
                    {errors.notes.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => navigate('/clients')}
              className="px-6 h-11"
              disabled={isSubmitting || createClientMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-6 h-11 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all hover:scale-105"
              disabled={isSubmitting || createClientMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting || createClientMutation.isPending ? 'Saving...' : 'Save Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
