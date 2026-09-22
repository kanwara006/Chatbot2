import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from app.core.config import settings

logger = logging.getLogger(__name__)


def send_email(to_email: str, subject: str, body: str) -> bool:
    """
    ส่งอีเมลผ่าน SMTP ตามค่าที่ตั้งไว้ใน settings
    คืนค่า True หากส่งสำเร็จ, False หากส่งไม่สำเร็จหรือยังไม่ได้ตั้งค่า SMTP
    """
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_FROM_EMAIL:
        logger.warning("SMTP is not configured — skipping email send to %s", to_email)
        return False

    msg = MIMEMultipart()
    # ใช้อีเมลล้วนๆ เป็นชื่อผู้ส่ง ไม่ใส่ชื่อไทยแสดง เพื่อเลี่ยงปัญหาไคลเอนต์บางตัวไม่ยอมถอดรหัส RFC 2047
    msg["From"] = settings.SMTP_FROM_EMAIL
    msg["To"] = to_email
    msg["Subject"] = Header(subject, "utf-8").encode()
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, [to_email], msg.as_string())
        return True
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to_email, e)
        return False


def build_contact_reply_email(full_name: str, original_subject: str, original_message: str, reply: str) -> tuple[str, str]:
    """สร้างหัวข้อและเนื้อหาอีเมลตอบกลับข้อความติดต่อ คืนค่าเป็น (subject, body)"""
    subject = f"Re: {original_subject}" if original_subject else "ตอบกลับข้อความติดต่อของท่าน"
    body = (
        f"เรียน คุณ{full_name}\n\n"
        f"{reply}\n\n"
        "-------------------------------------\n"
        "ข้อความเดิมของท่าน:\n"
        f"{original_message}\n\n"
        "-------------------------------------\n"
        f"{settings.SMTP_FROM_NAME}"
    )
    return subject, body
