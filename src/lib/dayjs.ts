import dayjs from "dayjs"
// plugin relativeTime เพื่อให้สามารถแสดงเวลาแบบสัมพันธ์ เช่น "3 ชั่วโมงที่แล้ว"
import relativeTime from "dayjs/plugin/relativeTime"
import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export default dayjs