import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function MembershipPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">NNP Membership Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name (Mr./Ms.)</Label>
                <Input id="name" placeholder="Please Print" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="home-address">Home Address</Label>
                <Input id="home-address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business-address">Business Address</Label>
                <Input id="business-address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail Address</Label>
                <Input id="email" type="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="constituency">Constituency</Label>
                <Input id="constituency" />
              </div>
            </div>

            <div>
              <Label>Have you been a member of any political party?</Label>
              <RadioGroup defaultValue="no" className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Areas you would be willing to assist:</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="house" />
                  <Label htmlFor="house">House to House Visits</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="speaking" />
                  <Label htmlFor="speaking">Speaking Assignments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="campaign" />
                  <Label htmlFor="campaign">Campaign Activity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="research" />
                  <Label htmlFor="research">Research Activities</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Declaration</Label>
              <p className="text-sm text-muted-foreground">
                I affirm my loyalty to the Party and pledge to abide by its Rules and Regulations. I agree to pay the
                registration fee of $5.00 and monthly membership fee of $5.00.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="signature">Signature of Applicant</Label>
                <Input id="signature" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

