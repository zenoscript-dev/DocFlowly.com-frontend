import { FileSignature } from 'lucide-react'

interface SignatureElementProps {
  onClick: () => void
}

const SignatureElement = ({ onClick }: SignatureElementProps) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
        <FileSignature className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
      </div>
      <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
        Signature
      </span>
    </div>
  )
}

export default SignatureElement

