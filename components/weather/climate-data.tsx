import { Waves } from "lucide-react"

interface ClimateDataProps {
  globalTemp: string | null
  seaLevel: string | null
}

export default function ClimateData({ globalTemp, seaLevel }: ClimateDataProps) {
  return (
    <div className="mt-8">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Waves className="text-indigo-500" />
          Sea Level & Temperature Rise
        </h2>
        <p className="text-gray-700 text-sm mb-2">
          🌡️ Global Temperature Change: <strong>{globalTemp}</strong>
        </p>
        <p className="text-gray-700 text-sm">
          🌊 Sea Level Status: <strong>{seaLevel || "Loading..."}</strong>
        </p>
        <p className="text-sm text-gray-500 mt-2">Source: StormGlass, NASA Climate, IPCC Reports</p>
      </div>
    </div>
  )
}

