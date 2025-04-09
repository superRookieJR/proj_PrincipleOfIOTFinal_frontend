import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TemperatureChart from "@/components/charts/temperature-chart"
import BrightnessChart from "@/components/charts/brightness-chart"

export default function Reports() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select defaultValue="day">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="temperature" className="space-y-4">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="brightness">Brightness</TabsTrigger>
          </TabsList>

          <TabsContent value="temperature">
            <Card>
              <CardHeader>
                <CardTitle>Temperature History</CardTitle>
                <CardDescription>Temperature readings over time (°C)</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px]">
                  <TemperatureChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brightness">
            <Card>
              <CardHeader>
                <CardTitle>Brightness History</CardTitle>
                <CardDescription>Light intensity readings over time (lux)</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px]">
                  <BrightnessChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

