import ImageKit from "imagekit";
import sharp from "sharp";


const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
});

export const uploadToImageKit = async (file: File, label: string) => {
    try {
        if (!file) {
            return {
                message: "No file provided"
            }
        }

        // Check file size
        if (file.size > 5 * 1024 * 1024) {
            return {
                message: "File size must be less than 5MB"
            }
        }

        // Read file buffer
        const buffer = await file.arrayBuffer();

        const processImageBuffer = await sharp(Buffer.from(buffer))
            .webp({
                quality: 80,
                lossless: false,
                effort: 4
            })
            .resize({
                width: 1200,
                height: 1200,
                fit: "inside",
                withoutEnlargement: true
            })
            .toBuffer();

        // Upload to ImageKit
        const result = await imagekit.upload({
            file: processImageBuffer,
            fileName: `${label}_${Date.now()}_${file.name}`,
            folder: `/${label}`
        })

        return { url: result.url, fileId: result.fileId };
    } catch (error) {
        console.error("Error uploading image to ImageKit:", error);
        return {
            message: "Failed to upload image"
        }
    }
}