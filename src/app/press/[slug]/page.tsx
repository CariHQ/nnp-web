import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function PressReleasePage({
   params,
}: {
   params: Promise<{ slug: string }>;
}) {
   const { slug } = await params;

   let posts = [];

   try {
      posts = await db
         .select()
         .from(blogPosts)
         .where(eq(blogPosts.slug, slug))
         .limit(1);
   } catch (error) {
      console.error("Error fetching press release:", error);
      notFound();
   }

   if (posts.length === 0 || !posts[0].published) {
      notFound();
   }

   const post = posts[0];

   return (
      <div className="min-h-screen bg-white">
         <article className="container mx-auto px-4 py-12 max-w-3xl">
            {post.headerImage && (
               <div className="relative w-full h-64 mb-10 rounded-lg overflow-hidden">
                  <Image
                     src={post.headerImage}
                     alt={post.title}
                     fill
                     className="object-cover"
                     priority
                  />
               </div>
            )}

            <header className="mb-8">
               <h1 className="text-2xl font-bold mb-3 text-gray-900">
                  {post.title}
               </h1>
               <div className="flex items-center gap-3 text-xs text-gray-500">
                  {post.author && <span>{post.author}</span>}
                  {post.publishedAt && (
                     <span>
                        {new Date(
                           post.publishedAt instanceof Date
                              ? post.publishedAt.getTime()
                              : post.publishedAt * 1000
                        ).toLocaleDateString("en-US", {
                           year: "numeric",
                           month: "long",
                           day: "numeric",
                        })}
                     </span>
                  )}
               </div>
            </header>

            <div className="prose prose-base max-w-none">
               <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="text-gray-700 leading-7"
                  components={{
                     p: ({ children }) => (
                        <p className="mb-5 text-[15px] leading-7">{children}</p>
                     ),
                     h1: ({ children }) => (
                        <h1 className="text-xl font-semibold mb-4 mt-8 text-gray-900">
                           {children}
                        </h1>
                     ),
                     h2: ({ children }) => (
                        <h2 className="text-lg font-semibold mb-3 mt-7 text-gray-900">
                           {children}
                        </h2>
                     ),
                     h3: ({ children }) => (
                        <h3 className="text-base font-semibold mb-2 mt-6 text-gray-900">
                           {children}
                        </h3>
                     ),
                     ul: ({ children }) => (
                        <ul className="list-disc mb-5 space-y-2 ml-6 text-[15px] leading-7">
                           {children}
                        </ul>
                     ),
                     ol: ({ children }) => (
                        <ol className="list-decimal mb-5 space-y-2 ml-6 text-[15px] leading-7">
                           {children}
                        </ol>
                     ),
                     li: ({ children }) => (
                        <li className="leading-7">{children}</li>
                     ),
                     strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                           {children}
                        </strong>
                     ),
                     em: ({ children }) => (
                        <em className="italic">{children}</em>
                     ),
                     blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-5 italic my-6 text-gray-600 leading-7">
                           {children}
                        </blockquote>
                     ),
                  }}>
                  {post.content}
               </ReactMarkdown>
            </div>
         </article>
      </div>
   );
}
