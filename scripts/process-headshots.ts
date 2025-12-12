import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const headshotsDir = path.join(process.cwd(), 'public', 'headshots');
const outputDir = path.join(process.cwd(), 'public', 'headshots');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processHeadshot(inputPath: string, outputPath: string) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      console.error(`Could not read metadata for ${inputPath}`);
      return;
    }

    // For headshots, create a square focusing on the upper-center where faces are
    // Use the width as the base size to ensure we get the full width
    const size = Math.min(metadata.width, metadata.height);
    
    // Center horizontally, start from top to include head area
    const left = Math.floor((metadata.width - size) / 2);
    const top = 0; // Start from top to ensure head isn't cut off
    
    // Create a temporary file path
    const tempPath = outputPath + '.tmp';
    
    // Process the image:
    // 1. Extract a square from upper-center (ensuring head/face area is included)
    // 2. Resize to 400x400 for consistent size
    // 3. Use 'top' gravity to preserve head area during resize
    await image
      .extract({
        left: left,
        top: top,
        width: size,
        height: size
      })
      .resize(400, 400, {
        fit: 'cover',
        position: 'top' // Focus on top area to preserve head
      })
      .jpeg({ quality: 90 })
      .toFile(tempPath);
    
    // Replace original with processed version
    fs.renameSync(tempPath, outputPath);
    
    console.log(`✓ Processed ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

async function processAllHeadshots() {
  const files = fs.readdirSync(headshotsDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  console.log(`Found ${imageFiles.length} headshot images to process...\n`);

  for (const file of imageFiles) {
    const inputPath = path.join(headshotsDir, file);
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(outputDir, `${baseName}${ext}`);
    
    await processHeadshot(inputPath, outputPath);
  }

  console.log(`\n✓ Finished processing ${imageFiles.length} headshots`);
}

processAllHeadshots().catch(console.error);

