// const jimp = require('jimp')
import sharp from 'sharp'

sharp.concurrency(Number(process.env.SHARP_CONCURRENCY) || 2)
// Cache libvips borné : il ne sert à rien ici (un rendu = une image), et il garde de la RAM
sharp.cache({ memory: 50, files: 0, items: 50 })
const MAX_GIF_FRAMES = Number(process.env.MAX_GIF_FRAMES) || 150
/*sharp.queue.on('change', function(queueLength) {
  const { queue, process } = sharp.counters()
  console.log(`queue: ${queue}, processing: ${process}`)
})*/

const createTextSVG = (text, { font, fontSize, fontColor, fontBackground, width, height }) => {
  const h = height * 0.2
  const y = height * 0.8
  return Buffer.from(`<svg width="${width}" height="${height}">

    <rect x="0" y="${y}" width="${width}" height="${y}" fill="${fontBackground}"/>
    <text x="${(width / 2) + 1}" y="${y + (h / 2) + 1}" font-size="${fontSize}" fill="black" font-family="${font}" text-anchor="middle">${text}</text>
    <text x="${width / 2}" y="${y + (h / 2)}" font-size="${fontSize}" fill="${fontColor}" font-family="${font}" text-anchor="middle">${text}</text>
  </svg>`)
}

class ImageEditor {
  async edit (
    buffer,
    mimetype,
    {
      type = 'default',
      text = null,
      font = 'impact',
      fontColor = 'white',
      fontSize = 30,
      fontBackground = 'none',
      fontPosition = 'bottom',
      filter = null,
      width,
      height,
      fit = 'cover',
      position = 'center',
      r,
      g,
      b,
      brightness = 1,
      saturation = 1,
      hue = 0,
      lightness = 0,
      blur,
      format,
      quality
    }
  ) {
    const isAnimated = mimetype === 'image/gif'
    const options = { failOn: 'error', limitInputPixels: 50_000_000 }
    const resizeOptions = {
      width,
      height,
      fit,
      position: position.toLowerCase(),
      background: 'black'
    }

    if (isAnimated) {
      options.animated = true
      options.pages = MAX_GIF_FRAMES
    }

    if (type === 'square') {
      resizeOptions.width = 200
      resizeOptions.height = 200
    }

    if (type === 'medium') {
      resizeOptions.width = 400
    }

    if (type === 'small') {
      resizeOptions.width = 300
    }

    if (type === 'xsmall') {
      resizeOptions.width = 100
    }

    let sharpBuffer = sharp(buffer, options).timeout({ seconds: 10 })
    sharpBuffer = sharpBuffer.resize(resizeOptions)

    if (blur) {
      sharpBuffer = sharpBuffer.blur(blur)
    }

    if (filter === 'mono') {
      sharpBuffer = sharpBuffer.greyscale()
    }

    if (filter === 'sepia') {
      // sharpBuffer = sharpBuffer.tint({ r: 7, g: 12, b: 50 })
    }

    if (filter === 'mosaic') {
      // return this.mosaic(buffer);
    }

    if (filter === 'pixel') {
      // return this.pixelate(buffer, mimetype, 8);
    }

    if (filter === 'negative' || filter === 'negate') {
      sharpBuffer = sharpBuffer.negate()
    }

    if (filter === 'paint') {
      // return this.paint(buffer, 5);
    }

    if (filter === 'custom') {
      sharpBuffer = sharpBuffer
        .modulate({
          brightness,
          saturation,
          hue,
          lightness
        })
        .tint({ r, g, b })
    }

    if (text) {
      // metadata() sur un pipeline renvoie les dimensions de l'entrée, pas celles du rendu :
      // on matérialise d'abord l'image redimensionnée pour superposer un calque de même taille
      const data = await sharpBuffer.toBuffer()
      sharpBuffer = sharp(data, options).timeout({ seconds: 10 })
      // pageHeight = hauteur d'une image (pour un GIF animé, height est la somme de toutes les images)
      const info = await sharpBuffer.metadata()
      sharpBuffer = sharpBuffer.composite([
        {
          input: createTextSVG(text, { font, fontSize, fontColor, fontBackground, fontPosition, width: info.width, height: info.pageHeight || info.height }),
          tile: isAnimated
        }
      ])
    }

    // AVIF sur un GIF animé : trop coûteux en CPU/RAM, repli sur webp
    if (format === 'avif' && isAnimated) format = 'webp'

    if (format) {
      sharpBuffer = sharpBuffer.toFormat(format, quality ? { quality: Number(quality) } : {})
    }

    return sharpBuffer.toBuffer()
  }

  async solid (
    width,
    height,
    color,
    {
      text = null,
      font = 'impact',
      fontSize = 30,
      fontColor = 'white',
      fontBackground = 'none',
      format = 'png',
      quality
    } = {}
  ) {
    let image = sharp({ create: { width, height, channels: 4, background: color } })

    if (text) {
      // Même démarche que edit() : le calque doit avoir la taille du rendu
      image = sharp(await image.png().toBuffer()).composite([
        { input: createTextSVG(text, { font, fontSize, fontColor, fontBackground, width, height }) }
      ])
    }

    return image.toFormat(format, quality ? { quality: Number(quality) } : {}).toBuffer()
  }

  readFile (path) {
    return sharp(path).toBuffer()
  }

  metadata (buffer) {
    return sharp(buffer).metadata()
  }

  resize (buffer, width, height) {
    return sharp(buffer).resize(width, height).toBuffer()
  }

  writeFile (buffer, path) {
    return sharp(buffer).toFile(path)
  }

  /* pixelate(buffer, mimetype, size) {
    return new Promise((resolve, reject) => {
      jimp.read(buffer).then(image => {
        image.pixelate(size).getBuffer(mimetype, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer);
          }
        });
      }).catch(err => reject(err));
    });
  } */
}

export default new ImageEditor()
