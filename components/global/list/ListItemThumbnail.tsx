import Image from 'next/image'

const height = 80
const width = 170

export const ListItemThumbnail = ({ src, alt }: { src?: string; alt: string; }) => {
  console.log(src)
  const fallbackSrc = src ? `/segue/logos/${src}` : '/segue/logos/segue_logo.png'

  return (
    <Image
      className="object-cover mr-2"
      src={fallbackSrc}
      alt={alt}
      style={{ height, width }}
      width={ width }
      height={ height }
    ></Image>
  )
}
