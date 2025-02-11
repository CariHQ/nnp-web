import Image from "next/image"

export function PhotoGallery() {
  const images = [
    { src: "/placeholder.svg?height=400&width=600", alt: "Community meeting" },
    { src: "/placeholder.svg?height=400&width=600", alt: "Party rally" },
    { src: "/placeholder.svg?height=400&width=600", alt: "Youth engagement" },
    { src: "/placeholder.svg?height=400&width=600", alt: "Economic development" },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Making a Difference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

