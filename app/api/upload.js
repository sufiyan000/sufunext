// pages/api/upload.js
import cloudinary from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Limit the image size if needed
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body;

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: 'nextjs_uploads', // Optional: specify a folder
      });

      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
