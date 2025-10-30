# useDebounce Custom Hook Documentation

A comprehensive guide to using the `useDebounce` custom hook for optimizing performance and reducing unnecessary API calls in React applications.

## 🎯 What is useDebounce?

The `useDebounce` hook is a custom React hook that delays the update of a value until a specified amount of time has passed since the last change. This is particularly useful for:

- **Search inputs** - Preventing excessive API calls while typing
- **Form validation** - Delaying validation until user stops typing
- **Window resize handlers** - Reducing the frequency of resize calculations
- **Scroll event handlers** - Optimizing scroll-based animations
- **Real-time filters** - Smoothing filter updates

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Basic Usage](#basic-usage)
3. [Advanced Usage](#advanced-usage)
4. [Hook API Reference](#hook-api-reference)
5. [Real-World Examples](#real-world-examples)
6. [Performance Benefits](#performance-benefits)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Installation
The `useDebounce` hook is already included in your project at `src/hooks/useDebounce.ts`.

### Basic Setup
```tsx
import { useDebounce } from '@/hooks/useDebounce'

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500) // 500ms delay

  // Use debouncedSearchTerm for API calls
}
```

## 🔍 Basic Usage

### Simple Search Input

```tsx
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // This effect will only run when debouncedSearchTerm changes
  // (300ms after the user stops typing)
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search API call
      searchUsers(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      <p>Searching for: {debouncedSearchTerm}</p>
    </div>
  )
}
```

### Form Validation

```tsx
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

function EmailValidationForm() {
  const [email, setEmail] = useState('')
  const debouncedEmail = useDebounce(email, 1000) // 1 second delay

  const [isValid, setIsValid] = useState(true)
  const [validationMessage, setValidationMessage] = useState('')

  useEffect(() => {
    if (debouncedEmail) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isValidEmail = emailRegex.test(debouncedEmail)
      
      setIsValid(isValidEmail)
      setValidationMessage(
        isValidEmail ? 'Email is valid!' : 'Please enter a valid email address'
      )
    }
  }, [debouncedEmail])

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className={isValid ? 'border-green-500' : 'border-red-500'}
      />
      {validationMessage && (
        <p className={isValid ? 'text-green-600' : 'text-red-600'}>
          {validationMessage}
        </p>
      )}
    </div>
  )
}
```

## ⚡ Advanced Usage

### Custom Delay Based on Input Length

```tsx
import { useState, useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

function SmartSearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Shorter delay for longer search terms
  const delay = useMemo(() => {
    if (searchTerm.length < 3) return 1000 // 1 second for short terms
    if (searchTerm.length < 6) return 500  // 500ms for medium terms
    return 200 // 200ms for long terms
  }, [searchTerm.length])
  
  const debouncedSearchTerm = useDebounce(searchTerm, delay)

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      performSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Smart search..."
    />
  )
}
```

### Multiple Debounced Values

```tsx
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

function AdvancedFilterComponent() {
  const [nameFilter, setNameFilter] = useState('')
  const [ageFilter, setAgeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Different delays for different filters
  const debouncedName = useDebounce(nameFilter, 300)
  const debouncedAge = useDebounce(ageFilter, 500)
  const debouncedCategory = useDebounce(categoryFilter, 200)

  useEffect(() => {
    // Apply all filters when any debounced value changes
    applyFilters({
      name: debouncedName,
      age: debouncedAge,
      category: debouncedCategory
    })
  }, [debouncedName, debouncedAge, debouncedCategory])

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        placeholder="Filter by name..."
      />
      <input
        type="number"
        value={ageFilter}
        onChange={(e) => setAgeFilter(e.target.value)}
        placeholder="Filter by age..."
      />
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All categories</option>
        <option value="tech">Technology</option>
        <option value="design">Design</option>
        <option value="marketing">Marketing</option>
      </select>
    </div>
  )
}
```

### Debounced Function Calls

```tsx
import { useState, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

function DebouncedFunctionComponent() {
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 500)

  const handleDebouncedAction = useCallback((value: string) => {
    console.log('Debounced action executed with:', value)
    // Perform expensive operation
    processData(value)
  }, [])

  useEffect(() => {
    if (debouncedValue) {
      handleDebouncedAction(debouncedValue)
    }
  }, [debouncedValue, handleDebouncedAction])

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Type to trigger debounced action..."
    />
  )
}
```

## 📖 Hook API Reference

### useDebounce Hook

```tsx
const debouncedValue = useDebounce<T>(value: T, delay?: number): T
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `T` | - | The value to debounce (can be any type) |
| `delay` | `number` | `500` | Delay in milliseconds before updating the debounced value |

#### Returns

| Type | Description |
|------|-------------|
| `T` | The debounced value (same type as input value) |

#### Generic Type Support

The hook supports any type of value:

```tsx
// String values
const debouncedString = useDebounce("hello", 300)

// Number values
const debouncedNumber = useDebounce(42, 500)

// Object values
const debouncedObject = useDebounce({ name: "John", age: 30 }, 1000)

// Array values
const debouncedArray = useDebounce([1, 2, 3], 200)

// Boolean values
const debouncedBoolean = useDebounce(true, 100)
```

## 🌟 Real-World Examples

### Search with API Integration

```tsx
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useCustomQuery } from '@/hooks/useTanstackQuery'

function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data: users, isLoading, error } = useCustomQuery(
    ['users', 'search', debouncedSearchTerm],
    () => searchUsers(debouncedSearchTerm),
    {
      enabled: debouncedSearchTerm.length >= 2, // Only search if 2+ characters
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
        className="w-full p-2 border rounded"
      />
      
      {isLoading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      
      <div className="mt-4">
        {users?.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
```

### Real-time Price Calculator

```tsx
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

function PriceCalculator() {
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(10)
  const debouncedQuantity = useDebounce(quantity, 300)
  const debouncedPrice = useDebounce(price, 300)

  const [total, setTotal] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    setIsCalculating(true)
    
    // Simulate complex calculation
    const calculateTotal = async () => {
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate delay
      const calculatedTotal = debouncedQuantity * debouncedPrice
      setTotal(calculatedTotal)
      setIsCalculating(false)
    }

    calculateTotal()
  }, [debouncedQuantity, debouncedPrice])

  return (
    <div className="space-y-4">
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          className="ml-2 p-1 border rounded"
        />
      </div>
      
      <div>
        <label>Price per unit:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min="0"
          step="0.01"
          className="ml-2 p-1 border rounded"
        />
      </div>
      
      <div>
        <strong>Total: ${total.toFixed(2)}</strong>
        {isCalculating && <span className="ml-2 text-gray-500">Calculating...</span>}
      </div>
    </div>
  )
}
```

### Window Resize Handler

```tsx
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

function ResponsiveComponent() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  const debouncedWindowSize = useDebounce(windowSize, 250)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Use debouncedWindowSize for expensive calculations
  const isMobile = debouncedWindowSize.width < 768
  const isTablet = debouncedWindowSize.width >= 768 && debouncedWindowSize.width < 1024
  const isDesktop = debouncedWindowSize.width >= 1024

  return (
    <div>
      <p>Window size: {debouncedWindowSize.width} x {debouncedWindowSize.height}</p>
      <p>Device type: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</p>
    </div>
  )
}
```

### Form Auto-Save

```tsx
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

function AutoSaveForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  })
  
  const debouncedFormData = useDebounce(formData, 2000) // 2 second delay

  useEffect(() => {
    const saveForm = async () => {
      try {
        await saveFormData(debouncedFormData)
        showSuccessToast('Form auto-saved successfully!')
      } catch (error) {
        showErrorToast('Failed to auto-save form')
      }
    }

    // Only save if form has content
    if (debouncedFormData.title || debouncedFormData.content) {
      saveForm()
    }
  }, [debouncedFormData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form className="space-y-4">
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label>Content:</label>
        <textarea
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          className="w-full p-2 border rounded"
          rows={5}
        />
      </div>
      
      <div>
        <label>Tags:</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Separate tags with commas"
        />
      </div>
    </form>
  )
}
```

### Scroll Position Tracker

```tsx
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

function ScrollTracker() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const debouncedScrollPosition = useDebounce(scrollPosition, 100)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Use debounced scroll position for expensive operations
  useEffect(() => {
    // Update progress bar or trigger animations
    updateScrollProgress(debouncedScrollPosition)
  }, [debouncedScrollPosition])

  return (
    <div>
      <p>Scroll position: {debouncedScrollPosition}px</p>
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
        style={{ 
          width: `${Math.min((debouncedScrollPosition / document.body.scrollHeight) * 100, 100)}%` 
        }}
      />
    </div>
  )
}
```

## ⚡ Performance Benefits

### Before Debouncing (Poor Performance)

```tsx
// ❌ Bad - API call on every keystroke
function BadSearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // This runs on EVERY keystroke!
    searchUsers(searchTerm) // Could be 20+ API calls for "hello world"
  }, [searchTerm])

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
```

### After Debouncing (Optimized Performance)

```tsx
// ✅ Good - API call only after user stops typing
function GoodSearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    // This runs only after 500ms of no typing
    searchUsers(debouncedSearchTerm) // Only 1 API call for "hello world"
  }, [debouncedSearchTerm])

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
```

### Performance Comparison

| Scenario | Without Debounce | With Debounce (500ms) |
|----------|------------------|----------------------|
| Typing "hello world" | 12 API calls | 1 API call |
| Window resize | 50+ calculations | 5-10 calculations |
| Scroll events | 100+ updates | 10-20 updates |
| Form validation | 20+ validations | 1-2 validations |

## 📋 Best Practices

### 1. Choose Appropriate Delay Times

```tsx
// ✅ Good - Appropriate delays for different use cases
const searchDelay = 300        // Search: Fast response
const validationDelay = 1000   // Validation: More time to think
const resizeDelay = 250        // Resize: Smooth performance
const scrollDelay = 100        // Scroll: Responsive feel
const saveDelay = 2000         // Auto-save: Don't save too often
```

### 2. Combine with Loading States

```tsx
function SearchWithLoading() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true)
      searchUsers(debouncedSearchTerm)
        .finally(() => setIsSearching(false))
    }
  }, [debouncedSearchTerm])

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {isSearching && <span>Searching...</span>}
    </div>
  )
}
```

### 3. Handle Edge Cases

```tsx
function RobustSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    // Don't search if term is too short
    if (debouncedSearchTerm.length < 2) return
    
    // Don't search if term is too long (might be spam)
    if (debouncedSearchTerm.length > 100) return
    
    // Perform search
    searchUsers(debouncedSearchTerm)
  }, [debouncedSearchTerm])
}
```

### 4. Use with Memoization

```tsx
import { useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

function OptimizedComponent() {
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 500)

  // Memoize expensive calculations
  const processedValue = useMemo(() => {
    return expensiveProcessing(debouncedValue)
  }, [debouncedValue])

  return <div>{processedValue}</div>
}
```

### 5. Clean Up on Unmount

```tsx
function CleanupExample() {
  const [data, setData] = useState('')
  const debouncedData = useDebounce(data, 1000)

  useEffect(() => {
    let isMounted = true

    const processData = async () => {
      const result = await expensiveOperation(debouncedData)
      if (isMounted) {
        setData(result)
      }
    }

    processData()

    return () => {
      isMounted = false
    }
  }, [debouncedData])
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Hook Not Working

```tsx
// ❌ Problem: Hook not debouncing
function ProblemComponent() {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 500)
  
  // This runs immediately, not debounced
  useEffect(() => {
    console.log('Value changed:', value) // Runs on every change
  }, [value]) // Wrong dependency

  // ✅ Solution: Use debounced value
  useEffect(() => {
    console.log('Debounced value changed:', debouncedValue) // Runs after delay
  }, [debouncedValue]) // Correct dependency
}
```

#### 2. Too Many Re-renders

```tsx
// ❌ Problem: Infinite re-renders
function BadComponent() {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 500)
  
  // This causes infinite re-renders
  useEffect(() => {
    setValue(debouncedValue) // Don't update the original value!
  }, [debouncedValue])

  // ✅ Solution: Don't update the original value
  useEffect(() => {
    // Use debouncedValue for side effects only
    performAction(debouncedValue)
  }, [debouncedValue])
}
```

#### 3. Wrong Delay Timing

```tsx
// ❌ Problem: Delay too short for user experience
const debouncedValue = useDebounce(value, 50) // Too fast

// ❌ Problem: Delay too long for responsiveness
const debouncedValue = useDebounce(value, 2000) // Too slow

// ✅ Solution: Choose appropriate delay
const debouncedValue = useDebounce(value, 300) // Just right
```

#### 4. Memory Leaks

```tsx
// ❌ Problem: Potential memory leak
function LeakyComponent() {
  const [data, setData] = useState('')
  const debouncedData = useDebounce(data, 1000)

  useEffect(() => {
    // No cleanup - potential memory leak
    fetchData(debouncedData)
  }, [debouncedData])

  // ✅ Solution: Add cleanup
  useEffect(() => {
    let isMounted = true

    const fetchDataAsync = async () => {
      const result = await fetchData(debouncedData)
      if (isMounted) {
        setData(result)
      }
    }

    fetchDataAsync()

    return () => {
      isMounted = false
    }
  }, [debouncedData])
}
```

### Debug Tips

1. **Check Hook Implementation**:
```tsx
function DebugComponent() {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 500)

  console.log('Original value:', value)
  console.log('Debounced value:', debouncedValue)

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

2. **Test Different Delays**:
```tsx
function DelayTester() {
  const [input, setInput] = useState('')
  const debounced300 = useDebounce(input, 300)
  const debounced500 = useDebounce(input, 500)
  const debounced1000 = useDebounce(input, 1000)

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type to test delays..."
      />
      <p>Original: {input}</p>
      <p>300ms: {debounced300}</p>
      <p>500ms: {debounced500}</p>
      <p>1000ms: {debounced1000}</p>
    </div>
  )
}
```

3. **Performance Monitoring**:
```tsx
function PerformanceMonitor() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    const startTime = performance.now()
    
    // Your expensive operation
    performSearch(debouncedSearchTerm)
    
    const endTime = performance.now()
    console.log(`Search took ${endTime - startTime}ms`)
  }, [debouncedSearchTerm])

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
```

## 🎉 Summary

The `useDebounce` hook provides:

- ✅ **Performance optimization** - Reduces unnecessary operations
- ✅ **Better user experience** - Smoother interactions
- ✅ **API call reduction** - Fewer server requests
- ✅ **TypeScript support** - Full type safety
- ✅ **Simple API** - Easy to use and understand
- ✅ **Flexible delays** - Customizable timing

### Quick Reference

```tsx
// Basic usage
const debouncedValue = useDebounce(value, 500)

// Common delay times
const searchDelay = 300        // Search inputs
const validationDelay = 1000   // Form validation
const resizeDelay = 250        // Window resize
const scrollDelay = 100        // Scroll events
const saveDelay = 2000         // Auto-save

// With useEffect
useEffect(() => {
  // Your side effect here
  performAction(debouncedValue)
}, [debouncedValue])
```

### When to Use

- **Search inputs** - Prevent excessive API calls
- **Form validation** - Delay validation until user stops typing
- **Window resize** - Reduce calculation frequency
- **Scroll events** - Optimize scroll-based animations
- **Real-time filters** - Smooth filter updates
- **Auto-save** - Save form data periodically
- **Price calculations** - Delay expensive computations

Start with a 300-500ms delay for most use cases and adjust based on your specific needs! 