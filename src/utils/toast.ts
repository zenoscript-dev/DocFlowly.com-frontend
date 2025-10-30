import { toast } from "@/hooks/useToast"

export const showToast = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "success",
    })
  },
  
  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    })
  },
  
  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "warning",
    })
  },
  
  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "info",
    })
  },
  
  default: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    })
  },
}

// Convenience functions for common scenarios
export const showSuccessToast = (message: string) => 
  showToast.success("Success", message)

export const showErrorToast = (message: string) => 
  showToast.error("Error", message)

export const showWarningToast = (message: string) => 
  showToast.warning("Warning", message)

export const showInfoToast = (message: string) => 
  showToast.info("Info", message) 