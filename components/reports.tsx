import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Droplets, ArrowLeft } from "lucide-react"
import Link from "next/link"
import TemperatureChart from "@/components/charts/temperature-chart"
import PHChart from "@/components/charts/ph-chart"
import ECChart from "@/components/charts/ec-chart"
import WaterLevelChart from "@/components/charts/water-level-chart"
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="ph">pH</TabsTrigger>
            <TabsTrigger value="ec">EC</TabsTrigger>
            <TabsTrigger value="water">Water Level</TabsTrigger>
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

          <TabsContent value="ph">
            <Card>
              <CardHeader>
                <CardTitle>pH Level History</CardTitle>
                <CardDescription>pH readings over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px]">
                  <PHChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ec">
            <Card>
              <CardHeader>
                <CardTitle>EC History</CardTitle>
                <CardDescription>Electrical conductivity readings over time (mS/cm)</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px]">
                  <ECChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water">
            <Card>
              <CardHeader>
                <CardTitle>Water Level History</CardTitle>
                <CardDescription>Water level readings over time (%)</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px]">
                  <WaterLevelChart />
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

