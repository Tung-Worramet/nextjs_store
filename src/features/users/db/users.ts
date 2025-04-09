import { db } from "@/lib/db"

export const getUserById = async (id: string) => {
    try {
        return await db.user.findUnique({
            where: {
                id: id,
                status: "Active"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                address: true,
                picture: true,
                tel: true,
            }
        })
    } catch (error) {
        console.error("Error getting user by id:", error)
        return null
    }
}