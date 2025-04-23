"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImagePlus, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ProductImageUploadProps {
  onImageChange: (images: File[], mainIndex: number) => void;
}

const ProductImageUpload = ({ onImageChange }: ProductImageUploadProps) => {
  // สร้าง ref สำหรับ input type="file" เพื่อควบคุมการเปิดหน้าต่างเลือกไฟล์
  const fileInputRef = useRef<HTMLInputElement>(null);

  // สร้าง state สำหรับเก็บ URL ของรูปภาพที่จะแสดง preview
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // เก็บ index ของรูปหลัก (Main Image) ที่ผู้ใช้เลือก
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // เก็บไฟล์รูปภาพที่ผู้ใช้เลือกทั้งหมด (เพื่อนำไปอัปโหลด)
  const [selectedFile, setSelectedFile] = useState<File[]>([]);

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
    if (newPreviewUrls.length > 0) {
      setMainImageIndex(0);
    }

    // ส่งข้อมูลไฟล์และ index ของรูปหลัก ไปยังฟังก์ชันของ parent component ส่งไปให้ product-form
    onImageChange([...selectedFile, ...imageFiles], mainImageIndex);

    // เคลียร์ค่า input file เพื่อให้สามารถเลือกไฟล์ซ้ำได้
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSetMain = (index: number) => {
    // กำหนด index ของรูปหลักตามที่เลือก
    setMainImageIndex(index);

    // แจ้ง parent component ว่ามีการเปลี่ยนรูปหลัก ส่งไปให้ product-form
    onImageChange(selectedFile, index);
  };

  const handleRemoveImage = (index: number) => {
    // ลบไฟล์ที่ตำแหน่ง index ออกจาก state
    const newFiles = selectedFile.filter((_, i) => i !== index);

    // ลบ URL ชั่วคราวที่สร้างจาก URL.createObjectURL
    URL.revokeObjectURL(previewUrls[index]);

    // ลบ URL ของรูปที่ถูกลบออกจาก state
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);
    setSelectedFile(newFiles);

    // ปรับค่า mainImageIndex หากรูปที่ถูกลบคือรูปหลัก
    if (mainImageIndex === index) {
      setMainImageIndex(0); // รีเซ็ตรูปหลักเป็นรูปแรก
    } else if (mainImageIndex > index) {
      setMainImageIndex((prevIndex) => prevIndex - 1); // ขยับ index ลง
    }

    // คำนวณค่า mainImageIndex ใหม่เพื่อส่งกลับไปยัง parent component
    const setMainIndexForParent = () => {
      if (mainImageIndex === index) {
        return 0;
      } else if (mainImageIndex > index) {
        return mainImageIndex - 1;
      } else {
        return mainImageIndex;
      }
    };

    // แจ้ง parent ว่ามีการเปลี่ยนแปลงรูปและ index ของรูปหลัก และส่งไปให้ product-form
    onImageChange(newFiles, setMainIndexForParent());
  };

  return (
    <div>
      <Label>
        Product Images<span className="text-red-500">*</span>
      </Label>
      {/* Preview images area */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className={cn(
                "relative aspect-square group border rounded-md overflow-hidden",
                {
                  "ring-2 ring-primary": mainImageIndex === index,
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
              {mainImageIndex === index && (
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
                      "fill-yellow-400 text-yellow-400":
                        mainImageIndex === index,
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
      {previewUrls.length === 0 && (
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
