import { chatsApi } from "@/entities/chats"
import { useState } from "react"

export function useImageUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const { url } = await chatsApi.uploadImage(file);
      setImageUrl(url);
    } catch (error) {
      setImagePreview(null);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageUrl(null);
  };

  return { imagePreview, imageUrl, isUploading, uploadImage, clearImage };
}
