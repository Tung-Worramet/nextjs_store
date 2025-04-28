"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductImage } from "@prisma/client";
import { ImagePlus, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface ProductImageUploadProps {
  onImageChange: (
    images: File[],
    mainIndex: number,
    deletedIds?: string[]
  ) => void;
  existingImages?: ProductImage[];
}

const ProductImageUpload = ({
  onImageChange,
  existingImages = [],
}: ProductImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null); // สร้าง ref สำหรับ input type="file" เพื่อควบคุมการเปิดหน้าต่างเลือกไฟล์

  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // สร้าง state สำหรับเก็บ URL ของรูปภาพที่จะแสดง preview

  const [mainImageIndex, setMainImageIndex] = useState(0); // เก็บ index ของรูปหลัก (Main Image) ที่ผู้ใช้เลือก

  const [selectedFile, setSelectedFile] = useState<File[]>([]); // เก็บไฟล์รูปภาพที่ผู้ใช้เลือกทั้งหมด (เพื่อนำไปอัปโหลด)

  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]); // เก็บ id ของรูปเก่าที่ลบ

  const [initialMainImageSet, setInitialMainImageSet] = useState(false); // ป้องกันตั้ง main image ซ้ำ

  const [existingImagesState, setExistingImagesState] =
    useState(existingImages); // จัดการรูปเก่าใน state

  // ฟังก์ชันแจ้ง Parent ทุกครั้งที่มีการเปลี่ยนแปลงข้อมูล
  const notifyToParent = useCallback(() => {
    onImageChange(selectedFile, mainImageIndex, deletedImageIds);
  }, [selectedFile, mainImageIndex, deletedImageIds, onImageChange]);

  // ตั้งค่ารูปหลักจาก existing images ครั้งแรก + แจ้ง parent เมื่อ state เปลี่ยน
  useEffect(() => {
    if (existingImagesState.length > 0 && !initialMainImageSet) {
      // หา index ของรูปหลักใน existingImagesState
      const mainIndex = existingImagesState.findIndex((image) => image.isMain);
      if (mainIndex >= 0) {
        setMainImageIndex(mainIndex);
        setInitialMainImageSet(true);
      }
    }

    notifyToParent();
  }, [existingImagesState, notifyToParent, initialMainImageSet]);

  // เปิดหน้าต่างเลือกไฟล์ (File Picker)
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ดึงไฟล์ทั้งหมดจาก input (แปลงเป็น Array)
    const files = Array.from(event.target.files || []);

    // ถ้าไม่ได้เลือกไฟล์เลย ให้หยุดทำงาน
    if (files.length === 0) return;

    // กรองเอาเฉพาะไฟล์ที่เป็นรูปภาพ (image/*)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    // ถ้าไม่มีไฟล์รูปภาพเลย ให้หยุดทำงาน
    if (imageFiles.length === 0) return;

    // สร้าง URL สำหรับแสดงรูป preview (แบบชั่วคราว)
    const newPreviewUrls = imageFiles.map((file) => URL.createObjectURL(file));

    // ถ้ามีรูปเดิมอยู่แล้ว ให้เพิ่มรูปใหม่เข้าไปต่อท้าย
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);

    // เก็บไฟล์รูปภาพเข้า state เพื่อใช้สำหรับอัปโหลด (เช่นส่งไป Cloud)
    setSelectedFile((prev) => [...prev, ...imageFiles]);

    // ถ้าเลือกรูปใหม่มา ให้กำหนด index ของรูปหลักเป็น 0
    if (
      existingImagesState.length === 0 &&
      selectedFile.length === 0 &&
      imageFiles.length > 0
    ) {
      setMainImageIndex(0);
    }

    // // ส่งข้อมูลไฟล์และ index ของรูปหลัก ไปยังฟังก์ชันของ parent component ส่งไปให้ product-form
    // onImageChange([...selectedFile, ...imageFiles], mainImageIndex);

    // เคลียร์ค่า input file เพื่อให้สามารถเลือกไฟล์ซ้ำได้
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSetMain = (index: number, isExiting = false) => {
    if (isExiting) {
      setMainImageIndex(index);
    } else {
      setMainImageIndex(existingImagesState.length + index);
    }

    // // กำหนด index ของรูปหลักตามที่เลือก
    // setMainImageIndex(index);

    // // แจ้ง parent component ว่ามีการเปลี่ยนรูปหลัก ส่งไปให้ product-form
    // onImageChange(selectedFile, index);
  };

  const handleRemoveImage = (index: number, isExiting = false) => {
    if (isExiting) {
      const imageToRemove = existingImagesState[index];
      setDeletedImageIds((prev) => [...prev, imageToRemove.id]);
      setExistingImagesState(existingImagesState.filter((_, i) => i !== index));

      if (mainImageIndex === index) {
        if (existingImagesState.length > 0) {
          setMainImageIndex(0);
        } else if (selectedFile.length > 0) {
          setMainImageIndex(0);
        } else {
          setMainImageIndex(-1);
        }
      } else if (mainImageIndex > index) {
        setMainImageIndex((prev) => prev - 1);
      }
    } else {
      URL.revokeObjectURL(previewUrls[index]);

      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
      setSelectedFile(selectedFile.filter((_, i) => i !== index));

      const actualRemovedIndex = existingImagesState.length + index;
      if (mainImageIndex === actualRemovedIndex) {
        if (existingImagesState.length > 0) {
          setMainImageIndex(0);
        } else if (selectedFile.length > 0) {
          setMainImageIndex(0);
        } else {
          setMainImageIndex(-1);
        }
      } else if (mainImageIndex > actualRemovedIndex) {
        setMainImageIndex((prev) => prev - 1);
      }
    }
  };

  const isMainImage = (index: number, isExisting = false) => {
    const actualIndex = isExisting ? index : existingImagesState.length + index;
    return mainImageIndex === actualIndex;
  };

  return (
    <div>
      <Label>
        Product Images<span className="text-red-500">*</span>
      </Label>

      {/* Preview images area */}
      {(existingImagesState.length > 0 || previewUrls.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {/* Existing Images */}
          {existingImagesState.map((image, index) => (
            <div
              key={`existing-${index}`}
              className={cn(
                "relative aspect-square group border rounded-md overflow-hidden",
                {
                  "ring-2 ring-primary": isMainImage(index, true),
                }
              )}
            >
              <Image
                alt={`Product Image ${index + 1}`}
                src={image.url}
                fill
                className="object-cover"
              />

              {/* Main Image Badge */}
              {isMainImage(index, true) && (
                <Badge className="absolute top-1 left-1">Main</Badge>
              )}

              {/* Image Control Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1 right-1 flex items-center gap-1">
                {/* Favorite Button */}
                <Button
                  type="button"
                  variant="secondary"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => handleSetMain(index, true)}
                >
                  <Star
                    size={16}
                    className={cn({
                      "fill-yellow-400 text-yellow-400": isMainImage(
                        index,
                        true
                      ),
                    })}
                  />
                </Button>

                {/* Delete Button */}
                <Button
                  type="button"
                  variant="destructive"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => handleRemoveImage(index, true)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          {previewUrls.map((url, index) => (
            <div
              key={`new-${index}`}
              className={cn(
                "relative aspect-square group border rounded-md overflow-hidden",
                {
                  "ring-2 ring-primary": isMainImage(index, false),
                }
              )}
            >
              <Image
                alt={`Product Image ${index + 1}`}
                src={url}
                fill
                className="object-cover"
              />

              {/* Main Image Badge */}
              {isMainImage(index, false) && (
                <Badge className="absolute top-1 left-1">Main</Badge>
              )}

              {/* Image Control Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1 right-1 flex items-center gap-1">
                {/* Favorite Button */}
                <Button
                  type="button"
                  variant="secondary"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => handleSetMain(index)}
                >
                  <Star
                    size={16}
                    className={cn({
                      "fill-yellow-400 text-yellow-400": isMainImage(
                        index,
                        false
                      ),
                    })}
                  />
                </Button>

                {/* Delete Button */}
                <Button
                  type="button"
                  variant="destructive"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <div
            className="aspect-square border rounded-md flex items-center justify-center cursor-pointer hover:bg-muted transition-colors"
            onClick={triggerFileInput}
          >
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Plus size={24} />
              <span className="text-xs">Add Image</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload image button */}
      {existingImagesState.length === 0 && previewUrls.length === 0 && (
        <div
          className="border rounded-md p-8 flex flex-col items-center gap-2 justify-center cursor-pointer hover:bg-muted transition-colors"
          onClick={triggerFileInput}
        >
          <ImagePlus size={40} />
          <Button type="button" variant="secondary" size="sm">
            Browse Files
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFileChange(event)}
      />
    </div>
  );
};

export default ProductImageUpload;
