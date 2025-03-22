import React from 'react'

export type FileData = {
  ext: string
  fileBytes: readonly number[]
}

type Props = Readonly<{
  movieTitle: string
  onSave: (data: FileData) => void
}>

function ImageLoader({ onSave }: Props) {
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
      // 1) Convertir el File en ArrayBuffer
      const arrayBuffer = await selectedFile.arrayBuffer()

      // 2) Pasar a Uint8Array para poder transformarlo en un array normal
      const uint8Array = new Uint8Array(arrayBuffer)

      // 3) Convertirlo a un array de bytes (números)
      const fileBytes = Array.from(uint8Array)

      if (!selectedFile.name.includes('.')) {
        return
      }
      const [base, ext] = selectedFile.name.split('.')
      if (!base || !ext) {
        return
      }
      onSave({ fileBytes, ext })
    } catch (error) {
      console.error('Error al guardar el archivo:', error)
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

export default ImageLoader
