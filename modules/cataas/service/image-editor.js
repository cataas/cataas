// const jimp = require('jimp')
const sharp = require('sharp')

sharp.concurrency(process.env.UV_THREADPOOL_SIZE || 8)
sharp.queue.on('change', function(queueLength) {
  const { queue, process } = sharp.counters()
  console.log(`queue: ${queue}, processing: ${process}`)
})

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
      blur
    }
  ) {
    const isAnimated = mimetype === 'image/gif'
    const options = { failOn: 'error' }
    const resizeOptions = {
      width,
      height,
      fit,
      position: position.toLowerCase(),
      background: 'black'
    }

    if (isAnimated) {
      options.animated = true
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

    let sharpBuffer = sharp(buffer, options).timeout({ seconds: 10000 })
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
      const metadata = await sharpBuffer.metadata()
      const compositeWidth = resizeOptions.width || metadata.width
      const compositeHeight = resizeOptions.height || metadata.pageHeight || metadata.height
      sharpBuffer = sharpBuffer.composite([
        {
          input: createTextSVG(text, { font, fontSize, fontColor, fontBackground, fontPosition, width: compositeWidth, height: compositeHeight }),
          tile: isAnimated
        }
      ])
    }

    return sharpBuffer.toBuffer()
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

module.exports = new ImageEditor()
