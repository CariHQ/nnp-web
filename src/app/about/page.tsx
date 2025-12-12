'use client'

import { useEffect, useState } from 'react'
import { CustomImage } from "@/components/ui/image"
import Image from "next/image"

type PageContent = {
  id: number
  section: string
  title: string | null
  content: any
}

const executives = [
  { name: 'Keith Mitchell', role: 'Chairman', image: null },
  { name: 'Gregory Bowen', role: 'Deputy Chairman', image: '/headshots/gregory-bowen.jpg' },
  { name: 'Emmalin Pierre', role: 'Political Leader', image: '/headshots/emmalin-pierre.jpg' },
  { name: 'Norland Cox', role: 'Deputy Political Leader', image: '/headshots/norland-cox.jpg' },
  { name: 'Roland Bhola', role: 'General Secretary', image: '/headshots/roland-bhola.jpg' },
  { name: 'Kate Lewis', role: 'Assistant General Secretary', image: '/headshots/kate-lewis.jpg' },
  { name: 'Steve Hosford', role: 'Recording Secretary', image: '/headshots/steve-hosford.jpg' },
  { name: 'Rosemary Welsh', role: 'Assistant Recording Secretary', image: '/headshots/rosemary-welsh.jpg' },
  { name: 'Nimrod Ollivierre', role: 'Treasurer', image: null },
  { name: 'Kitaka Mawuto', role: 'Public Relations Officer', image: '/headshots/kitaka-mawuto.jpg' },
  { name: 'Winston Garraway', role: 'Labour Relations Officer', image: '/headshots/winston-garraway.jpg' },
  { name: 'Laurina Waldron', role: 'Welfare Officer', image: '/headshots/laurina-waldron.jpg' },
  { name: 'Osborn Gilbert', role: 'Floor Member', image: null },
  { name: 'Kenneth Noel', role: 'Floor Member', image: null },
  { name: 'Edmond Calliste', role: 'Floor Member', image: null },
  { name: 'Marcus Christopher', role: 'Floor Member', image: null },
  { name: 'Christopher De Allie', role: 'Floor Member', image: null },
  { name: 'George Alexander', role: 'Floor Member', image: null },
]

export default function AboutPage() {
  const [content, setContent] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/pages/about')
      const data = await res.json()
      setContent(data.content || [])
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSection = (section: string) => {
    return content.find(c => c.section === section)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  const history = getSection('history')
  const leadership = getSection('leadership')
  const policies = getSection('policies')
  const commitment = getSection('commitment')

  // Sort executives: those with images first
  const sortedExecutives = [...executives].sort((a, b) => {
    if (a.image && !b.image) return -1
    if (!a.image && b.image) return 1
    return 0
  })

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden -mt-24">
        <Image
          src="/hero/grenada-city.jpg"
          alt="About the New National Party"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">About the New National Party</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

      {history && (
        <section className="mb-12 py-6">
          <h3 className="text-lg font-semibold mb-4">{history.title}</h3>
          {history.content.paragraphs?.map((para: string, idx: number) => (
            <p key={idx} className="mb-4 leading-relaxed">{para}</p>
          ))}
        </section>
      )}

      <section className="mb-12 py-6">
        <h3 className="text-lg font-semibold mb-6">NNP Executive Team</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedExecutives.map((exec, idx) => (
            <div key={idx} className="bg-white p-4 flex items-center space-x-4">
              {exec.image && (
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={exec.image}
                    alt={exec.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    style={{ 
                      objectPosition: '50% 30%'
                    }}
                  />
                </div>
              )}
              <div>
                <h4 className="font-semibold">{exec.name}</h4>
                <p className="text-sm text-muted-foreground">{exec.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {policies && (
        <section className="mb-12 py-6">
          <h3 className="text-lg font-semibold mb-6">{policies.title}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {policies.content.policies?.map((policy: any, idx: number) => (
              <div key={idx} className="bg-white p-6">
                <h3 className="text-base font-semibold mb-3">{policy.title}</h3>
                <p className="leading-relaxed">{policy.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {commitment && (
        <section className="py-6">
          <h3 className="text-lg font-semibold mb-4">{commitment.title}</h3>
          {commitment.content.paragraphs?.map((para: string, idx: number) => (
            <p key={idx} className="mb-4 leading-relaxed">{para}</p>
          ))}
        </section>
      )}
      </div>
    </div>
  )
}
