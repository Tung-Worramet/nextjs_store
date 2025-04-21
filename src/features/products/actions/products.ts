"use server"

import { InitialFormState } from "@/types/action"
import { createProduct } from "@/features/products/db/products"

export const productAction = async (_prevState: InitialFormState, formData: FormData) => {
    const rawData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        categoryId: formData.get("category-id") as string,
        cost: formData.get("cost") as string,
        basePrice: formData.get("base-price") as string,
        price: formData.get("price") as string,
        stock: formData.get("stock") as string,
    }

    const processedData = {
        ...rawData,
        cost: rawData.cost ? parseFloat(rawData.cost) : undefined,
        basePrice: rawData.basePrice ? parseFloat(rawData.basePrice) : 0,
        price: rawData.price ? parseFloat(rawData.price) : 0,
        stock: rawData.stock ? parseInt(rawData.stock) : 0,
    }

    const result = await createProduct(processedData)

    return result && result.message ? {
        success: false, message: result.message, errors: result.error
    } : {
        success: true, message: "Product create success"
    }
}