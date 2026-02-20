// Composable para procesamiento de imágenes de propiedades
// Redimensiona, aplica marca de agua y convierte a WebP

export const useImageProcessor = () => {
  const processPropertyImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const img = new Image()
          img.onload = async () => {
            // Calcular dimensiones con ancho máximo de 1200px
            const MAX_WIDTH = 1200
            let targetWidth = img.width
            let targetHeight = img.height

            if (img.width > MAX_WIDTH) {
              const ratio = MAX_WIDTH / img.width
              targetWidth = MAX_WIDTH
              targetHeight = Math.round(img.height * ratio)
            }

            // Crear canvas con dimensiones objetivo
            const canvas = document.createElement('canvas')
            canvas.width = targetWidth
            canvas.height = targetHeight
            const ctx = canvas.getContext('2d')

            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

            // Cargar marca de agua
            const watermarkImg = new Image()
            watermarkImg.crossOrigin = 'anonymous'
            watermarkImg.src = '/logotipo-euroinmo.png'

            watermarkImg.onload = () => {
              // Calcular tamaño de la marca de agua (30% de la dimensión menor)
              const watermarkSize = Math.min(targetWidth, targetHeight) * 0.3
              const watermarkWidth = watermarkImg.width * (watermarkSize / watermarkImg.height)
              const watermarkHeight = watermarkSize

              // Posicionar en el centro
              const x = (targetWidth - watermarkWidth) / 2
              const y = (targetHeight - watermarkHeight) / 2

              // Aplicar opacidad (22%)
              ctx.globalAlpha = 0.22
              ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight)
              ctx.globalAlpha = 1.0

              // Convertir a WebP con calidad 0.80
              exportToWebP(canvas, file, resolve)
            }

            watermarkImg.onerror = () => {
              // Si falla la marca de agua, igual redimensionar y convertir a WebP
              exportToWebP(canvas, file, resolve)
            }
          }
          img.src = e.target.result
        } catch (error) {
          console.error('Error procesando imagen:', error)
          resolve(file)
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  const exportToWebP = (canvas, originalFile, resolve) => {
    const outputType = 'image/webp'
    const quality = 0.80
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Error: canvas.toBlob retornó null')
        resolve(originalFile)
        return
      }
      const baseName = originalFile.name.replace(/\.(jpeg|jpg|png|webp|gif|bmp)$/i, '')
      const processedFile = new File(
        [blob],
        `${baseName}.webp`,
        { type: outputType }
      )
      resolve(processedFile)
    }, outputType, quality)
  }

  return { processPropertyImage }
}
