# KanbanBoard Component Documentation

## Overview

The `KanbanBoard` component is a comprehensive, industry-standard drag & drop kanban board implementation built with Shadcn UI. It provides a complete project management solution with **flexible task interfaces** and **customizable card templates**, making it suitable for various use cases beyond traditional project management.

## Features

### 🎯 **Core Functionality**
- **Drag & Drop**: Smooth drag and drop between columns
- **Task Management**: Create, edit, delete, and move tasks
- **Column Management**: Add, edit, and remove columns
- **Flexible Task Interfaces**: Extend `BaseKanbanTask` for custom task types
- **Custom Card Templates**: Design your own task card layouts
- **Custom Form Templates**: Create specialized task creation/editing forms
- **Priority Levels**: 4 priority levels (Low, Medium, High, Urgent)
- **Assignee Support**: Assign tasks to team members
- **Due Dates**: Track task deadlines with overdue indicators
- **Tags**: Categorize tasks with custom tags
- **Responsive Design**: Works on all screen sizes

### 🎨 **Visual Features**
- **Color-coded Columns**: Custom colors for each column
- **Priority Indicators**: Visual priority badges
- **Status Tracking**: Real-time status updates
- **Progress Indicators**: Task counts and limits
- **Avatar Support**: User avatars for assignees
- **Modern UI**: Clean, professional design
- **Custom Styling**: Tailwind CSS support

### ⚙️ **Advanced Features**
- **Task Limits**: Set maximum tasks per column
- **Read-only Mode**: View-only mode for presentations
- **Custom Validation**: Flexible validation rules
- **Event Callbacks**: Full control over all actions
- **TypeScript Support**: Complete type safety
- **Generic Architecture**: Type-safe custom task interfaces

## Installation

### Dependencies

```bash
npm install @hello-pangea/dnd
```

### Required Shadcn UI Components

Make sure you have these Shadcn UI components installed:

```bash
npx shadcn-ui@latest add card badge avatar dropdown-menu dialog input label textarea select button
```

## Basic Usage

### Standard Kanban Board

```tsx
import { KanbanBoard, type KanbanTask, type KanbanColumn } from "@/components/ui/kanban-board"

const columns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    color: "#3b82f6",
    taskIds: ["task-1", "task-2"],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#f59e0b",
    taskIds: ["task-3"],
  },
  {
    id: "done",
    title: "Done",
    color: "#10b981",
    taskIds: ["task-4"],
  },
]

const tasks: KanbanTask[] = [
  {
    id: "task-1",
    title: "Design new landing page",
    description: "Create wireframes and mockups",
    priority: "high",
    status: "todo",
    assignee: {
      id: "user-1",
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
    },
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tags: ["design", "frontend"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ... more tasks
]

function MyKanbanBoard() {
  return (
    <KanbanBoard
      columns={columns}
      tasks={tasks}
      onTaskMove={(taskId, fromColumn, toColumn) => {
        console.log(`Task ${taskId} moved from ${fromColumn} to ${toColumn}`)
      }}
    />
  )
}
```

### Custom Task Interface

```tsx
import { KanbanBoard, type BaseKanbanTask, type KanbanCardTemplateProps } from "@/components/ui/kanban-board"

// Define your custom task interface
interface BugTask extends BaseKanbanTask {
  severity: 'low' | 'medium' | 'high' | 'critical'
  bugType: 'ui' | 'backend' | 'performance' | 'security'
  reporter: {
    id: string
    name: string
    email: string
  }
  environment: 'development' | 'staging' | 'production'
  stepsToReproduce?: string
}

// Create custom card template
function BugCardTemplate({ task, isDragging, onEdit, onDelete, onView }: KanbanCardTemplateProps<BugTask>) {
  return (
    <div className="bg-white border rounded-lg p-3 hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <div className={`w-3 h-3 rounded-full ${getSeverityColor(task.severity)}`} />
      </div>
      
      <div className="space-y-2">
        <Badge variant="outline" className="text-xs">
          {task.bugType}
        </Badge>
        <div className="text-xs text-muted-foreground">
          Reported by {task.reporter.name}
        </div>
      </div>
    </div>
  )
}

// Use with custom task interface
function BugTrackingBoard() {
  return (
    <KanbanBoard<BugTask>
      columns={bugColumns}
      tasks={bugTasks}
      cardTemplate={BugCardTemplate}
      onTaskMove={handleBugMove}
      title="Bug Tracking Board"
    />
  )
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `KanbanColumn[]` | `[]` | Array of column configurations |
| `tasks` | `T[]` | `[]` | Array of tasks (generic type) |
| `onTaskMove` | `(taskId, fromColumn, toColumn, newIndex) => void` | `undefined` | Callback when task is moved |
| `onTaskCreate` | `(task) => void` | `undefined` | Callback when task is created |
| `onTaskUpdate` | `(taskId, updates) => void` | `undefined` | Callback when task is updated |
| `onTaskDelete` | `(taskId) => void` | `undefined` | Callback when task is deleted |
| `onColumnCreate` | `(column) => void` | `undefined` | Callback when column is created |
| `onColumnUpdate` | `(columnId, updates) => void` | `undefined` | Callback when column is updated |
| `onColumnDelete` | `(columnId) => void` | `undefined` | Callback when column is deleted |
| `readOnly` | `boolean` | `false` | Whether the board is read-only |
| `allowTaskCreation` | `boolean` | `true` | Whether to show task creation |
| `allowColumnCreation` | `boolean` | `true` | Whether to show column creation |
| `className` | `string` | `undefined` | Custom CSS class |
| `assignees` | `Array<{id, name, avatar?}>` | `[]` | Available assignees |
| `availableTags` | `string[]` | `[]` | Available tags |
| `maxTasksPerColumn` | `number` | `undefined` | Maximum tasks per column |
| `cardTemplate` | `React.ComponentType<KanbanCardTemplateProps<T>>` | `DefaultKanbanCard` | Custom card template |
| `taskFormTemplate` | `React.ComponentType<KanbanTaskFormProps<T>>` | `DefaultTaskForm` | Custom task creation form |
| `taskEditFormTemplate` | `React.ComponentType<KanbanTaskFormProps<T>>` | `DefaultTaskForm` | Custom task editing form |
| `title` | `string` | `"Kanban Board"` | Board title |
| `description` | `string` | `undefined` | Board description |
| `headerContent` | `ReactNode` | `undefined` | Custom header content |
| `footerContent` | `ReactNode` | `undefined` | Custom footer content |

### Types

#### BaseKanbanTask (Base Interface)

```typescript
interface BaseKanbanTask {
  id: string
  title: string
  status: string
  createdAt: Date
  updatedAt: Date
}
```

#### KanbanTask (Default Implementation)

```typescript
interface KanbanTask extends BaseKanbanTask {
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate?: Date
  tags?: string[]
}
```

#### KanbanColumn

```typescript
interface KanbanColumn {
  id: string
  title: string
  color?: string
  taskIds: string[]
  maxTasks?: number
}
```

#### KanbanCardTemplateProps

```typescript
interface KanbanCardTemplateProps<T extends BaseKanbanTask = KanbanTask> {
  task: T
  isDragging: boolean
  readOnly?: boolean
  onEdit: (task: T) => void
  onDelete: (taskId: string) => void
  onView: (task: T) => void
}
```

#### KanbanTaskFormProps

```typescript
interface KanbanTaskFormProps<T extends BaseKanbanTask = KanbanTask> {
  task?: Partial<T>
  columns: KanbanColumn[]
  assignees?: Array<{ id: string; name: string; avatar?: string }>
  availableTags?: string[]
  onSubmit: (task: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  isEditing?: boolean
}
```

## Advanced Usage

### Custom Task Interfaces

The component supports custom task interfaces by extending `BaseKanbanTask`. This allows you to create specialized boards for different use cases:

#### Bug Tracking Interface

```typescript
interface BugTask extends BaseKanbanTask {
  severity: 'low' | 'medium' | 'high' | 'critical'
  bugType: 'ui' | 'backend' | 'performance' | 'security'
  reporter: {
    id: string
    name: string
    email: string
  }
  environment: 'development' | 'staging' | 'production'
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
}
```

#### Content Management Interface

```typescript
interface ContentTask extends BaseKanbanTask {
  contentType: 'blog' | 'video' | 'social' | 'email'
  author: {
    id: string
    name: string
    avatar?: string
  }
  targetAudience: string[]
  publishDate?: Date
  wordCount?: number
  status: 'draft' | 'review' | 'approved' | 'published'
}
```

#### Sales Pipeline Interface

```typescript
interface SalesTask extends BaseKanbanTask {
  company: string
  contactPerson: {
    name: string
    email: string
    phone?: string
  }
  dealValue: number
  probability: number
  expectedCloseDate?: Date
  source: 'website' | 'referral' | 'cold-call' | 'social'
}
```

### Custom Card Templates

Create specialized card templates for your custom task interfaces:

```tsx
function BugCardTemplate({ task, isDragging, onEdit, onDelete, onView }: KanbanCardTemplateProps<BugTask>) {
  const getSeverityColor = (severity: BugTask['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-600'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className={cn(
      "cursor-pointer hover:shadow-md transition-shadow",
      isDragging && "shadow-lg rotate-2"
    )}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm line-clamp-2 flex-1 min-w-0">
            {task.title}
          </h4>
          <div className={cn("w-3 h-3 rounded-full flex-shrink-0", getSeverityColor(task.severity))} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {task.bugType}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {task.severity}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate">{task.reporter.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Tag className="h-3 w-3" />
            <span className="truncate">{task.environment}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Custom Form Templates

Create specialized forms for task creation and editing:

```tsx
function BugFormTemplate({ task, columns, onSubmit, onCancel, isEditing }: KanbanTaskFormProps<BugTask>) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    severity: (task as BugTask)?.severity || 'medium' as const,
    bugType: (task as BugTask)?.bugType || 'ui' as const,
    environment: (task as BugTask)?.environment || 'development' as const,
    status: task?.status || '',
    stepsToReproduce: (task as BugTask)?.stepsToReproduce || '',
  })

  const handleSubmit = () => {
    if (!formData.title || !formData.status) return

    const bugData = {
      title: formData.title,
      severity: formData.severity,
      bugType: formData.bugType,
      environment: formData.environment,
      status: formData.status,
      stepsToReproduce: formData.stepsToReproduce,
      reporter: {
        id: "current-user",
        name: "Current User",
        email: "user@example.com"
      }
    } as Omit<BugTask, 'id' | 'createdAt' | 'updatedAt'>

    onSubmit(bugData)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bug-title">Bug Title *</Label>
        <Input
          id="bug-title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Describe the bug"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bug-severity">Severity</Label>
          <Select
            value={formData.severity}
            onValueChange={(value: BugTask['severity']) => setFormData(prev => ({ ...prev, severity: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bug-type">Bug Type</Label>
          <Select
            value={formData.bugType}
            onValueChange={(value: BugTask['bugType']) => setFormData(prev => ({ ...prev, bugType: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ui">UI</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bug-steps">Steps to Reproduce</Label>
        <Textarea
          id="bug-steps"
          value={formData.stepsToReproduce}
          onChange={(e) => setFormData(prev => ({ ...prev, stepsToReproduce: e.target.value }))}
          placeholder="1. Go to...\n2. Click on...\n3. See error..."
          rows={3}
        />
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!formData.title || !formData.status}>
          {isEditing ? 'Update Bug' : 'Create Bug'}
        </Button>
      </div>
    </div>
  )
}
```

### Custom Event Handlers

```tsx
function AdvancedKanbanBoard() {
  const handleTaskMove = (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    // Update your backend
    updateTaskStatus(taskId, toColumn)
    
    // Show notification
    toast.success(`Task moved to ${toColumn}`)
  }

  const handleTaskCreate = (task: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Create task in backend
    const newTask = await createTask(task)
    
    // Add to local state
    setTasks(prev => [...prev, newTask])
  }

  const handleTaskDelete = (taskId: string) => {
    // Delete from backend
    await deleteTask(taskId)
    
    // Remove from local state
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  return (
    <KanbanBoard
      columns={columns}
      tasks={tasks}
      onTaskMove={handleTaskMove}
      onTaskCreate={handleTaskCreate}
      onTaskDelete={handleTaskDelete}
      assignees={teamMembers}
      availableTags={projectTags}
      maxTasksPerColumn={15}
    />
  )
}
```

### Read-only Mode

```tsx
function ReadOnlyKanbanBoard() {
  return (
    <KanbanBoard
      columns={columns}
      tasks={tasks}
      readOnly={true}
      allowTaskCreation={false}
      allowColumnCreation={false}
      title="Project Overview"
      description="View-only project status"
    />
  )
}
```

### Custom Styling

```tsx
function CustomStyledKanbanBoard() {
  return (
    <KanbanBoard
      columns={columns}
      tasks={tasks}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl"
      title="My Custom Board"
      headerContent={
        <div className="flex items-center gap-4">
          <Badge variant="outline">Active</Badge>
          <span className="text-sm text-muted-foreground">Last updated: 2 hours ago</span>
        </div>
      }
      footerContent={
        <div className="text-center text-sm text-muted-foreground">
          Powered by KanbanBoard Component
        </div>
      }
    />
  )
}
```

## Real-world Examples

### Project Management Board

```tsx
const projectColumns = [
  { id: "backlog", title: "Backlog", color: "#6b7280", taskIds: [] },
  { id: "planning", title: "Planning", color: "#3b82f6", taskIds: [] },
  { id: "development", title: "Development", color: "#f59e0b", taskIds: [] },
  { id: "testing", title: "Testing", color: "#8b5cf6", taskIds: [] },
  { id: "deployment", title: "Deployment", color: "#10b981", taskIds: [] },
]

const projectTasks = [
  {
    id: "task-1",
    title: "User Authentication System",
    description: "Implement JWT-based authentication with social login",
    priority: "high",
    status: "development",
    assignee: { id: "dev-1", name: "Alice Johnson" },
    dueDate: new Date("2024-02-15"),
    tags: ["backend", "security", "auth"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ... more tasks
]
```

### Content Management Board

```tsx
interface ContentTask extends BaseKanbanTask {
  contentType: 'blog' | 'video' | 'social' | 'email'
  author: { id: string; name: string; avatar?: string }
  targetAudience: string[]
  publishDate?: Date
  wordCount?: number
}

const contentColumns = [
  { id: "ideas", title: "Content Ideas", color: "#fbbf24", taskIds: [] },
  { id: "writing", title: "In Writing", color: "#34d399", taskIds: [] },
  { id: "review", title: "Under Review", color: "#60a5fa", taskIds: [] },
  { id: "published", title: "Published", color: "#a78bfa", taskIds: [] },
]

const contentTasks: ContentTask[] = [
  {
    id: "content-1",
    title: "How to Build a React App",
    description: "Step-by-step guide for beginners",
    status: "writing",
    contentType: "blog",
    author: { id: "writer-1", name: "Bob Smith" },
    targetAudience: ["beginners", "developers"],
    wordCount: 1500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ... more content tasks
]
```

### Sales Pipeline Board

```tsx
interface SalesTask extends BaseKanbanTask {
  company: string
  contactPerson: { name: string; email: string; phone?: string }
  dealValue: number
  probability: number
  expectedCloseDate?: Date
  source: 'website' | 'referral' | 'cold-call' | 'social'
}

const salesColumns = [
  { id: "leads", title: "Leads", color: "#f87171", taskIds: [] },
  { id: "contacted", title: "Contacted", color: "#fbbf24", taskIds: [] },
  { id: "qualified", title: "Qualified", color: "#34d399", taskIds: [] },
  { id: "proposal", title: "Proposal", color: "#60a5fa", taskIds: [] },
  { id: "negotiation", title: "Negotiation", color: "#a78bfa", taskIds: [] },
  { id: "closed", title: "Closed Won", color: "#10b981", taskIds: [] },
]

const salesTasks: SalesTask[] = [
  {
    id: "lead-1",
    title: "Acme Corporation",
    description: "Enterprise software solution inquiry",
    status: "qualified",
    company: "Acme Corporation",
    contactPerson: { name: "Carol Davis", email: "carol@acme.com" },
    dealValue: 50000,
    probability: 75,
    expectedCloseDate: new Date("2024-01-30"),
    source: "website",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ... more sales leads
]
```

## Best Practices

### 1. **Custom Task Interface Design**

```typescript
// ✅ Good: Extend BaseKanbanTask
interface CustomTask extends BaseKanbanTask {
  // Add your custom properties
  customField: string
  customEnum: 'option1' | 'option2'
}

// ❌ Bad: Don't create from scratch
interface BadTask {
  id: string
  title: string
  // Missing required BaseKanbanTask properties
}
```

### 2. **Card Template Design**

```tsx
// ✅ Good: Use proper props and handle all callbacks
function GoodCardTemplate({ task, isDragging, onEdit, onDelete, onView }: KanbanCardTemplateProps<CustomTask>) {
  return (
    <div 
      className={cn("card", isDragging && "dragging")}
      onClick={() => onView(task)}
    >
      <h4>{task.title}</h4>
      <div className="actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  )
}

// ❌ Bad: Don't ignore props or callbacks
function BadCardTemplate({ task }: { task: CustomTask }) {
  return <div>{task.title}</div> // Missing interactions
}
```

### 3. **State Management**

```tsx
// Use React state or external state management
const [columns, setColumns] = useState(initialColumns)
const [tasks, setTasks] = useState(initialTasks)

// Update state in event handlers
const handleTaskMove = (taskId, fromColumn, toColumn, newIndex) => {
  // Update columns
  setColumns(prev => {
    const newColumns = [...prev]
    // Remove from source column
    const sourceIndex = newColumns.findIndex(col => col.id === fromColumn)
    newColumns[sourceIndex].taskIds = newColumns[sourceIndex].taskIds.filter(id => id !== taskId)
    
    // Add to destination column
    const destIndex = newColumns.findIndex(col => col.id === toColumn)
    newColumns[destIndex].taskIds.splice(newIndex, 0, taskId)
    
    return newColumns
  })
  
  // Update task status
  setTasks(prev => prev.map(task => 
    task.id === taskId 
      ? { ...task, status: toColumn, updatxedAt: new Date() }
      : task
  ))
}
```

### 4. **Performance Optimization**

```tsx
// Memoize expensive computations
const columnTasks = useMemo(() => {
  return columns.map(column => ({
    ...column,
    tasks: tasks.filter(task => column.taskIds.includes(task.id))
  }))
}, [columns, tasks])

// Use React.memo for custom card components if needed
const TaskCard = React.memo(({ task, onEdit, onDelete }) => {
  // Task card implementation
})
```

### 5. **Error Handling**

```tsx
const handleTaskCreate = async (task) => {
  try {
    const newTask = await createTaskAPI(task)
    setTasks(prev => [...prev, newTask])
    toast.success('Task created successfully')
  } catch (error) {
    toast.error('Failed to create task')
    console.error('Task creation error:', error)
  }
}
```

### 6. **Accessibility**

```tsx
// The component includes proper ARIA attributes
// Add additional accessibility features as needed
<KanbanBoard
  columns={columns}
  tasks={tasks}
  aria-label="Project management board"
  // Additional accessibility props
/>
```

## Customization

### Custom Task Card

```tsx
// You can extend the component to support custom task cards
interface CustomTaskCardProps {
  task: CustomTask
  onEdit: (task: CustomTask) => void
  onDelete: (taskId: string) => void
}

function CustomTaskCard({ task, onEdit, onDelete }: CustomTaskCardProps) {
  return (
    <div className="custom-task-card">
      <h4>{task.title}</h4>
      <p>{task.customField}</p>
      {/* Custom styling and layout */}
    </div>
  )
}
```

### Custom Column Header

```tsx
// Customize column headers with additional information
function CustomColumnHeader({ column, taskCount, maxTasks }) {
  return (
    <div className="custom-column-header">
      <h3>{column.title}</h3>
      <div className="column-stats">
        <span>{taskCount}/{maxTasks || '∞'}</span>
      </div>
    </div>
  )
}
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors with Custom Task Interfaces**
   - Ensure your custom interface extends `BaseKanbanTask`
   - Use proper type casting when needed: `task as unknown as CustomTask`

2. **Drag and Drop Not Working**
   - Ensure `@hello-pangea/dnd` is installed
   - Check that the component is wrapped in a `DragDropContext`

3. **Tasks Not Updating**
   - Verify that state updates are properly handled
   - Check that event handlers are correctly implemented

4. **Styling Issues**
   - Ensure all required Shadcn UI components are installed
   - Check Tailwind CSS configuration

5. **Performance Issues**
   - Use React.memo for expensive components
   - Implement proper state management
   - Consider virtualization for large datasets

### Debug Mode

```tsx
// Enable debug logging
const handleTaskMove = (taskId, fromColumn, toColumn, newIndex) => {
  console.log('Task Move:', { taskId, fromColumn, toColumn, newIndex })
  // Your implementation
}
```

## Migration Guide

### From react-beautiful-dnd

```tsx
// Old import
import { DragDropContext } from 'react-beautiful-dnd'

// New import
import { DragDropContext } from '@hello-pangea/dnd'
```

### From Custom Kanban Implementation

```tsx
// Replace custom implementation with KanbanBoard component
// The component handles all drag & drop logic internally
```

### From Previous Version

```tsx
// Old usage
<KanbanBoard columns={columns} tasks={tasks} />

// New usage with custom task interface
<KanbanBoard<CustomTask> 
  columns={columns} 
  tasks={customTasks}
  cardTemplate={CustomCardTemplate}
/>
```

## Contributing

When contributing to the KanbanBoard component:

1. Follow the established TypeScript patterns
2. Maintain accessibility standards
3. Add comprehensive tests
4. Update documentation
5. Follow the component design system
6. Ensure backward compatibility for existing interfaces

## License

This component is part of the template project and follows the same license terms. 