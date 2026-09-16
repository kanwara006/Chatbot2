from datetime import datetime
from zoneinfo import ZoneInfo

BANGKOK_TZ = ZoneInfo("Asia/Bangkok")


def now_th() -> datetime:
    """
    เวลาปัจจุบันตามโซนเวลาไทย (Asia/Bangkok, UTC+7) แบบ naive datetime
    (ตัด tzinfo ออกก่อน เพื่อไม่ให้ driver ของ DB แปลงกลับเป็น UTC ตอนบันทึกลงคอลัมน์ DateTime ที่ไม่มี timezone)
    """
    return datetime.now(BANGKOK_TZ).replace(tzinfo=None)
