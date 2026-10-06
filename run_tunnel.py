import subprocess
import re
import sys
import time

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    print("\n[Cloudflare Tunnel] กำลังเชื่อมต่อเพื่อสร้างลิงก์สาธารณะ...", flush=True)
    cmd = [
        "cloudflared", "tunnel",
        "--protocol", "http2",
        "--url", "http://localhost:5173"
    ]
    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding="utf-8",
        errors="ignore",
        bufsize=1
    )

    url_found = None
    url_pattern = re.compile(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com")

    for line in iter(process.stdout.readline, ''):
        match = url_pattern.search(line)
        if match:
            url_found = match.group(0)
            break

    if url_found:
        print("\n" + "=" * 65, flush=True)
        print("   PSU SLF AI Chatbot - ลิงก์สาธารณะพร้อมใช้งานแล้ว!", flush=True)
        print("=" * 65, flush=True)
        print(f"\n   >> Public URL: {url_found}\n", flush=True)
        print("   (ส่งลิงก์นี้ให้ผู้ทดสอบเข้าใช้งานผ่านอินเทอร์เน็ตได้ทันที)", flush=True)
        print("=" * 65 + "\n", flush=True)

        # Copy to Windows clipboard
        try:
            subprocess.run(
                ["powershell", "-NoProfile", "-Command", f"Set-Clipboard -Value '{url_found}'"],
                capture_output=True,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            print("   [OK] คัดลอกลิงก์ไปยัง Clipboard แล้ว (สามารถกด Ctrl + V วางได้ทันที)\n", flush=True)
        except Exception:
            pass

        print("   [หมายเหตุ] เปิดหน้าต่างนี้ทิ้งไว้เพื่อให้ลิงก์ยังใช้งานได้", flush=True)
        print("   (หากต้องการหยุดแชร์ ให้กดปิดหน้าต่างนี้ หรือกด Ctrl + C)", flush=True)
        print("-" * 65 + "\n", flush=True)

        try:
            process.wait()
        except KeyboardInterrupt:
            process.terminate()
    else:
        print("❌ ไม่สามารถดึงลิงก์สาธารณะได้ กรุณาลองใหม่อีกครั้ง", flush=True)
        process.terminate()

if __name__ == "__main__":
    main()
