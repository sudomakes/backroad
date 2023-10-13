import { BackroadNodeManager } from '@backroad/backroad';
import Jimp from 'jimp';
export const backroadFileUploadExample = async (br: BackroadNodeManager) => {
  const [photo] = br.fileUpload({ label: 'Pick Image' });
  if (photo) {
    br.write({ body: '# Greyscale image' });
    const image = await Jimp.read(photo.buffer);
    image.greyscale().getBase64(Jimp.AUTO, (err, res) => {
      br.image({ src: res, width: 600 });
    });
  }
};
