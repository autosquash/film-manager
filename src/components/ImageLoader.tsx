import React from 'react'
import { useTranslation } from 'react-i18next'

export type FileData = {
  ext: string
  fileBytes: readonly number[]
}

type Props = Readonly<{
  movieTitle: string
  onSave: (data: FileData) => void
}>

function ImageLoader({ onSave }: Props) {
  const { t } = useTranslation()
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) {
      return
    }
    const file = files[0]
    if (!file) {
      return
    }
    handleSaveFile(file)
    setImagePreview(getImagePreview(file))
  }

  const handleSaveFile = async (selectedFile: File) => {
    if (!selectedFile) return

    try {
      const fileBytes = await fileToBytes(selectedFile)

      if (!selectedFile.name.includes('.')) {
        return
      }
      const [base, ext] = selectedFile.name.split('.')
      if (!base || !ext) {
        return
      }
      onSave({ fileBytes, ext })
    } catch (error) {
      console.error(`${t('savingError')}:`, error)
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imagePreview && (
        <img
          src={imagePreview || undefined}
          alt="Vista previa"
          style={{ maxWidth: 300 }}
        />
      )}
    </div>
  )
}

const getImagePreview = (selectedFile: File | null): string | null => {
  if (!selectedFile) return null
  return URL.createObjectURL(selectedFile)
}

async function fileToBytes(selectedFile: File): Promise<number[]> {
  // Convert the File to an ArrayBuffer
  const arrayBuffer = await selectedFile.arrayBuffer()

  // Convert to Uint8Array to be able to transform it into a regular array
  const uint8Array = new Uint8Array(arrayBuffer)

  // Convert it to an array of bytes (numbers)
  const fileBytes = Array.from(uint8Array)
  return fileBytes
}

export default ImageLoader
