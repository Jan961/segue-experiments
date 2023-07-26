import Image from 'next/image'

export const SegueLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      className={className}
      height={80}
      width={155}
      src="/segue/segue_logo.png"
      alt="Your Company"
    />
  )
}
