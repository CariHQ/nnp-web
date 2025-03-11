import Image from "next/image";

interface CustomImageProps {
   src: string;
   alt: string;
   width: number;
   height: number;
   className?: string;
   priority?: boolean;
}

export const CustomImage: React.FC<CustomImageProps> = ({
   src,
   alt,
   width,
   height,
   className,
   priority,
}) => {
   const fullUrl = `${src}`;

   return (
      <Image
         src={fullUrl}
         alt={alt}
         width={width}
         height={height}
         className={className}
         priority={priority}
      />
   );
};
