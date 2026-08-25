from datetime import datetime, timezone
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.announcement import Announcement
from app.models.faq import FAQ
from app.models.document import Document


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Admin User
        admin = db.query(User).filter(User.email == "admin@psu.ac.th").first()
        if not admin:
            admin = User(
                first_name="Admin",
                last_name="PSU",
                student_id="admin01",
                email="admin@psu.ac.th",
                faculty="งานกองทุน กยศ.",
                department="วิทยาเขตสุราษฎร์ธานี",
                password_hash=get_password_hash("admin123"),
                role="admin",
                is_active=True
            )
            db.add(admin)
            print("[OK] Created default admin user: admin@psu.ac.th / admin123")

        # 2. Student User
        student = db.query(User).filter(User.email == "somchai.j@psu.ac.th").first()
        if not student:
            student = User(
                first_name="สมชาย",
                last_name="ใจดี",
                student_id="65123456789",
                email="somchai.j@psu.ac.th",
                faculty="คณะวิทยาศาสตร์และเทคโนโลยีอุตสาหกรรม",
                department="วิทยาการคอมพิวเตอร์",
                password_hash=get_password_hash("student123"),
                role="student",
                is_active=True
            )
            db.add(student)
            print("[OK] Created sample student user: somchai.j@psu.ac.th / student123")

        # 3. Seed FAQs
        if db.query(FAQ).count() == 0:
            sample_faqs = [
                FAQ(
                    question="ใครมีสิทธิ์กู้ยืมเงิน กยศ. บ้าง?",
                    answer="นักศึกษาที่มีคุณสมบัติ: 1. มีรายได้ครอบครัวไม่เกิน 360,000 บาทต่อปี 2. เป็นนักศึกษามหาวิทยาลัยสงขลานครินทร์ 3. มีผลการเรียนและความประพฤติตามเกณฑ์",
                    category="การสมัคร",
                    order_num=1,
                    is_active=True
                ),
                FAQ(
                    question="ต้องเตรียมเอกสารอะไรบ้างในการกู้ยืม กยศ.?",
                    answer="เอกสารที่ต้องใช้: สำเนาบัตรประชาชนนักศึกษาและผู้ปกครอง, สำเนาทะเบียนบ้าน, หนังสือรับรองรายได้ครอบครัว, รูปถ่าย 1 นิ้ว 2 รูป",
                    category="เอกสาร",
                    order_num=2,
                    is_active=True
                ),
                FAQ(
                    question="ต้องทำกิจกรรมจิตอาสากี่ชั่วโมง?",
                    answer="ผู้กู้ยืม กยศ. ต้องทำกิจกรรมจิตอาสาไม่น้อยกว่า 36 ชั่วโมงต่อปีการศึกษา และบันทึกผ่านระบบ กยศ. Connect",
                    category="จิตอาสา",
                    order_num=3,
                    is_active=True
                ),
                FAQ(
                    question="ผู้กู้รายเก่าต้องดำเนินการอย่างไรเพื่อต่อสัญญา?",
                    answer="เข้าสู่ระบบ กยศ. Connect ตรวจสอบชั่วโมงจิตอาสา (ต้องครบ 36 ชั่วโมง) และยื่นคำขอกู้ยืมใหม่พร้อมส่งเอกสารตามกำหนดการ",
                    category="การสมัคร",
                    order_num=4,
                    is_active=True
                ),
            ]
            db.add_all(sample_faqs)
            print("[OK] Seeded sample FAQs")

        # 4. Seed Announcements
        if db.query(Announcement).count() == 0:
            sample_announcements = [
                Announcement(
                    title="เปิดระบบผู้กู้ยืม กยศ. ภาคเรียนที่ 1/2569",
                    content="กองทุนเงินให้กู้ยืมเพื่อการศึกษาเปิดรับการลงทะเบียนสำหรับภาคเรียนที่ 1/2569 นักศึกษาที่ประสงค์จะกู้ยืมสามารถยื่นเอกสารได้ตามขั้นตอน",
                    category="การกู้ยืม",
                    academic_year="2569",
                    is_published=True
                ),
                Announcement(
                    title="กำหนดการส่งเอกสารประกอบการกู้ยืม ภาคเรียนที่ 1/2569",
                    content="ขอให้นักศึกษาส่งเอกสารประกอบการกู้ยืมภายในกำหนดการ หากพ้นกำหนดจะถือว่าสละสิทธิ์",
                    category="เอกสาร",
                    academic_year="2569",
                    is_published=True
                ),
                Announcement(
                    title="การอบรมจิตอาสา ประจำปีการศึกษา 2569",
                    content="กำหนดการอบรมและทำกิจกรรมจิตอาสาประจำปีการศึกษา 2569 สำหรับผู้กู้ยืมเงิน กยศ. ทุกคน",
                    category="จิตอาสา",
                    academic_year="2569",
                    is_published=True
                ),
            ]
            db.add_all(sample_announcements)
            print("[OK] Seeded sample Announcements")

        db.commit()
        print("[OK] Database initialization and seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
