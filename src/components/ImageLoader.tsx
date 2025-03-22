import React from 'react'

function ImageLoader() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) {
      return
    }
    const file = files[0]
    setSelectedFile(file)
    console.log(file)
  }

  // Puedes mostrar la imagen directamente en la vista, creando un blob
  const getImagePreview = () => {
    if (!selectedFile) return null
    return URL.createObjectURL(selectedFile)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* Vista previa de la imagen (opcional) */}
      {selectedFile && (
        <img
          src={getImagePreview() || undefined}
          alt="Vista previa"
          style={{ maxWidth: 300 }}
        />
      )}
    </div>
  )
}

export default ImageLoader
