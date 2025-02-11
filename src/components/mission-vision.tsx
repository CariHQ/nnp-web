import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MissionVision() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To create a prosperous, united, and progressive Grenada where every citizen has the opportunity to
                thrive and contribute to national development.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To implement sustainable policies and programs that promote economic growth, social justice, and
                environmental stewardship while preserving our cultural heritage.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

