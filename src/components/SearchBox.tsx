import { useDebounce } from '@/hooks/useDebounce'
import * as React from 'react'

interface SearchBoxProps {
  onSearch: (searchTerm: string) => void
  placeholder?: string
  buttonText?: string
  showButton?: boolean
  debounceDelay?: number
  className?: string
  disableAutoSearch?: boolean
}

export function SearchBox({
  onSearch,
  placeholder = 'Search...',
  buttonText = 'Search',
  showButton = true,
  debounceDelay = 500,
  className = '',
  disableAutoSearch = false
}: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay)

  React.useEffect(() => {
    if (!disableAutoSearch) {
      onSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, onSearch, disableAutoSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className={`flex gap-2 ${className}`}
    >
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search input"
      />
      
      {showButton && (
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {buttonText}
        </button>
      )}
    </form>
  )
}
