import { Order, OrderItem } from "@prisma/client";

export interface OrderType extends Order {
    items: (OrderItem & {
        product: ProductType;
    })[]
    customer: UserType;
    createdAtFormatted: string;
    paymentAtFormatted?: string | null;
    totalItems?: number;
}