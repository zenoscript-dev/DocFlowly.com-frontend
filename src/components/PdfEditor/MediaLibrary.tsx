import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface MediaLibraryProps {
  onClose: () => void
  onImageSelect: (imageData: { name: string; dataUrl: string }) => void
}

const MediaLibrary = ({ onClose, onImageSelect }: MediaLibraryProps) => {
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; name: string; dataUrl: string }>>(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('mediaLibrary')
    return saved ? JSON.parse(saved) : []
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          const newImages = [...uploadedImages, {
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            dataUrl
          }]
          setUploadedImages(newImages)
          // Save to localStorage
          localStorage.setItem('mediaLibrary', JSON.stringify(newImages))
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Uploads</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Upload Button */}
      <div className="p-4 border-b bg-gray-50">
        <button
          onClick={handleUploadClick}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Upload className="w-5 h-5" />
          Upload files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b px-6">
        <button className="px-4 py-3 text-sm font-medium text-purple-600 border-b-2 border-purple-600">
          Images
        </button>
        <button className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
          Folders
        </button>
      </div>

      {/* Media Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {uploadedImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-4">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-base font-medium mb-1">No images uploaded yet</p>
            <p className="text-sm">Click "Upload files" to add images to your library</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer rounded-lg overflow-hidden hover:shadow-sm transition-all bg-gray-50"
                onClick={() => onImageSelect({ name: image.name, dataUrl: image.dataUrl })}
              >
                <div className="aspect-square">
                  <img
                    src={image.dataUrl}
                    alt={image.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaLibrary

