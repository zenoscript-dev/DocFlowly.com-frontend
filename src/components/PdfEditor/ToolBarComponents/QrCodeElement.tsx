import DraggableElement from '../DraggableElement'
import { ELEMENT_CONFIGS } from '../constants'
import { ItemTypes } from '../types'

interface QrCodeElementProps {
  onClick?: () => void
}

const QrCodeElement = ({ onClick }: QrCodeElementProps) => {
  const qrConfig = ELEMENT_CONFIGS.find((config) => config.type === ItemTypes.QR_CODE)

  if (!qrConfig) {
    console.error('QrCode config not found in ELEMENT_CONFIGS')
    return null
  }

  return (
    <DraggableElement config={qrConfig} onClick={onClick} />
  )
}

export default QrCodeElement