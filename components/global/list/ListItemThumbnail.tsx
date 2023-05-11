import Image from 'next/image'

export const ListItemThumbnail = ({ src, alt }: { src?: string; alt: string; }) => {
  const fallbackSrc = src ? `/segue/logos/${src}` : '/segue/logos/segue_logo.png'

  return (
    <Image
      src={fallbackSrc}
      alt={alt}
      width="170"
      height="40"
    ></Image>
  )
}
