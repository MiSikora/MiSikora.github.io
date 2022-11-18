import Image from './image'
import './Gallery.css'

interface GalleryProps {
  images: Image[],
}

export default function Gallery(props: GalleryProps) {
  return (
    <div className='gallery'>
      {props.images.map(image => <img className='thumbnail' src={image.src} key={image.id} />)}
    </div>
  )
}
