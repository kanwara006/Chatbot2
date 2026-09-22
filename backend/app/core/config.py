from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "PSU SLF AI Chatbot API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "psu-secret-key-student-loan-fund-surat-thani-2026-super-secure-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Staff/admin self-registration requires this shared code (set by the fund office)
    ADMIN_REGISTER_CODE: str = "PSU-SLF-STAFF-2569"

    # Database
    DATABASE_URL: str = "sqlite:///./psu_slf.db"

    # CORS
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # LLM Settings
    LLM_PROVIDER: str = "mock"  # gemini, openai, ollama, mock
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    UPLOAD_DIR: str = "./uploads"

    # SMTP (สำหรับส่งอีเมลตอบกลับข้อความติดต่อจากแอดมิน) — ปล่อยว่างได้หากยังไม่ตั้งค่า
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_USE_TLS: bool = True
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "งานกองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) ม.อ. สุราษฎร์ธานี"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
