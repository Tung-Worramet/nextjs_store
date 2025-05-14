"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";
import {
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteProductModal from "@/features/products/components/delete-product-modal";
import { useEffect, useState } from "react";
import RestoreProductModal from "@/features/products/components/restore-product-modal";
import ProductDetailModal from "@/features/products/components/product-detail-modal";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductListProps {
  products: ProductType[];
  totalCount: number;
  page: number;
  limit: number;
}

const ProductList = ({
  products,
  totalCount,
  page,
  limit,
}: ProductListProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / limit);

  // Modal State
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isRestoreModal, setIsRestoreModal] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  // Fix bugs เปิด ปิด dropdown menu desktop
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(products); // ใช้สำหรับกรองแต่ละ status
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let result = [...products];

    if (activeTab === "active") {
      result = result.filter((p) => p.status === "Active");
    } else if (activeTab === "inactive") {
      result = result.filter((p) => p.status === "Inactive");
    } else if (activeTab === "low-stock") {
      result = result.filter((p) => p.stock <= p.lowStock);
    }

    if (searchTerm) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [activeTab, products, searchTerm]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteModal(true);
  };

  const handleRestoreClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsRestoreModal(true);
  };

  const handleDetailClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDetailModal(true);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/products?${params.toString()}`);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">Products</CardTitle>
            <Button asChild className="mb-4">
              <Link href="/admin/products/new">
                <Plus size={16} />
                <span>Add Product</span>
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
              <div className="flex gap-2">
                <Badge variant="outline" className="sm:px-3 py-1">
                  <span className="font-semibold text-blue-600">
                    {products.length}
                  </span>
                  Total
                </Badge>
                <Badge variant="outline" className="sm:px-3 py-1">
                  <span className="font-semibold text-green-600">
                    {products.filter((p) => p.status === "Active").length}
                  </span>
                  Active
                </Badge>
                <Badge variant="outline" className="sm:px-3 py-1">
                  <span className="font-semibold text-gray-500">
                    {products.filter((p) => p.status === "Inactive").length}
                  </span>
                  Inactive
                </Badge>
                <Badge variant="outline" className="sm:px-3 py-1">
                  <span className="font-semibold text-amber-600">
                    {products.filter((p) => p.stock <= p.lowStock).length}
                  </span>
                  Low Stock
                </Badge>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="absolute left-2 top-2.5 text-muted-foreground"
                />
                <Input
                  placeholder="Search products..."
                  className="pl-8 "
                  onChange={(event) => handleSearch(event)}
                />
              </div>
            </div>
          </Tabs>
        </CardHeader>

        {/* Table */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <TableRow key={index}>
                    {/* Product Image */}
                    <TableCell>
                      <Image
                        alt={product.title}
                        src={
                          product.mainImage?.url ||
                          "/images/no-product-image.webp"
                        }
                        width={40}
                        height={40}
                        className="object-cover rounded-md"
                      />
                    </TableCell>

                    {/* Product Name */}
                    <TableCell>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.sku || "No SKU"}
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <div className="text-sm">{product.category.name}</div>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      {/* ราคาที่จะขาย */}
                      <div className="text-sm font-medium">
                        {product.price.toLocaleString()}
                      </div>

                      {/* ราคาเดิม */}
                      {product.basePrice !== product.price && (
                        <div className="text-xs line-through text-muted-foreground">
                          {product.basePrice.toLocaleString()}
                        </div>
                      )}
                    </TableCell>

                    {/* Stock */}
                    <TableCell>
                      <div
                        className={cn("text-sm", {
                          "text-amber-500 font-medium":
                            product.stock <= product.lowStock,
                        })}
                      >
                        {product.stock}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu
                        open={dropdownOpenId === product.id}
                        onOpenChange={(open) =>
                          setDropdownOpenId(open ? product.id : null)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {/* View */}
                          <DropdownMenuItem
                            onClick={() => {
                              handleDetailClick(product);
                              setDropdownOpenId(null); // ปิด dropdown
                            }}
                          >
                            <Eye size={15} />
                            <span>View</span>
                          </DropdownMenuItem>

                          {/* Edit */}
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Pencil size={15} />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {/* Delete or Restore */}
                          {product.status === "Active" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                handleDeleteClick(product);
                                setDropdownOpenId(null); // ปิด dropdown
                              }}
                            >
                              <Trash2 size={15} className="text-destructive" />
                              <span className="text-destructive">Delete</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                handleRestoreClick(product);
                                setDropdownOpenId(null); // ปิด dropdown
                              }}
                            >
                              <RefreshCcw
                                size={15}
                                className="text-green-600"
                              />
                              <span className="text-green-600">Restore</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center h-40 text-muted-foreground"
                  >
                    No Product found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteProductModal
        open={isDeleteModal}
        onOpenChange={setIsDeleteModal}
        product={selectedProduct}
      />

      <RestoreProductModal
        open={isRestoreModal}
        onOpenChange={setIsRestoreModal}
        product={selectedProduct}
      />

      <ProductDetailModal
        open={isDetailModal}
        onOpenChange={setIsDetailModal}
        product={selectedProduct}
      />
    </>
  );
};
export default ProductList;
