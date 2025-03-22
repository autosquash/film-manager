import { invoke } from '@tauri-apps/api/core'
import React, { useEffect } from 'react'

function ImageLoader() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) {
      return
    }
    const file = files[0]
    if (!file) {
      return
    }
    setSelectedFile(file)

    console.log(file)
  }

  // Puedes mostrar la imagen directamente en la vista, creando un blob
  const getImagePreview = () => {
    if (!selectedFile) return null
    return URL.createObjectURL(selectedFile)
  }

  useEffect(() => {
    handleSaveFile()
  }, [selectedFile])

  const handleSaveFile = async () => {
    if (!selectedFile) return

    try {
      // 1) Convertir el File en ArrayBuffer
      const arrayBuffer = await selectedFile.arrayBuffer()

      // 2) Pasar a Uint8Array para poder transformarlo en un array normal
      const uint8Array = new Uint8Array(arrayBuffer)

      // 3) Convertirlo a un array de bytes (números)
      const fileBytes = Array.from(uint8Array)

      // 4) Invocar el comando 'save_image'
      //    El primer argumento es el comando,
      //    el segundo un objeto con los parámetros que definiste en Rust
      await invoke('save_image', {
        fileBytes,
        fileName: selectedFile.name, // o algún nombre personalizado
      })

      alert('Archivo guardado correctamente en la carpeta images!')
    } catch (error) {
      console.error('Error al guardar el archivo:', error)
    }
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
