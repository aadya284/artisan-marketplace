import { readFileSync } from 'fs';
import { join } from 'path';

// Load artworks from the JSON file at build time
function getAllArtworkIds() {
  try {
    const jsonPath = join(process.cwd(), 'src', 'data', 'artworks.json');
    const artworksData = JSON.parse(readFileSync(jsonPath, 'utf8'));
    return artworksData.map((artwork: any) => ({
      id: artwork.id.toString()
    }));
  } catch (error) {
    console.error('Error reading artworks.json:', error);
    return [];
  }
}

export function generateStaticParams() {
  return getAllArtworkIds();
}