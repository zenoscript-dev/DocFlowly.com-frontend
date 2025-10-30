# useTanstackQuery Hook Documentation

A comprehensive guide to using the custom TanStack Query hooks for data fetching, mutations, and cache management in React applications.

## 🎯 What is TanStack Query?

TanStack Query (formerly React Query) is a powerful library that helps you manage, cache, and synchronize server state in your React applications. Our custom hooks make it even easier to use!

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Basic Query Hook](#basic-query-hook)
3. [Paginated Query Hook](#paginated-query-hook)
4. [Infinite Scroll Hook](#infinite-scroll-hook)
5. [Mutation Hook](#mutation-hook)
6. [Cache Management Hooks](#cache-management-hooks)
7. [Utility Hooks](#utility-hooks)
8. [Real-World Examples](#real-world-examples)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Installation
```bash
npm install @tanstack/react-query
```

### Setup
First, wrap your app with QueryClient:

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  )
}
```

## 🔍 Basic Query Hook

### `useCustomQuery<T>`

Fetches data from an API and automatically handles loading, error, and success states.

#### Basic Usage

```tsx
import { useCustomQuery } from '@/hooks/useTanstackQuery'

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useCustomQuery(
    ['user', userId], // Unique key for caching
    () => fetchUser(userId), // Function that returns a Promise
    {
      enabled: !!userId, // Only run if userId exists
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    }
  )

  if (isLoading) return <div>Loading user...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>No user found</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether the query should run |
| `staleTime` | `number` | `0` | How long data is considered fresh (ms) |
| `cacheTime` | `number` | `5 * 60 * 1000` | How long to keep data in cache (ms) |
| `retry` | `boolean \| number` | `3` | Number of retry attempts |
| `retryDelay` | `number` | `1000` | Delay between retries (ms) |
| `onSuccess` | `(data: T) => void` | - | Called when query succeeds |
| `onError` | `(error: AxiosError) => void` | - | Called when query fails |

## 📄 Paginated Query Hook

### `usePaginatedQuery<T>`

Handles paginated data with built-in page management.

#### Basic Usage

```tsx
function UserList() {
  const {
    data,
    isLoading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize
  } = usePaginatedQuery(
    ['users'], // Base query key
    (page, pageSize) => fetchUsers(page, pageSize), // Query function
    {
      pageSize: 10, // Items per page
      initialPage: 1, // Start from page 1
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )

  if (isLoading) return <div>Loading users...</div>
  if (error) return <div>Error: {error.message}</div>

  const { data: users, total, currentPage, totalPages } = data || {}

  return (
    <div>
      {/* User List */}
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}

      {/* Pagination Controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        
        <span>Page {currentPage} of {totalPages}</span>
        
        <button
          onClick={() => setPage(page + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

## 🔄 Infinite Scroll Hook

### `useInfiniteScroll<T>`

**Production-grade infinite scroll hook** that handles large datasets with automatic loading, performance optimization, and smooth user experience.

#### Key Features

- ✅ **Automatic loading** when scrolling near bottom
- ✅ **Intersection Observer** for performance
- ✅ **Throttling** to prevent excessive API calls
- ✅ **Bidirectional scrolling** (load previous pages)
- ✅ **Virtual scrolling** support for large lists
- ✅ **Memory management** with page limits
- ✅ **Error handling** and retry logic
- ✅ **TypeScript support** with full type safety

#### Basic Usage

```tsx
import { useInfiniteScroll } from '@/hooks/useTanstackQuery'

function InfinitePostsList() {
  const {
    flatData: posts,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
    sentinelRef
  } = useInfiniteScroll(
    ['posts'], // Query key
    ({ pageParam = 0 }) => fetchPosts({ cursor: pageParam, limit: 20 }), // Query function
    {
      throttleMs: 300, // Throttle scroll events
      staleTime: 5 * 60 * 1000, // 5 minutes
      onLoadMore: (data) => {
        console.log(`Loaded ${data.pages.length} pages`)
      }
    }
  )

  if (isLoading) return <div>Loading posts...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="space-y-4">
      {/* Posts List */}
      {posts.map((post, index) => (
        <PostCard key={`${post.id}-${index}`} post={post} />
      ))}

      {/* Loading Indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Sentinel Element for Auto-loading */}
      <div ref={sentinelRef} className="h-4" />

      {/* Manual Load More Button (Optional) */}
      {hasMore && !isLoadingMore && (
        <button
          onClick={loadMore}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Load More Posts
        </button>
      )}

      {/* End of List Message */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          You've reached the end!
        </div>
      )}
    </div>
  )
}
```

#### API Response Structure

Your API should return data in this format:

```tsx
interface InfiniteScrollResponse<T> {
  data: T[]                           // Array of items for this page
  nextCursor?: string | number | null // Cursor for next page
  prevCursor?: string | number | null // Cursor for previous page  
  hasNextPage: boolean               // Whether there are more pages
  hasPreviousPage?: boolean          // Whether there are previous pages
  total?: number                     // Total number of items (optional)
  page?: number                      // Current page number (optional)
}

// Example API response
{
  "data": [
    { "id": 1, "title": "Post 1", "content": "..." },
    { "id": 2, "title": "Post 2", "content": "..." }
  ],
  "nextCursor": "eyJpZCI6MjAsImNyZWF0ZWRBdCI6IjIwMjMtMTAtMTVUMTA6MDA6MDBaIn0=",
  "hasNextPage": true,
  "total": 1000
}
```

#### Advanced Usage with Custom Scroll Container

```tsx
function CustomScrollContainer() {
  const {
    flatData: items,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    scrollElementRef,
    handleScroll,
    scrollToTop,
    scrollToBottom,
    totalItems
  } = useInfiniteScroll(
    ['items'],
    ({ pageParam = 0 }) => fetchItems({ page: pageParam, limit: 50 }),
    {
      initialPageParam: 0,
      getNextPageParam: (lastPage) => 
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
      maxPages: 10, // Limit memory usage
      throttleMs: 200,
    }
  )

  return (
    <div className="relative">
      {/* Header with Stats */}
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between">
        <span>Total Items: {totalItems}</span>
        <div className="space-x-2">
          <button onClick={scrollToTop}>Top</button>
          <button onClick={scrollToBottom}>Bottom</button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollElementRef}
        className="h-96 overflow-y-auto"
        onScroll={(e) => handleScroll(e.currentTarget)}
      >
        <div className="p-4 space-y-2">
          {items.map((item, index) => (
            <ItemCard key={`${item.id}-${index}`} item={item} />
          ))}
          
          {isLoadingMore && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

#### Bidirectional Infinite Scroll

```tsx
function BidirectionalList() {
  const {
    flatData: messages,
    isLoading,
    isLoadingMore,
    isLoadingPrevious,
    hasMore,
    loadMore,
    loadPrevious,
    sentinelRef,
    scrollToBottom
  } = useInfiniteScroll(
    ['messages'],
    ({ pageParam = { cursor: null, direction: 'next' } }) => 
      fetchMessages(pageParam.cursor, pageParam.direction),
    {
      initialPageParam: { cursor: null, direction: 'next' },
      getNextPageParam: (lastPage) => 
        lastPage.hasNextPage ? { cursor: lastPage.nextCursor, direction: 'next' } : undefined,
      getPreviousPageParam: (firstPage) => 
        firstPage.hasPreviousPage ? { cursor: firstPage.prevCursor, direction: 'prev' } : undefined,
    }
  )

  // Auto-scroll to bottom for new messages
  React.useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length, scrollToBottom])

  return (
    <div className="flex flex-col h-96">
      {/* Load Previous Button */}
      {!isLoading && (
        <button
          onClick={loadPrevious}
          disabled={isLoadingPrevious}
          className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          {isLoadingPrevious ? 'Loading...' : 'Load Previous Messages'}
        </button>
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <MessageBubble key={`${message.id}-${index}`} message={message} />
        ))}
        
        {/* Sentinel for auto-loading */}
        <div ref={sentinelRef} className="h-1" />
        
        {isLoadingMore && (
          <div className="text-center py-2">
            <span className="text-sm text-gray-500">Loading more messages...</span>
          </div>
        )}
      </div>
    </div>
  )
}
```

#### Virtual Scrolling for Performance

```tsx
import { useInfiniteScroll, useVirtualScroll } from '@/hooks/useTanstackQuery'

function VirtualizedInfiniteList() {
  const { flatData: items, isLoadingMore, sentinelRef } = useInfiniteScroll(
    ['large-dataset'],
    ({ pageParam = 0 }) => fetchLargeDataset({ page: pageParam, limit: 100 })
  )

  const {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  } = useVirtualScroll(items, 60, 400, 5) // 60px item height, 400px container

  return (
    <div
      className="relative h-96 overflow-auto"
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      {/* Virtual container */}
      <div style={{ height: totalHeight }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div
              key={`${item.id}-${index}`}
              className="h-15 p-2 border-b"
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading indicator */}
      <div ref={sentinelRef} className="h-4" />
      {isLoadingMore && <div className="text-center py-2">Loading...</div>}
    </div>
  )
}
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether the query should run |
| `staleTime` | `number` | `0` | How long data is considered fresh (ms) |
| `cacheTime` | `number` | `5 * 60 * 1000` | How long to keep data in cache (ms) |
| `retry` | `boolean \| number` | `3` | Number of retry attempts |
| `retryDelay` | `number` | `1000` | Delay between retries (ms) |
| `initialPageParam` | `unknown` | `0` | Initial page parameter |
| `getNextPageParam` | `function` | Auto-generated | Function to get next page param |
| `getPreviousPageParam` | `function` | Auto-generated | Function to get previous page param |
| `maxPages` | `number` | `undefined` | Maximum pages to keep in memory |
| `throttleMs` | `number` | `300` | Throttle time for scroll events (ms) |
| `onSuccess` | `(data: T) => void` | - | Called when query succeeds |
| `onError` | `(error: AxiosError) => void` | - | Called when query fails |
| `onLoadMore` | `(data: InfiniteData<T>) => void` | - | Called when more data is loaded |

#### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `flatData` | `T[]` | Flattened array of all items from all pages |
| `loadMore` | `() => void` | Function to manually load more data |
| `loadPrevious` | `() => void` | Function to load previous data |
| `hasMore` | `boolean` | Whether there are more pages to load |
| `isLoadingMore` | `boolean` | Whether currently loading next page |
| `isLoadingPrevious` | `boolean` | Whether currently loading previous page |
| `totalItems` | `number` | Total number of items across all pages |
| `refetchAll` | `() => void` | Function to refetch all pages |
| `scrollToTop` | `() => void` | Function to scroll to top |
| `scrollToBottom` | `() => void` | Function to scroll to bottom |
| `scrollElementRef` | `React.MutableRefObject` | Ref for custom scroll container |
| `sentinelRef` | `React.MutableRefObject` | Ref for intersection observer |
| `handleScroll` | `(element: HTMLElement) => void` | Manual scroll handler |

## ✏️ Mutation Hook

### `useCustomMutation<T, V>`

**Production-ready mutation hook** with advanced features including mutation keys, optimistic updates, cache invalidation, and automatic rollback.

#### Key Features

- ✅ **Mutation keys** for tracking and debugging
- ✅ **Optimistic updates** for instant UI feedback
- ✅ **Automatic cache invalidation** and refetching
- ✅ **Rollback on error** with configurable options
- ✅ **Retry logic** with exponential backoff
- ✅ **Network mode** configuration
- ✅ **Meta data** support for analytics
- ✅ **TypeScript support** with full type safety

#### Basic Usage

```tsx
function CreateUserForm() {
  const createUserMutation = useCustomMutation(
    (userData: CreateUserData) => createUser(userData),
    {
      mutationKey: ["create-user"], // Track this mutation
      onSuccess: (newUser, variables, context) => {
        console.log("User created:", newUser)
        showSuccessToast("User created successfully!")
      },
      onError: (error, variables, context) => {
        console.error("Failed to create user:", error)
        showErrorToast("Failed to create user")
      },
      // Automatically invalidate users list after creation
      invalidateQueries: [["users"], ["users", "list"]]
    }
  )

  const handleSubmit = (formData: CreateUserData) => {
    createUserMutation.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={createUserMutation.isPending}
      >
        {createUserMutation.isPending ? "Creating..." : "Create User"}
      </button>
    </form>
  )
}
```

#### Advanced Usage with Optimistic Updates

```tsx
function UpdateUserForm({ userId }: { userId: string }) {
  const updateUserMutation = useCustomMutation(
    ({ userId, userData }: { userId: string; userData: UpdateUserData }) =>
      updateUser(userId, userData),
    {
      mutationKey: ["update-user", userId],
      // Optimistic update for instant UI feedback
      optimisticUpdate: {
        queryKey: ["user", userId],
        updateFn: (oldUser: User, variables) => ({
          ...oldUser,
          ...variables.userData,
          updatedAt: new Date().toISOString()
        })
      },
      onSuccess: (updatedUser, variables, context) => {
        showSuccessToast("User updated successfully!")
        // Additional cache invalidation
        invalidateQueries: [["users"], ["user", userId, "posts"]]
      },
      onError: (error, variables, context) => {
        showErrorToast("Failed to update user")
        // Automatic rollback happens due to optimisticUpdate
      },
      // Enable rollback on error
      rollbackOnError: true,
      // Retry configuration
      retry: 3,
      retryDelay: (failureCount, error) => Math.min(1000 * 2 ** failureCount, 30000),
      // Network mode
      networkMode: "online",
      // Meta data for analytics
      meta: {
        action: "update_user",
        userId: userId
      }
    }
  )

  const handleUpdate = (userData: UpdateUserData) => {
    updateUserMutation.mutate({ userId, userData })
  }

  return (
    <form onSubmit={(data) => handleUpdate(data)}>
      {/* Form fields */}
      <button disabled={updateUserMutation.isPending}>
        {updateUserMutation.isPending ? "Updating..." : "Update User"}
      </button>
    </form>
  )
}
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mutationKey` | `string[]` | - | Unique key for tracking this mutation |
| `onSuccess` | `(data, variables, context) => void` | - | Called when mutation succeeds |
| `onError` | `(error, variables, context) => void` | - | Called when mutation fails |
| `onMutate` | `(variables) => void | Promise` | - | Called before mutation runs |
| `onSettled` | `(data, error, variables, context) => void` | - | Called when mutation completes |
| `retry` | `boolean | number` | `3` | Number of retry attempts |
| `retryDelay` | `number | function` | `1000` | Delay between retries |
| `networkMode` | `string` | `"online"` | Network mode for mutation |
| `meta` | `Record<string, unknown>` | - | Meta data for analytics |
| `invalidateQueries` | `string[][]` | - | Queries to invalidate on success |
| `refetchQueries` | `string[][]` | - | Queries to refetch on success |
| `optimisticUpdate` | `object` | - | Optimistic update configuration |
| `rollbackOnError` | `boolean` | `false` | Whether to rollback on error |
| `rollbackQueries` | `string[][]` | - | Queries to rollback on error |

#### Optimistic Update Configuration

```tsx
interface OptimisticUpdateConfig<T, V> {
  queryKey: string[]           // Query key to update
  updateFn: (oldData: unknown, variables: V) => unknown  // Update function
}
```

#### Real-World Example: Todo Management

```tsx
function TodoItem({ todo }: { todo: Todo }) {
  const toggleTodoMutation = useCustomMutation(
    ({ id, completed }: { id: string; completed: boolean }) =>
      updateTodo(id, { completed }),
    {
      mutationKey: ["toggle-todo", todo.id],
      optimisticUpdate: {
        queryKey: ["todos"],
        updateFn: (todos: Todo[], variables) =>
          todos.map(todo =>
            todo.id === variables.id
              ? { ...todo, completed: variables.completed, updatedAt: new Date().toISOString() }
              : todo
          )
      },
      onSuccess: (updatedTodo, variables) => {
        // Track analytics
        analytics.track("Todo Toggled", {
          todoId: variables.id,
          completed: variables.completed
        })
      },
      onError: (error, variables) => {
        showErrorToast("Failed to update todo")
      },
      rollbackOnError: true,
      retry: 2,
      meta: {
        action: "toggle_todo",
        todoId: todo.id
      }
    }
  )

  const handleToggle = () => {
    toggleTodoMutation.mutate({ id: todo.id, completed: !todo.completed })
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={toggleTodoMutation.isPending}
      />
      <span className={todo.completed ? "line-through" : ""}>
        {todo.title}
      </span>
      {toggleTodoMutation.isPending && <Spinner size="sm" />}
    </div>
  )
}
```

#### Batch Operations

```tsx
function BatchDeleteUsers({ userIds }: { userIds: string[] }) {
  const batchDeleteMutation = useCustomMutation(
    (userIds: string[]) => batchDeleteUsers(userIds),
    {
      mutationKey: ["batch-delete-users"],
      onSuccess: (result, variables) => {
        showSuccessToast(`Deleted ${variables.length} users`)
        // Invalidate multiple query patterns
        invalidateQueries: [
          ["users"],
          ["users", "list"],
          ["users", "search"]
        ]
      },
      onError: (error, variables) => {
        showErrorToast("Failed to delete users")
      },
      retry: 1, // Only retry once for batch operations
      networkMode: "online",
      meta: {
        action: "batch_delete_users",
        count: userIds.length
      }
    }
  )

  const handleBatchDelete = () => {
    batchDeleteMutation.mutate(userIds)
  }

  return (
    <button
      onClick={handleBatchDelete}
      disabled={batchDeleteMutation.isPending}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      {batchDeleteMutation.isPending ? "Deleting..." : `Delete ${userIds.length} Users`}
    </button>
  )
}
```
Invalidate and refetch cached data.

```tsx
function UserActions({ userId }: { userId: string }) {
  const { invalidateQueries, invalidateAllQueries } = useInvalidateQueries()

  const handleRefresh = () => {
    // Invalidate specific query
    invalidateQueries(['user', userId])
  }

  const handleRefreshAll = () => {
    // Invalidate all queries
    invalidateAllQueries()
  }

  return (
    <div>
      <button onClick={handleRefresh}>Refresh User</button>
      <button onClick={handleRefreshAll}>Refresh All Data</button>
    </div>
  )
}
```

## 🛠️ Utility Hooks

### `useScrollContainer`

Helper hook for managing scroll containers.

```tsx
function ScrollableList() {
  const { containerRef, scrollToTop, scrollToBottom } = useScrollContainer()

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={scrollToTop}>Scroll to Top</button>
        <button onClick={scrollToBottom}>Scroll to Bottom</button>
      </div>
      
      <div
        ref={containerRef}
        className="h-64 overflow-y-auto border rounded p-4"
      >
        {/* Your scrollable content */}
        {items.map(item => (
          <div key={item.id} className="py-2">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### `useVirtualScroll`

Performance optimization for large lists.

```tsx
function VirtualizedList({ items }: { items: Item[] }) {
  const {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  } = useVirtualScroll(items, 50, 300, 5) // 50px height, 300px container, 5 overscan

  return (
    <div
      className="h-75 overflow-auto"
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={index} className="h-12 flex items-center px-4 border-b">
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## 🌟 Real-World Examples

### Social Media Feed with Infinite Scroll

```tsx
function SocialMediaFeed() {
  const {
    flatData: posts,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    sentinelRef,
    totalItems,
    refetchAll
  } = useInfiniteScroll(
    ['social-feed'],
    ({ pageParam = 0 }) => fetchSocialPosts({ 
      cursor: pageParam, 
      limit: 10,
      includeMedia: true 
    }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      throttleMs: 200,
      onLoadMore: (data) => {
        // Track analytics
        analytics.track('Posts Loaded', { 
          totalPages: data.pages.length,
          totalPosts: data.pages.reduce((acc, page) => acc + page.data.length, 0)
        })
      }
    }
  )

  const [newPostsAvailable, setNewPostsAvailable] = React.useState(false)

  // Check for new posts periodically
  React.useEffect(() => {
    const interval = setInterval(async () => {
      const latestPost = posts[0]
      if (latestPost) {
        const hasNewPosts = await checkForNewPosts(latestPost.createdAt)
        setNewPostsAvailable(hasNewPosts)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [posts])

  const handleRefresh = () => {
    refetchAll()
    setNewPostsAvailable(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Failed to load posts</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* New Posts Banner */}
      {newPostsAvailable && (
        <div className="sticky top-0 z-10 bg-blue-500 text-white p-3 text-center">
          <button onClick={handleRefresh} className="hover:underline">
            New posts available - Click to refresh
          </button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6 pb-4">
        {posts.map((post, index) => (
          <PostCard
            key={`${post.id}-${index}`}
            post={post}
            onLike={(postId) => handleLikePost(postId)}
            onShare={(postId) => handleSharePost(postId)}
            onComment={(postId) => handleCommentPost(postId)}
          />
        ))}

        {/* Loading Indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-6">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
              <span className="text-gray-600">Loading more posts...</span>
            </div>
          </div>
        )}

        {/* Sentinel for auto-loading */}
        <div ref={sentinelRef} className="h-4" />

        {/* End of Feed */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <CheckCircleIcon className="h-5 w-5" />
              <span>You're all caught up!</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              You've seen all {totalItems} posts
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

### E-commerce Product Catalog

```tsx
function ProductCatalog() {
  const [filters, setFilters] = React.useState({
    category: '',
    priceRange: '',
    sortBy: 'relevance'
  })

  const {
    flatData: products,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    refetchAll,
    sentinelRef
  } = useInfiniteScroll(
    ['products', filters], // Include filters in query key
    ({ pageParam = 0 }) => fetchProducts({ 
      ...filters,
      page: pageParam,
      limit: 24 
    }),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes for product data
      enabled: true,
      onSuccess: (page) => {
        // Track product views
        page.data.forEach(product => {
          analytics.track('Product Viewed', { productId: product.id })
        })
      }
    }
  )

  // Refetch when filters change
  React.useEffect(() => {
    refetchAll()
  }, [filters, refetchAll])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="container mx-auto px-4">
      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange({ priceRange: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">Any Price</option>
            <option value="0-25">$0 - $25</option>
            <option value="25-100">$25 - $100</option>
            <option value="100+">$100+</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={`${product.id}-${index}`}
                product={product}
                onAddToCart={(productId) => handleAddToCart(productId)}
                onAddToWishlist={(productId) => handleAddToWishlist(productId)}
              />
            ))}
          </div>

          {/* Load More Section */}
          <div className="mt-8 text-center">
            {isLoadingMore && (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" />
                <span>Loading more products...</span>
              </div>
            )}

            <div ref={sentinelRef} className="h-4" />

            {hasMore && !isLoadingMore && (
              <button
                onClick={loadMore}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Load More Products
              </button>
            )}

            {!hasMore && products.length > 0 && (
              <p className="text-gray-500 py-4">
                You've viewed all {products.length} products
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
```

## 📋 Best Practices

### 1. Query Key Structure

```tsx
// ✅ Good - Hierarchical and descriptive
['users']                    // All users
['users', userId]           // Specific user
['users', userId, 'posts']  // User's posts
['users', 'search', term]   // Search results
['posts', 'infinite']       // Infinite scroll posts
['products', filters]       // Products with filters

// ❌ Bad - Unclear and flat
['data1']
['data2']
['data3']
```

### 2. Infinite Scroll Performance

```tsx
// ✅ Good - Optimized for performance
const { flatData, sentinelRef } = useInfiniteScroll(
  ['posts'],
  ({ pageParam = 0 }) => fetchPosts(pageParam),
  {
    throttleMs: 300,           // Throttle scroll events
    maxPages: 20,              // Limit memory usage
    staleTime: 5 * 60 * 1000,  // Cache data appropriately
  }
)

// ❌ Bad - Performance issues
const { flatData } = useInfiniteScroll(
  ['posts'],
  ({ pageParam = 0 }) => fetchPosts(pageParam),
  {
    throttleMs: 0,        // Too aggressive
    maxPages: undefined,  // Unlimited memory usage
    staleTime: 0,         // No caching
  }
)
```

### 3. Error Handling

```tsx
function RobustInfiniteList() {
  const {
    flatData: items,
    isLoading,
    error,
    refetchAll,
    hasMore,
    loadMore
  } = useInfiniteScroll(
    ['items'],
    ({ pageParam = 0 }) => fetchItems(pageParam),
    {
      retry: 3,
      retryDelay: 1000,
      onError: (error) => {
        console.error('Failed to load items:', error)
        
        // Show user-friendly error message
        if (error.response?.status === 429) {
          showErrorToast('Too many requests. Please wait a moment.')
        } else if (error.response?.status >= 500) {
          showErrorToast('Server error. Please try again later.')
        } else {
          showErrorToast('Failed to load items. Check your connection.')
        }
      }
    }
  )

  if (isLoading) return <LoadingSkeleton />
  
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={refetchAll}
        message="Failed to load items"
      />
    )
  }

  return (
    <div>
      {items.map(item => <ItemCard key={item.id} item={item} />)}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  )
}
```

### 4. Memory Management

```tsx
// ✅ Good - Manage memory for large datasets
const { flatData } = useInfiniteScroll(
  ['large-dataset'],
  ({ pageParam = 0 }) => fetchLargeDataset(pageParam),
  {
    maxPages: 10,              // Keep only 10 pages in memory
    gcTime: 5 * 60 * 1000,     // Clean up after 5 minutes
    staleTime: 2 * 60 * 1000,  // Refetch after 2 minutes
  }
)

// For very large lists, use virtual scrolling
const { visibleItems } = useVirtualScroll(flatData, 60, 400)
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Infinite Loading Loop

```tsx
// ❌ Problem: Infinite loading due to incorrect getNextPageParam
const { flatData } = useInfiniteScroll(
  ['items'],
  ({ pageParam = 0 }) => fetchItems(pageParam),
  {
    getNextPageParam: (lastPage) => lastPage.nextPage // Always returns a value
  }
)

// ✅ Solution: Properly check for end of data
const { flatData } = useInfiniteScroll(
  ['items'],
  ({ pageParam = 0 }) => fetchItems(pageParam),
  {
    getNextPageParam: (lastPage) => 
      lastPage.hasNextPage ? lastPage.nextCursor : undefined
  }
)
```

#### 2. Memory Leaks

```tsx
// ❌ Problem: No cleanup of event listeners
useEffect(() => {
  window.addEventListener('scroll', handleScroll)
}, [])

// ✅ Solution: Proper cleanup
useEffect(() => {
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [handleScroll])
```

#### 3. Stale Data Issues

```tsx
// ❌ Problem: Data becomes stale quickly
const { flatData } = useInfiniteScroll(['posts'], fetchPosts)

// ✅ Solution: Configure appropriate stale time
const { flatData } = useInfiniteScroll(
  ['posts'],
  fetchPosts,
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  }
)
```

### Debug Tips

1. **Enable DevTools**:
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

2. **Monitor Performance**:
```tsx
const { flatData, isLoading } = useInfiniteScroll(
  ['items'],
  fetchItems,
  {
    onSuccess: (data) => {
      console.log('Pages loaded:', data.pages.length)
      console.log('Total items:', data.pages.reduce((acc, page) => acc + page.data.length, 0))
    }
  }
)
```

3. **Check Network Tab**: Monitor API calls to ensure they're not being made excessively.

## 🎉 Summary

This comprehensive TanStack Query hook library provides:

- ✅ **Simple API** for data fetching and mutations
- ✅ **Automatic caching** and background updates
- ✅ **Built-in pagination** support
- ✅ **Production-grade infinite scroll** with performance optimization
- ✅ **Virtual scrolling** for large datasets
- ✅ **Bidirectional scrolling** support
- ✅ **Memory management** and cleanup
- ✅ **Optimistic updates** for better UX
- ✅ **Error handling** and retry logic
- ✅ **TypeScript support** for type safety
- ✅ **Cache management** utilities
- ✅ **Intersection Observer** for performance
- ✅ **Throttling** and debouncing
- ✅ **Utility hooks** for common patterns

Start with the basic `useCustomQuery` hook, then explore pagination with `usePaginatedQuery`, and finally implement infinite scroll with `useInfiniteScroll` for the best user experience with large datasets!
