function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('decode failed'))
    img.src = src
  })
}

export async function readImageNaturalSize(_file: File, objectUrl: string): Promise<{
  width: number
  height: number
}> {
  const img = await loadImage(objectUrl)
  return { width: img.naturalWidth, height: img.naturalHeight }
}
