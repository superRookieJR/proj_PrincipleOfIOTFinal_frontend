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

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Droplets className="h-6 w-6 text-primary" />
          <span>HydroFlow Dashboard</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
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

