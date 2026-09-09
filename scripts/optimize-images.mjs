import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const inputDir = path.resolve('public/projects')
const outputDir = path.resolve('public/projects/optimized')

const widths = [640, 960, 1440]

await mkdir(outputDir, { recursive: true })

const files = await readdir(inputDir)

const images = files.filter((file) =>
  /\.(png|jpe?g)$/i.test(file)
)

for (const file of images) {
  const input = path.join(inputDir, file)
  const name = path.parse(file).name

  for (const width of widths) {
    const output = path.join(
      outputDir,
      `${name}-${width}.webp`
    )

    await sharp(input)
      .rotate()
      .resize({
        width,
        withoutEnlargement: true,
      })
      .webp({
        quality: 78,
        effort: 6,
      })
      .toFile(output)

    console.log(`Generated ${output}`)
  }
}

console.log('Project image optimization complete.')
