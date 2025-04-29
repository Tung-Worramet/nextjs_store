import Modal from "@/components/shared/modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ProductType } from "@/types/product";
import { TabsList } from "@radix-ui/react-tabs";
import { Clock, Package, Tag } from "lucide-react";
import Image from "next/image";
import dayjs from "@/lib/dayjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/formatPrice";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const ProductDetailModal = ({
  open,
  onOpenChange,
  product,
}: ProductDetailModalProps) => {
  if (!product) return null;

  const formattedDate = dayjs(product.createdAt).fromNow();

  const stockColor = (() => {
    switch (true) {
      case product.stock <= 0:
        return "text-red-600";
      case product.stock <= product.lowStock:
        return "text-amber-500";
      default:
        return "text-green-600";
    }
  })();

  const stockStatus = (() => {
    switch (true) {
      case product.stock <= 0:
        return "Out of stock";
      case product.stock <= product.lowStock:
        return "Low stock";
      default:
        return "In stock";
    }
  })();

  const discount =
    product.basePrice > product.price
      ? (
          ((product.basePrice - product.price) / product.basePrice) *
          100
        ).toFixed(2)
      : "0";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={product.title}
      description={`SKU: ${product.sku}`}
      className="md:max-w-3xl"
    >
      <div>
        <Tabs>
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">
              Images ({product.images.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                  {/* Main Image */}
                  <div className="relative aspect-square border rounded-md overflow-hidden group">
                    <Image
                      alt={product.title}
                      src={
                        product.mainImage?.url ||
                        "/images/no-product-image.webp"
                      }
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Tag size={12} />
                        <span>{product.category.name}</span>
                      </Badge>
                    </div>

                    <h2 className="text-xl font-bold line-clamp-2 mb-1">
                      {product.title}
                    </h2>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Clock size={12} />
                      <span>Added {formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        <span className={`text-sm font-medium ${stockColor}`}>
                          {stockStatus}
                        </span>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        ({product.stock} items left)
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-wrap items-baseline gap-2 mb-1">
                        <span>{formatPrice(product.price)}</span>

                        {product.basePrice > product.price && (
                          <div>
                            <span className="text-sm line-through text-muted-foreground">
                              {formatPrice(product.basePrice)}
                            </span>
                            <Badge>{discount}% off</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="details">Details</TabsContent>
          <TabsContent value="images">Images</TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
};
export default ProductDetailModal;
