import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/core/lib/cn"
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd"
import { Edit, Eye, MoreVertical, Plus, Trash2 } from "lucide-react"
import type { ReactNode } from "react"
import { useCallback, useState } from "react"

// Base Types
export interface BaseKanbanTask {
  id: string
  title: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface KanbanColumn {
  id: string
  title: string
  color?: string
  taskIds: string[]
  maxTasks?: number
}

// Default Task Interface (extends base)
export interface KanbanTask extends BaseKanbanTask {
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

// Custom Card Template Props
export interface KanbanCardTemplateProps<T extends BaseKanbanTask = KanbanTask> {
  task: T
  isDragging: boolean
  readOnly?: boolean
  onEdit: (task: T) => void
  onDelete: (taskId: string) => void
  onView: (task: T) => void
}

// Custom Task Creation Form Props
export interface KanbanTaskFormProps<T extends BaseKanbanTask = KanbanTask> {
  task?: Partial<T>
  columns: KanbanColumn[]
  assignees?: Array<{ id: string; name: string; avatar?: string }>
  availableTags?: string[]
  onSubmit: (task: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  isEditing?: boolean
}

// Main Component Props
export interface KanbanBoardProps<T extends BaseKanbanTask = KanbanTask> {
  /** Initial columns configuration */
  columns: KanbanColumn[]
  /** Initial tasks */
  tasks: T[]
  /** Callback when tasks are moved */
  onTaskMove?: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void
  /** Callback when task is created */
  onTaskCreate?: (task: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void
  /** Callback when task is updated */
  onTaskUpdate?: (taskId: string, updates: Partial<T>) => void
  /** Callback when task is deleted */
  onTaskDelete?: (taskId: string) => void
  /** Callback when column is created */
  onColumnCreate?: (column: Omit<KanbanColumn, 'id' | 'taskIds'>) => void
  /** Callback when column is updated */
  onColumnUpdate?: (columnId: string, updates: Partial<KanbanColumn>) => void
  /** Callback when column is deleted */
  onColumnDelete?: (columnId: string) => void
  /** Whether the board is read-only */
  readOnly?: boolean
  /** Whether to show task creation */
  allowTaskCreation?: boolean
  /** Whether to show column creation */
  allowColumnCreation?: boolean
  /** Custom className */
  className?: string
  /** Available assignees */
  assignees?: Array<{ id: string; name: string; avatar?: string }>
  /** Available tags */
  availableTags?: string[]
  /** Maximum tasks per column */
  maxTasksPerColumn?: number
  /** Custom card template */
  cardTemplate?: React.ComponentType<KanbanCardTemplateProps<T>>
  /** Custom task creation form */
  taskFormTemplate?: React.ComponentType<KanbanTaskFormProps<T>>
  /** Custom task editing form */
  taskEditFormTemplate?: React.ComponentType<KanbanTaskFormProps<T>>
  /** Board title */
  title?: string
  /** Board description */
  description?: string
  /** Custom header content */
  headerContent?: ReactNode
  /** Custom footer content */
  footerContent?: ReactNode
}

// Default Card Template
function DefaultKanbanCard<T extends BaseKanbanTask = KanbanTask>({ 
  task, 
  isDragging, 
  readOnly = false, 
  onEdit, 
  onDelete, 
  onView 
}: KanbanCardTemplateProps<T>) {
  const defaultTask = task as unknown as KanbanTask

  // Get priority color
  const getPriorityColor = (priority: KanbanTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  // Get priority label
  const getPriorityLabel = (priority: KanbanTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'Urgent'
      case 'high': return 'High'
      case 'medium': return 'Medium'
      case 'low': return 'Low'
      default: return 'Medium'
    }
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  // Check if task is overdue
  const isOverdue = (dueDate: Date) => {
    return dueDate < new Date()
  }

  return (
    <div
      className={cn(
        "bg-background border rounded-lg p-2 sm:p-3 cursor-pointer hover:shadow-md transition-shadow",
        isDragging && "shadow-lg rotate-2"
      )}
      onClick={() => onView(task)}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-medium text-sm line-clamp-2 flex-1 min-w-0">
          {task.title}
        </h4>
        {!readOnly && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  onView(task)
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Task Description */}
      {defaultTask.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {defaultTask.description}
        </p>
      )}

      {/* Task Meta */}
      <div className="space-y-1 sm:space-y-2">
        {/* Priority */}
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getPriorityColor(defaultTask.priority))} />
          <span className="text-xs text-muted-foreground truncate">
            {getPriorityLabel(defaultTask.priority)}
          </span>
        </div>

        {/* Assignee */}
        {defaultTask.assignee && (
          <div className="flex items-center gap-2">
            <Avatar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0">
              <AvatarImage src={defaultTask.assignee.avatar} />
              <AvatarFallback className="text-xs">
                {defaultTask.assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {defaultTask.assignee.name}
            </span>
          </div>
        )}

        {/* Due Date */}
        {defaultTask.dueDate && (
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs truncate",
              isOverdue(defaultTask.dueDate) 
                ? "text-red-500 font-medium" 
                : "text-muted-foreground"
            )}>
              Due {formatDate(defaultTask.dueDate)}
              {isOverdue(defaultTask.dueDate) && " (Overdue)"}
            </span>
          </div>
        )}

        {/* Tags */}
        {defaultTask.tags && defaultTask.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {defaultTask.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {defaultTask.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{defaultTask.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Default Task Form Template
function DefaultTaskForm<T extends BaseKanbanTask = KanbanTask>({ 
  task, 
  columns, 
  assignees = [], 
  availableTags = [], 
  onSubmit, 
  onCancel, 
  isEditing = false 
}: KanbanTaskFormProps<T>) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: (task as unknown as KanbanTask)?.description || '',
    priority: (task as unknown as KanbanTask)?.priority || 'medium' as const,
    status: task?.status || '',
    assigneeId: (task as unknown as KanbanTask)?.assignee?.id || '',
    dueDate: (task as unknown as KanbanTask)?.dueDate ? new Date((task as unknown as KanbanTask).dueDate!).toISOString().split('T')[0] : '',
    tags: (task as unknown as KanbanTask)?.tags || [],
  })

  const handleSubmit = () => {
    if (!formData.title || !formData.status) return

    const taskData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      assignee: assignees.find(a => a.id === formData.assigneeId),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: formData.tags,
    } as unknown as Omit<T, 'id' | 'createdAt' | 'updatedAt'>

    onSubmit(taskData)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-title">Title *</Label>
        <Input
          id="task-title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="task-priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setFormData(prev => ({ ...prev, priority: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="task-assignee">Assignee</Label>
          <Select
            value={formData.assigneeId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {assignees.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-due-date">Due Date</Label>
          <Input
            id="task-due-date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!formData.title || !formData.status}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </div>
  )
}

export function KanbanBoard<T extends BaseKanbanTask = KanbanTask>({
  columns: initialColumns,
  tasks: initialTasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onColumnCreate,
  onColumnUpdate,
  onColumnDelete,
  readOnly = false,
  allowTaskCreation = true,
  allowColumnCreation = true,
  className,
  assignees = [],
  availableTags = [],
  maxTasksPerColumn,
  cardTemplate: CustomCardTemplate,
  taskFormTemplate: CustomTaskFormTemplate,
  taskEditFormTemplate: CustomTaskEditFormTemplate,
  title = "Kanban Board",
  description,
  headerContent,
  footerContent,
}: KanbanBoardProps<T>) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)
  const [tasks, setTasks] = useState<T[]>(initialTasks)
  const [createTaskDialog, setCreateTaskDialog] = useState(false)
  const [createColumnDialog, setCreateColumnDialog] = useState(false)
  const [editTaskDialog, setEditTaskDialog] = useState<T | null>(null)
  const [editColumnDialog, setEditColumnDialog] = useState<KanbanColumn | null>(null)
  const [newColumn, setNewColumn] = useState({
    title: '',
    color: '#3b82f6',
    maxTasks: maxTasksPerColumn || 0,
  })

  // Use custom or default templates
  const CardTemplate = CustomCardTemplate || DefaultKanbanCard
  const TaskFormTemplate = CustomTaskFormTemplate || DefaultTaskForm
  const TaskEditFormTemplate = CustomTaskEditFormTemplate || CustomTaskFormTemplate || DefaultTaskForm

  // Handle drag and drop
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || readOnly) return

    const { source, destination, draggableId } = result
    const fromColumnId = source.droppableId
    const toColumnId = destination.droppableId
    const taskId = draggableId

    // Check if moving to a column with max tasks limit
    const targetColumn = columns.find(col => col.id === toColumnId)
    if (targetColumn?.maxTasks && targetColumn.taskIds.length >= targetColumn.maxTasks) {
      return
    }

    // Update local state
    setColumns(prevColumns => {
      const newColumns = [...prevColumns]
      
      // Remove from source column
      const sourceColumnIndex = newColumns.findIndex(col => col.id === fromColumnId)
      if (sourceColumnIndex !== -1) {
        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          taskIds: newColumns[sourceColumnIndex].taskIds.filter(id => id !== taskId)
        }
      }

      // Add to destination column
      const destColumnIndex = newColumns.findIndex(col => col.id === toColumnId)
      if (destColumnIndex !== -1) {
        const newTaskIds = [...newColumns[destColumnIndex].taskIds]
        newTaskIds.splice(destination.index, 0, taskId)
        newColumns[destColumnIndex] = {
          ...newColumns[destColumnIndex],
          taskIds: newTaskIds
        }
      }

      return newColumns
    })

    // Update task status
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: toColumnId, updatedAt: new Date() }
          : task
      )
    )

    // Call callback
    onTaskMove?.(taskId, fromColumnId, toColumnId, destination.index)
  }, [columns, readOnly, onTaskMove])

  // Create new task
  const handleCreateTask = useCallback((taskData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    onTaskCreate?.(taskData)

    // Add to local state
    const newTaskId = `task-${Date.now()}`
    const createdTask: T = {
      ...taskData,
      id: newTaskId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T

    setTasks(prev => [...prev, createdTask])
    setColumns(prev => 
      prev.map(col => 
        col.id === taskData.status 
          ? { ...col, taskIds: [...col.taskIds, newTaskId] }
          : col
      )
    )

    setCreateTaskDialog(false)
  }, [onTaskCreate])

  // Update task
  const handleUpdateTask = useCallback((taskId: string, updates: Partial<T>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    )
    onTaskUpdate?.(taskId, updates)
    setEditTaskDialog(null)
  }, [onTaskUpdate])

  // Delete task
  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    setColumns(prev => 
      prev.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== taskId)
      }))
    )
    onTaskDelete?.(taskId)
    
    // Close edit dialogs if the deleted task was being edited
    if (editTaskDialog?.id === taskId) {
      setEditTaskDialog(null)
    }
    if (editColumnDialog?.id === taskId) {
      setEditColumnDialog(null)
    }
  }, [onTaskDelete, editTaskDialog, editColumnDialog])

  // Create new column
  const handleCreateColumn = useCallback(() => {
    if (!newColumn.title) return

    const column: Omit<KanbanColumn, 'id' | 'taskIds'> = {
      title: newColumn.title,
      color: newColumn.color,
      maxTasks: newColumn.maxTasks || undefined,
    }

    onColumnCreate?.(column)

    // Add to local state
    const newColumnId = `column-${Date.now()}`
    const createdColumn: KanbanColumn = {
      ...column,
      id: newColumnId,
      taskIds: [],
    }

    setColumns(prev => [...prev, createdColumn])

    // Reset form
    setNewColumn({
      title: '',
      color: '#3b82f6',
      maxTasks: maxTasksPerColumn || 0,
    })
    setCreateColumnDialog(false)
  }, [newColumn, maxTasksPerColumn, onColumnCreate])

  // Update column
  const handleUpdateColumn = useCallback((columnId: string, updates: Partial<KanbanColumn>) => {
    setColumns(prev => 
      prev.map(col => 
        col.id === columnId 
          ? { ...col, ...updates }
          : col
      )
    )
    onColumnUpdate?.(columnId, updates)
    setEditColumnDialog(null)
  }, [onColumnUpdate])

  // Delete column
  const handleDeleteColumn = useCallback((columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column) return

    // Move all tasks to the first available column or delete them
    const remainingColumns = columns.filter(col => col.id !== columnId)
    if (remainingColumns.length > 0) {
      const targetColumn = remainingColumns[0]
      setColumns(prev => 
        prev.map(col => 
          col.id === targetColumn.id 
            ? { ...col, taskIds: [...col.taskIds, ...column.taskIds] }
            : col
        ).filter(col => col.id !== columnId)
      )
      setTasks(prev => 
        prev.map(task => 
          column.taskIds.includes(task.id) 
            ? { ...task, status: targetColumn.id, updatedAt: new Date() }
            : task
        )
      )
    } else {
      setColumns(prev => prev.filter(col => col.id !== columnId))
      setTasks(prev => prev.filter(task => !column.taskIds.includes(task.id)))
    }

    onColumnDelete?.(columnId)
  }, [columns, onColumnDelete])

  return (
    <div className={cn("w-full h-full", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          {!title && (
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          )}
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {description}
            </p>
          )}
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {tasks.length} tasks across {columns.length} columns
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {headerContent}
          {allowTaskCreation && !readOnly && (
            <Button onClick={() => setCreateTaskDialog(true)} size="sm" className="sm:size-default">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Task</span>
            </Button>
          )}
          {allowColumnCreation && !readOnly && (
            <Button variant="outline" onClick={() => setCreateColumnDialog(true)} size="sm" className="sm:size-default">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Column</span>
              <span className="sm:hidden">Column</span>
            </Button>
          )}
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4 overflow-x-auto">
          {columns.map((column) => {
            const columnTasks = tasks.filter(task => column.taskIds.includes(task.id))
            const isAtMaxCapacity = column.maxTasks && columnTasks.length >= column.maxTasks

            return (
              <div key={column.id} className="w-full min-w-[280px] sm:min-w-0">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: column.color }}
                        />
                        <CardTitle className="text-sm font-medium truncate">
                          {column.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {columnTasks.length}
                          {column.maxTasks && `/${column.maxTasks}`}
                        </Badge>
                      </div>
                      {!readOnly && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditColumnDialog(column)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Column
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteColumn(column.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Column
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Droppable droppableId={column.id} isDropDisabled={!!isAtMaxCapacity}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "min-h-[200px] space-y-2 p-1",
                            snapshot.isDraggingOver && "bg-muted/50 rounded-lg p-2",
                            isAtMaxCapacity && "opacity-50"
                          )}
                        >
                          {columnTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <CardTemplate
                                    task={task}
                                    isDragging={snapshot.isDragging}
                                    readOnly={readOnly}
                                    onEdit={setEditTaskDialog}
                                    onDelete={handleDeleteTask}
                                    onView={setEditTaskDialog}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {/* Create Task Dialog */}
      <Dialog open={createTaskDialog} onOpenChange={setCreateTaskDialog}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your kanban board.
            </DialogDescription>
          </DialogHeader>
          <TaskFormTemplate
            columns={columns}
            assignees={assignees}
            availableTags={availableTags}
            onSubmit={handleCreateTask}
            onCancel={() => setCreateTaskDialog(false)}
            isEditing={false}
          />
        </DialogContent>
      </Dialog>

      {/* Create Column Dialog */}
      <Dialog open={createColumnDialog} onOpenChange={setCreateColumnDialog}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>Create New Column</DialogTitle>
            <DialogDescription>
              Add a new column to your kanban board.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="column-title">Title *</Label>
              <Input
                id="column-title"
                value={newColumn.title}
                onChange={(e) => setNewColumn(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter column title"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="column-color">Color</Label>
                <Input
                  id="column-color"
                  type="color"
                  value={newColumn.color}
                  onChange={(e) => setNewColumn(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="column-max-tasks">Max Tasks</Label>
                <Input
                  id="column-max-tasks"
                  type="number"
                  min="0"
                  value={newColumn.maxTasks}
                  onChange={(e) => setNewColumn(prev => ({ ...prev, maxTasks: parseInt(e.target.value) || 0 }))}
                  placeholder="No limit"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateColumnDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateColumn} disabled={!newColumn.title}>
              Create Column
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      {editTaskDialog && (
        <Dialog open={!!editTaskDialog} onOpenChange={() => setEditTaskDialog(null)}>
          <DialogContent className="max-w-md w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update task details.
              </DialogDescription>
            </DialogHeader>
            <TaskEditFormTemplate
              task={editTaskDialog}
              columns={columns}
              assignees={assignees}
              availableTags={availableTags}
              onSubmit={(taskData) => handleUpdateTask(editTaskDialog.id, taskData as Partial<T>)}
              onCancel={() => setEditTaskDialog(null)}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Column Dialog */}
      {editColumnDialog && (
        <Dialog open={!!editColumnDialog} onOpenChange={() => setEditColumnDialog(null)}>
          <DialogContent className="max-w-md w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>Edit Column</DialogTitle>
              <DialogDescription>
                Update column details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-column-title">Title</Label>
                <Input
                  id="edit-column-title"
                  value={editColumnDialog.title}
                  onChange={(e) => setEditColumnDialog(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-column-color">Color</Label>
                  <Input
                    id="edit-column-color"
                    type="color"
                    value={editColumnDialog.color || '#3b82f6'}
                    onChange={(e) => setEditColumnDialog(prev => prev ? { ...prev, color: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-column-max-tasks">Max Tasks</Label>
                  <Input
                    id="edit-column-max-tasks"
                    type="number"
                    min="0"
                    value={editColumnDialog.maxTasks || 0}
                    onChange={(e) => setEditColumnDialog(prev => prev ? { ...prev, maxTasks: parseInt(e.target.value) || 0 } : null)}
                    placeholder="No limit"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditColumnDialog(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateColumn(editColumnDialog.id, editColumnDialog)}>
                Update Column
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Footer Content */}
      {footerContent && (
        <div className="mt-6">
          {footerContent}
        </div>
      )}
    </div>
  )
} 