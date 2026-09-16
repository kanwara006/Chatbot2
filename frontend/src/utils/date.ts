const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

/** แปลงวันที่แบบ ISO เป็นรูปแบบไทย เช่น "15 พฤษภาคม 2569" (ปี พ.ศ.) */
export function formatThaiDate(isoDate: string): string {
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate
  const day = d.getDate()
  const month = THAI_MONTHS[d.getMonth()]
  const buddhistYear = d.getFullYear() + 543
  return `${day} ${month} ${buddhistYear}`
}
