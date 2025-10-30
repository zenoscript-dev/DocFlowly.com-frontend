# Toast Component Documentation

This project includes a comprehensive toast notification system built with shadcn/ui and Radix UI primitives.

## Features

- ✅ **Multiple Variants**: Success, Error, Warning, Info, and Default
- ✅ **Customizable**: Full control over title, description, and styling
- ✅ **Accessible**: Built with Radix UI for full accessibility
- ✅ **Responsive**: Works on all screen sizes
- ✅ **TypeScript**: Full TypeScript support
- ✅ **Easy to Use**: Simple API with convenience functions

## Quick Start

### 1. Basic Usage

```tsx
import { showSuccessToast, showErrorToast } from "@/utils/toast"

// Simple success toast
showSuccessToast("Operation completed successfully!")

// Simple error toast
showErrorToast("Something went wrong!")
```

### 2. Advanced Usage

```tsx
import { showToast } from "@/utils/toast"

// Custom success toast with title
showToast.success("Success", "Your data has been saved successfully")

// Custom error toast with title
showToast.error("Error", "Failed to save data. Please try again.")

// Custom warning toast
showToast.warning("Warning", "Please check your input before proceeding")

// Custom info toast
showToast.info("Info", "New features are available in the latest update")
```

### 3. Using the Hook Directly

```tsx
import { useToast } from "@/hooks/use-toast"

function MyComponent() {
  const { toast } = useToast()

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Operation completed successfully!",
      variant: "success",
    })
  }

  return (
    <button onClick={handleSuccess}>
      Show Success Toast
    </button>
  )
}
```

## Available Functions

### Convenience Functions (Recommended)

```tsx
// Simple functions for common use cases
showSuccessToast(message: string)
showErrorToast(message: string)
showWarningToast(message: string)
showInfoToast(message: string)
```

### Advanced Functions

```tsx
// Full control over toast content
showToast.success(title: string, description?: string)
showToast.error(title: string, description?: string)
showToast.warning(title: string, description?: string)
showToast.info(title: string, description?: string)
showToast.default(title: string, description?: string)
```

## Toast Variants

| Variant | Color Scheme | Use Case |
|---------|-------------|----------|
| `success` | Green | Successful operations, confirmations |
| `error` | Red | Errors, failures, critical issues |
| `warning` | Yellow | Warnings, cautions, validation issues |
| `info` | Blue | Information, updates, tips |
| `default` | Gray | General messages, neutral information |

## Customization

### Custom Styling

You can customize the toast appearance by modifying the `toastVariants` in `src/components/ui/toast.tsx`:

```tsx
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all...",
  {
    variants: {
      variant: {
        success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-100",
        // Add your custom variants here
      },
    },
  }
)
```

### Custom Duration

Modify the `TOAST_REMOVE_DELAY` constant in `src/hooks/use-toast.ts`:

```tsx
const TOAST_REMOVE_DELAY = 5000 // 5 seconds
```

## Integration Examples

### Form Submission

```tsx
import { showSuccessToast, showErrorToast } from "@/utils/toast"

const handleSubmit = async (data: FormData) => {
  try {
    await submitForm(data)
    showSuccessToast("Form submitted successfully!")
  } catch (error) {
    showErrorToast("Failed to submit form. Please try again.")
  }
}
```

### API Calls

```tsx
import { showToast } from "@/utils/toast"

const fetchData = async () => {
  try {
    const response = await api.getData()
    showToast.success("Data Loaded", `Successfully loaded ${response.data.length} items`)
  } catch (error) {
    showToast.error("API Error", "Failed to load data from server")
  }
}
```

### User Actions

```tsx
import { showWarningToast, showInfoToast } from "@/utils/toast"

const handleDelete = () => {
  showWarningToast("Are you sure you want to delete this item?")
  // Show confirmation dialog
}

const handleCopy = () => {
  navigator.clipboard.writeText(text)
  showInfoToast("Text copied to clipboard!")
}
```

## Accessibility

The toast component is built with Radix UI primitives and includes:

- ✅ Proper ARIA attributes
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ High contrast support

## Best Practices

1. **Keep messages concise**: Toast messages should be brief and to the point
2. **Use appropriate variants**: Match the toast variant to the message type
3. **Don't overuse**: Avoid showing too many toasts at once
4. **Provide context**: Include relevant information in the description
5. **Handle errors gracefully**: Always show user-friendly error messages

## Troubleshooting

### Toast not appearing?

1. Make sure the `<Toaster />` component is included in your App component
2. Check that you're importing the correct functions
3. Verify that the toast hook is properly initialized

### Styling issues?

1. Check that Tailwind CSS is properly configured
2. Verify that the toast variants are correctly defined
3. Ensure dark mode classes are applied if using dark theme

## Demo Component

Check out `src/components/ToastDemo.tsx` for a complete example of all toast variants and usage patterns. 