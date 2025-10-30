import { Trash2, Upload, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface SignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (signatureDataUrl: string) => void
}

const SignatureModal = ({ isOpen, onClose, onSave }: SignatureModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Load saved signatures from localStorage
  const [savedSignatures, setSavedSignatures] = useState<Array<{ id: string; dataUrl: string; name: string }>>(() => {
    const saved = localStorage.getItem('savedSignatures')
    return saved ? JSON.parse(saved) : []
  })

  // Initialize canvas
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    }
  }, [isOpen])

  const getCanvasCoordinates = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }, [])

  const startDrawing = useCallback((e: React.MouseEvent) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const { x, y } = getCanvasCoordinates(e)
    
    ctx.beginPath()
    ctx.moveTo(x, y)
  }, [getCanvasCoordinates])

  const draw = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const { x, y } = getCanvasCoordinates(e)
    
    ctx.lineTo(x, y)
    ctx.stroke()
  }, [isDrawing, getCanvasCoordinates])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
    setHasSignature(true)
  }, [])

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }, [])

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return
    
    const dataUrl = canvas.toDataURL('image/png')
    
    // Save to localStorage
    const newSignature = {
      id: `${Date.now()}-${Math.random()}`,
      dataUrl,
      name: `Signature ${savedSignatures.length + 1}`
    }
    const updatedSignatures = [...savedSignatures, newSignature]
    setSavedSignatures(updatedSignatures)
    localStorage.setItem('savedSignatures', JSON.stringify(updatedSignatures))
    
    // Clear the canvas after saving
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasSignature(false)
    }
  }, [hasSignature, savedSignatures])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        // Clear canvas and draw uploaded image
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        setHasSignature(true)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleSelectSignature = useCallback((signature: { id: string; dataUrl: string; name: string }) => {
    onSave(signature.dataUrl)
    onClose()
  }, [onSave, onClose])

  const handleDeleteSignature = useCallback((id: string) => {
    const updatedSignatures = savedSignatures.filter(sig => sig.id !== id)
    setSavedSignatures(updatedSignatures)
    localStorage.setItem('savedSignatures', JSON.stringify(updatedSignatures))
  }, [savedSignatures])

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Signature</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Upload Button */}
        <div className="p-4 border-b">
          <button
            onClick={openFileDialog}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Upload className="w-5 h-5" />
            Upload Signature From Device
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>



        {/* Saved Signatures */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Saved Signatures</h3>
          {savedSignatures.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">
              No saved signatures yet
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {savedSignatures.map((signature) => (
                <div
                  key={signature.id}
                  className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleSelectSignature(signature)}
                >
                  <img
                    src={signature.dataUrl}
                    alt={signature.name}
                    className="w-full aspect-[2/1] object-contain bg-white"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSignature(signature.id)
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="px-4 py-4 border-t">
        <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-48 cursor-crosshair rounded"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Draw your signature in the box above or click "Upload Signature From Device"
        </p>
      </div>

      {/* Actions */}
      <div className="p-4 border-t">
        <div className="flex gap-2 w-full">
          <button
            onClick={clearSignature}
            disabled={!hasSignature}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasSignature}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignatureModal

