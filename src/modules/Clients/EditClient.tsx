import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCustomMutation, useCustomQuery } from '@/hooks/useTanstackQuery'
import { useToast } from '@/hooks/useToast'
import { updateClientFormSchema, type UpdateClientFormData } from '@/models/clients/client.model'
import { clientService, type UpdateClientDto } from '@/services/clients/clientService'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Building2, FileText, Mail, MapPin, Phone, Save, Trash2, User } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditClient() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()

  // Fetch client data
  const { data: clientData, isLoading, error } = useCustomQuery(
    ['clients', 'detail', id || ''],
    () => clientService.getOne(id!),
    {
      enabled: !!id,
    }
  )

  const client = clientData?.data

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateClientFormData>({
    resolver: zodResolver(updateClientFormSchema),
    defaultValues: {
      companyName: client?.companyName || '',
      contactPersonName: client?.contactPersonName || '',
      email: client?.email || '',
      phone: client?.phone || '',
      streetAddress: client?.streetAddress || '',
      city: client?.city || '',
      state: client?.state || '',
      zipCode: client?.zipCode || '',
      country: client?.country || '',
      taxId: client?.taxId || '',
      notes: client?.notes || '',
    },
  })

  // Reset form when client data loads
  React.useEffect(() => {
    if (client) {
      reset({
        companyName: client.companyName,
        contactPersonName: client.contactPersonName || '',
        email: client.email,
        phone: client.phone || '',
        streetAddress: client.streetAddress || '',
        city: client.city || '',
        state: client.state || '',
        zipCode: client.zipCode || '',
        country: client.country || '',
        taxId: client.taxId || '',
        notes: client.notes || '',
      })
    }
  }, [client, reset])

  const updateClientMutation = useCustomMutation(
    (data: UpdateClientDto) => clientService.update(id!, data),
    {
      onSuccess: () => {
        toast({
          title: 'Client updated successfully',
          description: 'The client information has been updated.',
          variant: 'default',
        })
        navigate(`/clients/${id}`)
      },
      onError: (error) => {
        const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message 
          || (error as { message?: string })?.message 
          || 'Failed to update client. Please try again.'
        toast({
          title: 'Error updating client',
          description: errorMessage,
          variant: 'destructive',
        })
      },
      invalidateQueries: [['clients', 'list'], ['clients', 'detail', id || '']],
    }
  )

  const deleteClientMutation = useCustomMutation(
    (_: void) => clientService.delete(id!),
    {
      onSuccess: () => {
        toast({
          title: 'Client deleted successfully',
          description: 'The client has been removed from your list.',
          variant: 'default',
        })
        navigate('/clients')
      },
      onError: (error) => {
        const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message 
          || (error as { message?: string })?.message 
          || 'Failed to delete client. Please try again.'
        toast({
          title: 'Error deleting client',
          description: errorMessage,
          variant: 'destructive',
        })
      },
      invalidateQueries: [['clients', 'list']],
    }
  )

  const onSubmit = (data: UpdateClientFormData) => {
    // Convert empty strings to undefined for optional fields
    const updateData: UpdateClientDto = {
      companyName: data.companyName || undefined,
      email: data.email || undefined,
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

    updateClientMutation.mutate(updateData)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      deleteClientMutation.mutate(undefined as void)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading client...</div>
          <div className="text-sm text-muted-foreground">Please wait while we fetch client data</div>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2 text-destructive">Error loading client</div>
          <div className="text-sm text-muted-foreground mb-4">
            {(error as { message?: string })?.message || 'Failed to load client. Please try again.'}
          </div>
          <Button variant="outline" onClick={() => navigate('/clients')}>
            Back to Clients
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Modern Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Button
              variant="ghost"
              onClick={() => navigate(`/clients/${id}`)}
              className="mb-4 -ml-4 hover:bg-muted/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Client
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-primary to-primary/60" />
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Edit Client
              </h1>
            </div>
            <p className="text-muted-foreground text-sm ml-16">
              Update client information and manage their details
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
                onClick={() => navigate(`/clients/${id}`)}
                className="px-6 h-11"
                disabled={isSubmitting || updateClientMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="px-6 h-11 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all hover:scale-105"
                disabled={isSubmitting || updateClientMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting || updateClientMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar - Danger Zone */}
        <div className="lg:col-span-1">
          <Card className="border-destructive/30 shadow-lg bg-gradient-to-br from-card via-card/95 to-card backdrop-blur-xl sticky top-6">
            <CardHeader className="pb-4 border-b border-destructive/20">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once you delete a client, all associated documents will remain but the client relationship will be permanently removed from your system.
              </p>
              <Button 
                variant="destructive" 
                className="w-full h-11 hover:bg-destructive/90 transition-all"
                onClick={handleDelete}
                disabled={deleteClientMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteClientMutation.isPending ? 'Deleting...' : 'Delete Client'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
