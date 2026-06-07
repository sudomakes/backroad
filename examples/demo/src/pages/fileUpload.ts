import { BackroadNodeManager } from '@backroad/backroad';
import sharp from 'sharp';
export const backroadFileUploadExample = async (br: BackroadNodeManager) => {
  const [photo] = br.fileUpload({ label: 'Pick Image' });
  if (photo) {
    br.write({ body: '# Greyscale image' });
    const buffer = await sharp(photo.filepath).grayscale().png().toBuffer();
    const src = `data:image/png;base64,${buffer.toString('base64')}`;

    br.image({ src, width: 600 });
  }
};
