import { Sun, Thermometer } from "lucide-react"
import type { WeatherData } from "@/lib/types"

interface CurrentWeatherProps {
  weather: WeatherData
}

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
  return (
    <div className="bg-white shadow rounded p-4 grid gap-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Sun className="text-yellow-500" />
        {weather.location.name}, {weather.location.country} - {weather.current.condition.text}
      </div>
      <div className="flex items-center gap-2 text-2xl">
        <Thermometer className="text-blue-500" />
        Temperature: {weather.current.temp_c}°C
      </div>
      <div className="text-gray-600">
        Humidity: {weather.current.humidity}% | Wind: {weather.current.wind_kph} kph
      </div>
      <div className="text-sm text-gray-400">Last updated: {weather.current.last_updated}</div>
    </div>
  )
}

