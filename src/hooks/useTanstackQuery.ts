import type {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import * as React from 'react'

interface QueryConfig<T> {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  retry?: boolean | number
  retryDelay?: number
  onSuccess?: (data: T) => void
  onError?: (error: AxiosError) => void
}

interface PaginatedQueryConfig<T> extends QueryConfig<T> {
  pageSize?: number
  initialPage?: number
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  currentPage: number
  totalPages: number
  limit: number
  hasMore: boolean
}

interface InfiniteScrollConfig<T> {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  retry?: boolean | number
  retryDelay?: number
  pageSize?: number
  initialPageParam?: unknown
  getNextPageParam?: (lastPage: InfiniteScrollResponse<T>, allPages: InfiniteScrollResponse<T>[], lastPageParam: unknown, allPageParams: unknown[]) => unknown
  getPreviousPageParam?: (firstPage: InfiniteScrollResponse<T>, allPages: InfiniteScrollResponse<T>[], firstPageParam: unknown, allPageParams: unknown[]) => unknown
  maxPages?: number
  onSuccess?: (data: InfiniteScrollResponse<T>) => void
  onError?: (error: AxiosError) => void
  onLoadMore?: (data: InfiniteData<InfiniteScrollResponse<T>>) => void
  throttleMs?: number
}

interface InfiniteScrollResponse<T> {
  data: T[]
  nextCursor?: string | number | null
  prevCursor?: string | number | null
  hasNextPage: boolean
  hasPreviousPage?: boolean
  total?: number
  page?: number
}

interface MutationConfig<T, V> {
  mutationKey?: string[]
  onSuccess?: (data: T, variables: V, context?: unknown) => void
  onError?: (error: AxiosError, variables: V, context?: unknown) => void
  onMutate?: (variables: V) => void | Promise<unknown>
  onSettled?: (data: T | undefined, error: AxiosError | null, variables: V, context?: unknown) => void
  retry?: boolean | number
  retryDelay?: number | ((failureCount: number, error: AxiosError) => number)
  networkMode?: 'online' | 'always' | 'offlineFirst'
  meta?: Record<string, unknown>
  // Cache invalidation options
  invalidateQueries?: string[][]
  refetchQueries?: string[][]
  // Optimistic update options
  optimisticUpdate?: {
    queryKey: string[]
    updateFn: (oldData: unknown, variables: V) => unknown
  }
  // Rollback options
  rollbackOnError?: boolean
  rollbackQueries?: string[][]
}

export function useCustomQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  config: QueryConfig<T> = {}
): UseQueryResult<T, AxiosError> {
  const queryOptions: UseQueryOptions<T, AxiosError, T, string[]> = {
    queryKey,
    queryFn,
    enabled: config.enabled,
    staleTime: config.staleTime,
    gcTime: config.cacheTime,
    retry: config.retry,
    retryDelay: config.retryDelay ? 
      (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, config.retryDelay!) 
      : undefined
  }

  const query = useQuery(queryOptions)

  // Use refs to store the latest callbacks to avoid infinite loops
  const onSuccessRef = React.useRef(config.onSuccess)
  const onErrorRef = React.useRef(config.onError)

  // Update refs when config changes
  React.useEffect(() => {
    onSuccessRef.current = config.onSuccess
    onErrorRef.current = config.onError
  })

  // Call onSuccess when data changes
  React.useEffect(() => {
    if (query.data && onSuccessRef.current) {
      onSuccessRef.current(query.data)
    }
  }, [query.data])

  // Call onError when error changes
  React.useEffect(() => {
    if (query.error && onErrorRef.current) {
      onErrorRef.current(query.error)
    }
  }, [query.error])

  return query
}

export function usePaginatedQuery<T>(
  baseQueryKey: string[],
  queryFn: (page: number, pageSize: number) => Promise<PaginatedResponse<T>>,
  config: PaginatedQueryConfig<PaginatedResponse<T>> = {}
): UseQueryResult<PaginatedResponse<T>, AxiosError> & {
  page: number
  setPage: (page: number) => void
  pageSize: number
  setPageSize: (size: number) => void
} {
  const [page, setPage] = React.useState(config.initialPage || 1)
  const [pageSize, setPageSize] = React.useState(config.pageSize || 10)

  const queryKey = [...baseQueryKey, page, pageSize]

  const queryOptions: UseQueryOptions<PaginatedResponse<T>, AxiosError, PaginatedResponse<T>, unknown[]> = {
    queryKey,
    queryFn: () => queryFn(page, pageSize),
    enabled: config.enabled,
    staleTime: config.staleTime,
    gcTime: config.cacheTime,
    retry: config.retry,
    retryDelay: config.retryDelay ? 
      (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, config.retryDelay!) 
      : undefined
  }

  const query = useQuery(queryOptions)

  React.useEffect(() => {
    if (query.data && config.onSuccess) {
      config.onSuccess(query.data)
    }
  }, [query.data, config.onSuccess])

  React.useEffect(() => {
    if (query.error && config.onError) {
      config.onError(query.error)
    }
  }, [query.error, config.onError])

  return {
    ...query,
    page,
    setPage,
    pageSize,
    setPageSize
  }
}

export function useInfiniteScroll<T>(
  queryKey: string[],
  queryFn: ({ pageParam }: { pageParam: unknown }) => Promise<InfiniteScrollResponse<T>>,
  config: InfiniteScrollConfig<T> = {}
) {
  const scrollElementRef = React.useRef<HTMLElement | null>(null)
  const loadMoreRef = React.useRef<(() => void) | null>(null)
  const throttleTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const infiniteQueryOptions: UseInfiniteQueryOptions<
    InfiniteScrollResponse<T>, 
    AxiosError, 
    InfiniteData<InfiniteScrollResponse<T>>, 
    string[]
  > = {
    queryKey,
    queryFn,
    enabled: config.enabled,
    staleTime: config.staleTime,
    gcTime: config.cacheTime,
    retry: config.retry,
    retryDelay: config.retryDelay ? 
      (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, config.retryDelay!) 
      : undefined,
    initialPageParam: config.initialPageParam || 0,
    getNextPageParam: config.getNextPageParam || 
      ((lastPage) => lastPage.hasNextPage ? (lastPage.nextCursor ?? (lastPage.page ? lastPage.page + 1 : 1)) : undefined),
    getPreviousPageParam: config.getPreviousPageParam || 
      ((firstPage) => firstPage.hasPreviousPage ? (firstPage.prevCursor ?? (firstPage.page ? firstPage.page - 1 : undefined)) : undefined),
    maxPages: config.maxPages
  }

  const query = useInfiniteQuery(infiniteQueryOptions)

  // Flatten data from all pages
  const flatData = React.useMemo(() => {
    return query.data?.pages.flatMap(page => page.data) || []
  }, [query.data])

  // Calculate total items
  const totalItems = React.useMemo(() => {
    if (!query.data?.pages.length) return 0
    const lastPage = query.data.pages[query.data.pages.length - 1]
    return lastPage.total || flatData.length
  }, [query.data, flatData.length])

  // Throttled load more function
  const throttledLoadMore = React.useCallback(() => {
    if (throttleTimeoutRef.current) return
    
    const throttleMs = config.throttleMs || 300
    throttleTimeoutRef.current = setTimeout(() => {
      throttleTimeoutRef.current = null
    }, throttleMs)
    
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage()
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage, config.throttleMs])

  const loadMore = React.useCallback(() => {
    throttledLoadMore()
  }, [throttledLoadMore])

  const loadPrevious = React.useCallback(() => {
    if (query.hasPreviousPage && !query.isFetchingPreviousPage) {
      query.fetchPreviousPage()
    }
  }, [query.hasPreviousPage, query.isFetchingPreviousPage, query.fetchPreviousPage])

  const refetchAll = React.useCallback(() => {
    query.refetch()
  }, [query.refetch])

  const scrollToTop = React.useCallback(() => {
    if (scrollElementRef.current) {
      scrollElementRef.current.scrollTop = 0
    }
  }, [])

  const scrollToBottom = React.useCallback(() => {
    if (scrollElementRef.current) {
      scrollElementRef.current.scrollTop = scrollElementRef.current.scrollHeight
    }
  }, [])

  // Store load more function in ref for external access
  loadMoreRef.current = loadMore

  // Auto-scroll detection
  const handleScroll = React.useCallback((element: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = element
    const threshold = 100 // pixels from bottom
    
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loadMore()
    }
  }, [loadMore])

  // Intersection Observer for automatic loading
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)

    return () => {
      observer.unobserve(sentinel)
    }
  }, [loadMore, query.hasNextPage, query.isFetchingNextPage])

  // Success callback
  React.useEffect(() => {
    if (query.data && config.onSuccess && query.data.pages.length > 0) {
      config.onSuccess(query.data.pages[query.data.pages.length - 1])
    }
  }, [query.data, config.onSuccess])

  // Load more callback
  React.useEffect(() => {
    if (query.data && config.onLoadMore) {
      config.onLoadMore(query.data)
    }
  }, [query.data, config.onLoadMore])

  // Error callback
  React.useEffect(() => {
    if (query.error && config.onError) {
      config.onError(query.error)
    }
  }, [query.error, config.onError])

  // Cleanup throttle timeout
  React.useEffect(() => {
    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
    }
  }, [])

  return {
    ...query,
    flatData,
    loadMore,
    loadPrevious,
    hasMore: query.hasNextPage || false,
    isLoadingMore: query.isFetchingNextPage,
    isLoadingPrevious: query.isFetchingPreviousPage,
    totalItems,
    refetchAll,
    scrollToTop,
    scrollToBottom,
    // Expose refs and handlers for external use
    scrollElementRef,
    sentinelRef,
    handleScroll
  }
}

export function useCustomMutation<T, V = unknown>(
  mutationFn: (variables: V) => Promise<T>,
  config: MutationConfig<T, V> = {}
): UseMutationResult<T, AxiosError, V> {
  const queryClient = useQueryClient()

  const mutationOptions: UseMutationOptions<T, AxiosError, V> = {
    mutationKey: config.mutationKey,
    mutationFn,
    retry: config.retry,
    retryDelay: config.retryDelay,
    networkMode: config.networkMode,
    meta: config.meta,
    onMutate: async (variables) => {
      // Call user's onMutate first
      const context = await config.onMutate?.(variables)

      // Handle optimistic updates
      if (config.optimisticUpdate) {
        const { queryKey, updateFn } = config.optimisticUpdate
        
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey })
        
        // Snapshot previous value
        const previousData = queryClient.getQueryData(queryKey)
        
        // Optimistically update
        queryClient.setQueryData(queryKey, (oldData: unknown) => 
          updateFn(oldData, variables)
        )
        
        return { 
          ...(context && typeof context === 'object' ? context : {}), 
          previousData, 
          optimisticQueryKey: queryKey 
        }
      }

      return context
    },
    onSuccess: (data, variables, context) => {
      // Call user's onSuccess
      config.onSuccess?.(data, variables, context)

      // Handle cache invalidation
      if (config.invalidateQueries) {
        config.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey })
        })
      }

      // Handle refetch queries
      if (config.refetchQueries) {
        config.refetchQueries.forEach(queryKey => {
          queryClient.refetchQueries({ queryKey })
        })
      }
    },
    onError: (error, variables, context) => {
      // Call user's onError
      config.onError?.(error, variables, context)

      // Handle rollback for optimistic updates
      if (config.rollbackOnError && context && typeof context === 'object' && 'previousData' in context) {
        const { previousData, optimisticQueryKey } = context as {
          previousData: unknown
          optimisticQueryKey: string[]
        }
        
        if (optimisticQueryKey && previousData !== undefined) {
          queryClient.setQueryData(optimisticQueryKey, previousData)
        }
      }

      // Handle rollback queries
      if (config.rollbackQueries) {
        config.rollbackQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
    },
    onSettled: (data, error, variables, context) => {
      // Call user's onSettled
      config.onSettled?.(data, error, variables, context)
    }
  }

  return useMutation(mutationOptions)
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient()

  return {
    invalidateQueries: (queryKey: string[]) => {
      return queryClient.invalidateQueries({ queryKey })
    },
    invalidateAllQueries: () => {
      return queryClient.invalidateQueries()
    }
  }
}

export function usePrefetchQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  config: QueryConfig<T> = {}
) {
  const queryClient = useQueryClient()

  return {
    prefetch: async () => {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: config.staleTime,
        gcTime: config.cacheTime
      })
    }
  }
}

export function useSetQueryData<T>() {
  const queryClient = useQueryClient()

  return {
    setQueryData: (queryKey: string[], data: T) => {
      queryClient.setQueryData(queryKey, data)
    }
  }
}

// Utility hook for creating scroll containers
export function useScrollContainer() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  const scrollToTop = React.useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])
  
  const scrollToBottom = React.useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ 
        top: containerRef.current.scrollHeight, 
        behavior: 'smooth' 
      })
    }
  }, [])
  
  return {
    containerRef,
    scrollToTop,
    scrollToBottom
  }
}

// Utility hook for virtual scrolling (for performance with large lists)
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const visibleRange = React.useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    )
    
    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex
    }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])
  
  const visibleItems = React.useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index
    }))
  }, [items, visibleRange])
  
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  }
}
