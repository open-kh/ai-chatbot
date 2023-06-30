import Image from 'next/image'

interface Props {
  className?: string
  width?: number
  height?: number
}
export default function Logo(props: Props) {
  return (
    <Image
      alt=""
      width={props.width ?? 10}
      height={props.height ?? 10}
      src="/favicon-32x32.png"
      className="h-full flex-none select-none"
      {...props}
    />
  )
}
