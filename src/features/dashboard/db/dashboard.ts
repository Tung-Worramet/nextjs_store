import { authCheck } from "@/features/auths/db/auths";
import dayjs from "@/lib/dayjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface DateRangeParams {
    from: string;
    to: string;
}

interface DailyDataRecord {
    [key: string]: {
        date: string;
        revenue: number;
        cost: number;
        profit: number;
    };
}

export const getSalesData = async ({ from, to }: DateRangeParams) => {
    const user = await authCheck();

    if (!user || user.role !== "Admin") {
        redirect("/");
    }

    try {
        const startDate = dayjs(from).startOf("day").format()
        const endDate = dayjs(to).endOf("day").format()

        const orders = await db.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        const dailyData: DailyDataRecord = {};

        orders.forEach((order) => {
            const date = dayjs(order.createdAt).format("YYYY-MM-DD");

            if (!dailyData[date]) {
                dailyData[date] = {
                    date,
                    revenue: 0,
                    cost: 0,
                    profit: 0
                }
            }

            const revenue = order.totalAmount
            const cost = order.items.reduce((sum, item) =>
                sum + item.product.cost * item.quantity
                , 0)
            const profit = revenue - cost

            dailyData[date].revenue += revenue
            dailyData[date].cost += cost
            dailyData[date].profit += profit
        })

        const totalDays = dayjs(endDate).diff(startDate, "day") + 1

        for (let i = 0; i < totalDays; i++) {
            const date = dayjs(startDate).add(i, "day").format("YYYY-MM-DD")

            if (!dailyData[date]) {
                dailyData[date] = {
                    date,
                    revenue: 0,
                    cost: 0,
                    profit: 0
                }
            }
        }

        // เรียงข้อมูลให้เป็นลําดับตามวันที่
        const dailyDataSort = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date))

        return dailyDataSort
    } catch (error) {
        console.error("Error getting sale data:", error);
        return [];
    }
}
