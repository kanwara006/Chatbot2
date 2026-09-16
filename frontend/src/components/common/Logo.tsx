import logoImg from '@/assets/logo.png'

interface LogoProps {
  size?: number
  className?: string
}

/**
 * Logo — โลโก้แชทบอท PSU SLF AI (ใช้ร่วมกันทุกหน้าที่มีโลโก้)
 */
export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <img
      src={logoImg}
      alt="PSU SLF AI"
      className={`flex-shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
