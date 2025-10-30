# useToast Custom Hook Documentation

A comprehensive guide to using the `useToast` custom hook for managing toast notifications in React applications.

## 🎯 What is useToast?

The `useToast` hook is a custom React hook that provides a simple and powerful way to manage toast notifications in your application. It's built on top of TanStack Query's state management and provides a clean API for showing success, error, warning, and info messages.

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Basic Usage](#basic-usage)
3. [Advanced Usage](#advanced-usage)
4. [Hook API Reference](#hook-api-reference)
5. [Toast Variants](#toast-variants)
6. [Real-World Examples](#real-world-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Installation
The `useToast` hook is already included in your project. Make sure you have the required dependencies:

```bash
npm install @radix-ui/react-toast class-variance-authority
```

### Setup
The hook is automatically available once you have the toast components set up in your app.

## 🔍 Basic Usage

### Simple Toast Notifications

```tsx
import { useToast } from '@/hooks/useToast'

function MyComponent() {
  const { toast } = useToast()

  const handleSuccess = () => {
    toast({
      title: "Success!",
      description: "Your action was completed successfully.",
      variant: "success"
    })
  }

  const handleError = () => {
    toast({
      title: "Error!",
      description: "Something went wrong. Please try again.",
      variant: "destructive"
    })
  }

  return (
    <div>
      <button onClick={handleSuccess}>Show Success Toast</button>
      <button onClick={handleError}>Show Error Toast</button>
    </div>
  )
}
```

### Using Convenience Functions

```tsx
import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from '@/utils/toast'

function UserActions() {
  const handleSave = async () => {
    try {
      await saveUserData()
      showSuccessToast("User data saved successfully!")
    } catch (error) {
      showErrorToast("Failed to save user data")
    }
  }

  const handleDelete = () => {
    showWarningToast("Are you sure you want to delete this item?")
  }

  const handleInfo = () => {
    showInfoToast("New features are available in the latest update")
  }

  return (
    <div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleInfo}>Info</button>
    </div>
  )
}
```

## ⚡ Advanced Usage

### Custom Toast with Actions

```tsx
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'

function UndoableAction() {
  const { toast } = useToast()

  const handleDelete = () => {
    toast({
      title: "Item deleted",
      description: "The item has been moved to trash.",
      variant: "default",
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            // Undo logic here
            console.log("Undoing delete...")
          }}
        >
          Undo
        </Button>
      )
    })
  }

  return (
    <button onClick={handleDelete}>Delete Item</button>
  )
}
```

### Toast with Custom Duration

```tsx
import { useToast } from '@/hooks/useToast'

function CustomDurationToast() {
  const { toast } = useToast()

  const showPersistentToast = () => {
    toast({
      title: "Important Notice",
      description: "This toast will stay visible longer.",
      variant: "warning",
      // Note: Duration is controlled by the toast system
      // You can modify TOAST_REMOVE_DELAY in use-toast.ts
    })
  }

  return (
    <button onClick={showPersistentToast}>Show Persistent Toast</button>
  )
}
```

### Programmatic Toast Control

```tsx
import { useToast } from '@/hooks/useToast'

function ControlledToast() {
  const { toast, dismiss } = useToast()

  const showToast = () => {
    const toastId = toast({
      title: "Processing...",
      description: "This toast can be dismissed programmatically.",
      variant: "info"
    })

    // Dismiss after 3 seconds
    setTimeout(() => {
      dismiss(toastId.id)
    }, 3000)
  }

  return (
    <button onClick={showToast}>Show Controlled Toast</button>
  )
}
```

## 📖 Hook API Reference

### useToast Hook

```tsx
const { toast, dismiss, toasts } = useToast()
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `toast` | `(options: ToastOptions) => ToastResult` | Function to show a toast |
| `dismiss` | `(toastId?: string) => void` | Function to dismiss toasts |
| `toasts` | `ToasterToast[]` | Array of current toasts |

### ToastOptions Interface

```tsx
interface ToastOptions {
  title?: string              // Toast title
  description?: string        // Toast description
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  action?: React.ReactElement // Optional action button
  className?: string          // Custom CSS classes
}
```

### ToastResult Interface

```tsx
interface ToastResult {
  id: string           // Unique toast ID
  dismiss: () => void  // Function to dismiss this specific toast
  update: (options: ToastOptions) => void // Function to update this toast
}
```

## 🎨 Toast Variants

### Available Variants

| Variant | Color Scheme | Use Case | Example |
|---------|-------------|----------|---------|
| `default` | Gray/Neutral | General information | "Processing your request..." |
| `success` | Green | Successful operations | "Data saved successfully!" |
| `error` | Red | Errors and failures | "Failed to save data" |
| `warning` | Yellow | Warnings and cautions | "Please check your input" |
| `info` | Blue | Information and tips | "New features available" |

### Visual Examples

```tsx
import { useToast } from '@/hooks/useToast'

function ToastVariantsDemo() {
  const { toast } = useToast()

  const showAllVariants = () => {
    // Default variant
    toast({
      title: "Default Toast",
      description: "This is a default toast notification.",
      variant: "default"
    })

    // Success variant
    toast({
      title: "Success!",
      description: "Your action was completed successfully.",
      variant: "success"
    })

    // Error variant
    toast({
      title: "Error!",
      description: "Something went wrong. Please try again.",
      variant: "destructive"
    })

    // Warning variant
    toast({
      title: "Warning!",
      description: "Please check your input before proceeding.",
      variant: "warning"
    })

    // Info variant
    toast({
      title: "Information",
      description: "Here's some useful information for you.",
      variant: "info"
    })
  }

  return (
    <button onClick={showAllVariants}>Show All Variants</button>
  )
}
```

## 🌟 Real-World Examples

### Form Submission with Toast Feedback

```tsx
import { useToast } from '@/hooks/useToast'
import { useState } from 'react'

function UserRegistrationForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const user = await response.json()
        toast({
          title: "Registration Successful!",
          description: `Welcome, ${user.name}! Your account has been created.`,
          variant: "success"
        })
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  )
}
```

### API Error Handling

```tsx
import { useToast } from '@/hooks/useToast'
import { useCustomQuery } from '@/hooks/useTanstackQuery'

function UserProfile({ userId }: { userId: string }) {
  const { toast } = useToast()

  const { data: user, error, isLoading } = useCustomQuery(
    ['user', userId],
    () => fetchUser(userId),
    {
      onError: (error) => {
        if (error.response?.status === 404) {
          toast({
            title: "User Not Found",
            description: "The requested user could not be found.",
            variant: "destructive"
          })
        } else if (error.response?.status === 403) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this user.",
            variant: "warning"
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to load user profile. Please try again.",
            variant: "destructive"
          })
        }
      }
    }
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading user</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### File Upload with Progress

```tsx
import { useToast } from '@/hooks/useToast'
import { useState } from 'react'

function FileUpload() {
  const { toast } = useToast()
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(progress)
        }
      })

      if (response.ok) {
        toast({
          title: "Upload Successful!",
          description: `${file.name} has been uploaded successfully.`,
          variant: "success"
        })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploadProgress(0)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }}
      />
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div>Uploading: {uploadProgress}%</div>
      )}
    </div>
  )
}
```

### Confirmation Dialogs with Toast

```tsx
import { useToast } from '@/hooks/useToast'
import { useState } from 'react'

function DeleteConfirmation({ itemId, itemName }: { itemId: string; itemName: string }) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Item Deleted",
          description: `${itemName} has been deleted successfully.`,
          variant: "success",
          action: (
            <button
              onClick={() => {
                // Undo logic here
                console.log("Undoing delete...")
              }}
              className="text-sm underline"
            >
              Undo
            </button>
          )
        })
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete item. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      {isDeleting ? 'Deleting...' : 'Delete Item'}
    </button>
  )
}
```

### Real-time Notifications

```tsx
import { useToast } from '@/hooks/useToast'
import { useEffect } from 'react'

function RealTimeNotifications() {
  const { toast } = useToast()

  useEffect(() => {
    // Simulate WebSocket connection
    const ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      
      switch (notification.type) {
        case 'success':
          toast({
            title: "Success",
            description: notification.message,
            variant: "success"
          })
          break
        case 'error':
          toast({
            title: "Error",
            description: notification.message,
            variant: "destructive"
          })
          break
        case 'warning':
          toast({
            title: "Warning",
            description: notification.message,
            variant: "warning"
          })
          break
        case 'info':
          toast({
            title: "Info",
            description: notification.message,
            variant: "info"
          })
          break
      }
    }

    return () => ws.close()
  }, [toast])

  return <div>Listening for real-time notifications...</div>
}
```

## 📋 Best Practices

### 1. Toast Message Guidelines

```tsx
// ✅ Good - Clear and concise
toast({
  title: "Success",
  description: "Your profile has been updated.",
  variant: "success"
})

// ❌ Bad - Too verbose
toast({
  title: "Profile Update Operation Completed Successfully",
  description: "The profile update operation that you initiated has been completed successfully without any errors.",
  variant: "success"
})
```

### 2. Appropriate Variant Usage

```tsx
// ✅ Good - Correct variant usage
const handleSuccess = () => {
  toast({
    title: "Success",
    description: "Operation completed successfully.",
    variant: "success"
  })
}

const handleError = () => {
  toast({
    title: "Error",
    description: "Something went wrong.",
    variant: "destructive"
  })
}

// ❌ Bad - Wrong variant usage
const handleError = () => {
  toast({
    title: "Error",
    description: "Something went wrong.",
    variant: "success" // Should be "destructive"
  })
}
```

### 3. Error Handling

```tsx
// ✅ Good - Comprehensive error handling
const handleApiCall = async () => {
  try {
    const response = await api.getData()
    toast({
      title: "Success",
      description: "Data loaded successfully.",
      variant: "success"
    })
  } catch (error) {
    if (error.response?.status === 404) {
      toast({
        title: "Not Found",
        description: "The requested resource was not found.",
        variant: "destructive"
      })
    } else if (error.response?.status === 403) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this resource.",
        variant: "warning"
      })
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    }
  }
}
```

### 4. Toast Frequency Management

```tsx
// ✅ Good - Prevent toast spam
const [lastToastTime, setLastToastTime] = useState(0)

const showToast = (options) => {
  const now = Date.now()
  if (now - lastToastTime > 2000) { // Minimum 2 seconds between toasts
    toast(options)
    setLastToastTime(now)
  }
}
```

### 5. Accessibility Considerations

```tsx
// ✅ Good - Accessible toast with proper ARIA
toast({
  title: "Success",
  description: "Your action was completed successfully.",
  variant: "success",
  // The toast component automatically handles ARIA attributes
})
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Toast Not Appearing

```tsx
// ❌ Problem: Toast not showing
function MyComponent() {
  const { toast } = useToast()
  
  const handleClick = () => {
    toast({ title: "Hello" }) // Missing Toaster component
  }
}

// ✅ Solution: Ensure Toaster is in your app
// In your App.tsx or layout component:
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <div>
      <YourApp />
      <Toaster /> {/* This is required */}
    </div>
  )
}
```

#### 2. Multiple Toasts Not Working

```tsx
// ❌ Problem: Only one toast shows at a time
// This is by design - the default limit is 1

// ✅ Solution: Modify the limit in use-toast.ts
const TOAST_LIMIT = 3 // Change from 1 to desired number
```

#### 3. Toast Styling Issues

```tsx
// ❌ Problem: Toast styles not applying
// Check that your CSS is properly imported

// ✅ Solution: Ensure proper CSS setup
// Make sure your toast component styles are included in your build
```

#### 4. Toast Not Dismissing

```tsx
// ❌ Problem: Toast stays visible forever
// Check the TOAST_REMOVE_DELAY setting

// ✅ Solution: Adjust the delay in use-toast.ts
const TOAST_REMOVE_DELAY = 5000 // 5 seconds instead of default
```

### Debug Tips

1. **Check Toast State**:
```tsx
function DebugToasts() {
  const { toasts } = useToast()
  
  console.log('Current toasts:', toasts)
  
  return (
    <div>
      <p>Active toasts: {toasts.length}</p>
      {toasts.map(toast => (
        <div key={toast.id}>
          {toast.title} - {toast.variant}
        </div>
      ))}
    </div>
  )
}
```

2. **Test Toast Variants**:
```tsx
function ToastTester() {
  const { toast } = useToast()
  
  const testAllVariants = () => {
    const variants = ['default', 'success', 'destructive', 'warning', 'info']
    
    variants.forEach((variant, index) => {
      setTimeout(() => {
        toast({
          title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
          description: `This is a ${variant} toast notification.`,
          variant: variant as any
        })
      }, index * 1000)
    })
  }
  
  return <button onClick={testAllVariants}>Test All Variants</button>
}
```

## 🎉 Summary

The `useToast` hook provides:

- ✅ **Simple API** for showing toast notifications
- ✅ **Multiple variants** for different message types
- ✅ **Customizable** appearance and behavior
- ✅ **Accessible** by default
- ✅ **TypeScript support** for type safety
- ✅ **Integration** with your existing toast system

### Quick Reference

```tsx
// Basic usage
const { toast } = useToast()
toast({ title: "Hello", description: "World", variant: "success" })

// Convenience functions
showSuccessToast("Success message")
showErrorToast("Error message")
showWarningToast("Warning message")
showInfoToast("Info message")

// With actions
toast({
  title: "Action Required",
  description: "Please confirm your action.",
  action: <button>Confirm</button>
})
```

Start with the basic `toast()` function and explore the advanced features as your application grows! 