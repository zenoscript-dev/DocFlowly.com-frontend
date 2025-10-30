import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/core/lib/cn"
import { validationHelpers } from "@/utils/form-validation"
import { AlertCircle, CheckCircle, File, Upload, X } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

interface FileUploadProps {
  /** Maximum number of files that can be uploaded */
  maxFiles?: number
  /** Maximum file size in MB */
  maxSize?: number
  /** Allowed file types (MIME types) */
  accept?: Record<string, string[]>
  /** Whether to allow multiple file selection */
  multiple?: boolean
  /** Custom validation function */
  validateFile?: (file: File) => string | null
  /** Callback when files are added */
  onFilesAdded?: (files: File[]) => void
  /** Callback when files are removed */
  onFilesRemoved?: (files: File[]) => void
  /** Callback when upload starts */
  onUploadStart?: (files: File[]) => void
  /** Callback when upload completes */
  onUploadComplete?: (results: UploadResult[]) => void
  /** Callback when upload fails */
  onUploadError?: (error: Error) => void
  /** Custom upload function */
  uploadFunction?: (file: File, onProgress: (progress: number) => void) => Promise<string>
  /** Whether the component is disabled */
  disabled?: boolean
  /** Custom className */
  className?: string
  /** Text to display in the drop zone */
  dropzoneText?: string
  /** Whether to show file preview */
  showPreview?: boolean
  /** Whether to show upload progress */
  showProgress?: boolean
  /** Whether to auto-upload files when added */
  autoUpload?: boolean
}

interface FileWithProgress {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  url?: string
}

interface UploadResult {
  file: File
  url: string
  success: boolean
  error?: string
}

export function FileUpload({
  maxFiles = 10,
  maxSize = 10, // 10MB default
  accept,
  multiple = true,
  validateFile,
  onFilesAdded,
  onFilesRemoved,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  uploadFunction,
  disabled = false,
  className,
  dropzoneText = "Drag & drop files here, or click to select",
  showPreview = true,
  showProgress = true,
  autoUpload = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (disabled) return

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        console.warn("Rejected files:", rejectedFiles)
      }

      // Validate and add accepted files
      const validFiles: FileWithProgress[] = acceptedFiles
        .slice(0, maxFiles - files.length)
        .map((file) => {
          // Validate file size
          if (!validationHelpers.isValidFileSize(file, maxSize)) {
            return {
              file,
              id: Math.random().toString(36).substr(2, 9),
              progress: 0,
              status: 'error' as const,
              error: `File size exceeds ${maxSize}MB limit`,
            }
          }

          // Custom validation
          if (validateFile) {
            const validationError = validateFile(file)
            if (validationError) {
              return {
                file,
                id: Math.random().toString(36).substr(2, 9),
                progress: 0,
                status: 'error' as const,
                error: validationError,
              }
            }
          }

          return {
            file,
            id: Math.random().toString(36).substr(2, 9),
            progress: 0,
            status: 'pending' as const,
          }
        })

      const newFiles = [...files, ...validFiles]
      setFiles(newFiles)

      // Call callback with valid files
      const validAcceptedFiles = validFiles
        .filter((f) => f.status === 'pending')
        .map((f) => f.file)
      
      if (validAcceptedFiles.length > 0) {
        onFilesAdded?.(validAcceptedFiles)
      }

      // Auto-upload if enabled
      if (autoUpload && uploadFunction && validAcceptedFiles.length > 0) {
        handleUpload(validAcceptedFiles)
      }
    },
    [files, maxFiles, maxSize, validateFile, disabled, onFilesAdded, autoUpload, uploadFunction]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    disabled,
    maxSize: maxSize * 1024 * 1024, // Convert to bytes
  })

  const removeFile = useCallback(
    (fileId: string) => {
      const fileToRemove = files.find((f) => f.id === fileId)
      if (!fileToRemove) return

      setFiles((prev) => prev.filter((f) => f.id !== fileId))
      onFilesRemoved?.([fileToRemove.file])
    },
    [files, onFilesRemoved]
  )

  const handleUpload = useCallback(
    async (filesToUpload: File[] = files.map((f) => f.file)) => {
      if (!uploadFunction) return

      setIsUploading(true)
      onUploadStart?.(filesToUpload)

      const results: UploadResult[] = []

      try {
        await Promise.all(
          filesToUpload.map(async (file) => {
            const fileWithProgress = files.find((f) => f.file === file)
            if (!fileWithProgress) return

            // Update status to uploading
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileWithProgress.id
                  ? { ...f, status: 'uploading' as const }
                  : f
              )
            )

            try {
              const url = await uploadFunction(file, (progress) => {
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === fileWithProgress.id
                      ? { ...f, progress }
                      : f
                  )
                )
              })

              // Update status to completed
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileWithProgress.id
                    ? { ...f, status: 'completed' as const, progress: 100, url }
                    : f
                )
              )

              results.push({ file, url, success: true })
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Upload failed'
              
              // Update status to error
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileWithProgress.id
                    ? { ...f, status: 'error' as const, error: errorMessage }
                    : f
                )
              )

              results.push({ file, url: '', success: false, error: errorMessage })
            }
          })
        )

        onUploadComplete?.(results)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed'
        onUploadError?.(new Error(errorMessage))
      } finally {
        setIsUploading(false)
      }
    },
    [files, uploadFunction, onUploadStart, onUploadComplete, onUploadError]
  )

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return '🖼️'
    } else if (file.type.startsWith('video/')) {
      return '🎥'
    } else if (file.type.startsWith('audio/')) {
      return '🎵'
    } else if (file.type.includes('pdf')) {
      return '📄'
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return '📝'
    } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
      return '📊'
    } else if (file.type.includes('zip') || file.type.includes('rar')) {
      return '📦'
    } else {
      return '📁'
    }
  }

  const getStatusIcon = (status: FileWithProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />
      default:
        return <File className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {dropzoneText}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Max {maxSize}MB per file • {maxFiles} files max
        </p>
      </div>

      {/* File List */}
      {showPreview && files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((fileWithProgress) => (
              <div
                key={fileWithProgress.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-lg">{getFileIcon(fileWithProgress.file)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {fileWithProgress.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileWithProgress.file.size)}
                    </p>
                    {fileWithProgress.error && (
                      <p className="text-xs text-red-500">{fileWithProgress.error}</p>
                    )}
                  </div>
                  {getStatusIcon(fileWithProgress.status)}
                </div>

                {/* Progress Bar */}
                {showProgress && fileWithProgress.status === 'uploading' && (
                  <div className="w-24 ml-4">
                    <Progress value={fileWithProgress.progress} className="h-2" />
                  </div>
                )}

                {/* Remove Button */}
                {fileWithProgress.status !== 'uploading' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileWithProgress.id)}
                    className="ml-2 h-8 w-8 p-0"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {uploadFunction && files.length > 0 && !autoUpload && (
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => handleUpload()}
            disabled={disabled || isUploading}
            className="min-w-[100px]"
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
} 