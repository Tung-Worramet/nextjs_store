type CACHE_TAG = "users"

// ดึงข้อมูลจาก cache โดยใช้ tag
export const getGlobalTag = (tag: CACHE_TAG) => {
    return `global:${tag}` as const
}

// ดึงข้อมูลจาก cache โดยใช้ tag และ id
export const getIdTag = (tag: CACHE_TAG, id: string) => {
    return `id:${id}-${tag}` as const
}