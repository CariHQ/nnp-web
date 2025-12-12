"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

interface HeroImage {
  id: number;
  title: string;
  caption?: string | null;
  link?: string | null;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export function Hero() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Fetch hero images from Payload CMS
    fetch("/api/hero-images")
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) {
          setImages(data.images);
        } else {
          // Fallback to default image if no images in CMS
          setImages([
            {
              id: 0,
              title: "Building a Stronger Grenada Together",
              imageUrl: "/carenage.jpg",
              order: 0,
              active: true,
              createdAt: Date.now() / 1000,
              updatedAt: Date.now() / 1000,
            },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error fetching hero images:", error);
        // Fallback to default image on error
        setImages([
          {
            id: 0,
            title: "Building a Stronger Grenada Together",
            imageUrl: "/carenage.jpg",
            order: 0,
            active: true,
            createdAt: Date.now() / 1000,
            updatedAt: Date.now() / 1000,
          },
        ]);
      });
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-rotate plugin
  const autoplayPlugin = Autoplay({
    delay: 5000,
    stopOnInteraction: false,
    stopOnMouseEnter: false,
  });

  const currentImage = images[current] || images[0];

  return (
    <div className="relative h-[50vh] w-full overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Carousel
          setApi={setApi}
          plugins={images.length > 1 ? [autoplayPlugin] : []}
          className="h-full w-full"
          opts={{
            align: "start",
            loop: images.length > 1,
          }}
        >
          <CarouselContent className="h-full -ml-0">
            {images.map((image, index) => (
              <CarouselItem key={image.id} className="h-full basis-full pl-0 min-h-[50vh]">
                <div className="relative h-full w-full min-h-[50vh]">
                  {image.imageUrl ? (
                    <Image
                      src={image.imageUrl}
                      alt={image.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800" />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Static Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-white">
        <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold transition-opacity duration-500">
            {currentImage?.title || "Building a Stronger Grenada Together"}
          </h1>
          {currentImage?.caption ? (
            <p className="text-xl transition-opacity duration-500">{currentImage.caption}</p>
          ) : (
            <p className="text-xl">
              Join the New National Party in shaping the future of our nation
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/membership">Become a Member</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="#donate">Donate</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
