import { BackroadNodeManager } from '@backroad/backroad';
import Jimp from 'jimp';
export const backroadFileUploadExample = async (br: BackroadNodeManager) => {
  const photos = br.fileUpload({ accept: '*.png' });
  if (photos.length) {
    br.write({ body: '# Greyscale image' });
    const image = await Jimp.read(photos[0].buffer);
    image.greyscale().getBase64(Jimp.AUTO, (err, res) => {
      br.image({ src: res, width: 400 });
    });
  }
};
