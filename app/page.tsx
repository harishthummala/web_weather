"use client"

import { useState } from "react"
import SearchBar from "@/components/weather/search-bar"
import CurrentWeather from "@/components/weather/current-weather"
import ForecastList from "@/components/weather/forecast-list"
import ClimateData from "@/components/weather/climate-data"
import { fetchWeatherData } from "@/lib/api"
import type { WeatherData } from "@/lib/types"

export default function WeatherApp() {
  const [location, setLocation] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seaLevel, setSeaLevel] = useState<string | null>(null)
  const [globalTemp, setGlobalTemp] = useState<string | null>("+1.2°C since pre-industrial levels")

  const handleSearch = async () => {
    if (!location.trim()) {
      setError("Please enter a valid location.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { weatherData, forecastData, seaLevelData } = await fetchWeatherData(location)
      setWeather(weatherData)
      setForecast(forecastData)
      setSeaLevel(seaLevelData)
    } catch (err: any) {
      const message = err.response?.data?.error?.message || "Unable to fetch weather data."
      setError(`Error: ${message}`)
      setWeather(null)
      setForecast([])
      setSeaLevel(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="p-6 min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 w-full max-w-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-800">Live Weather Forecast</h1>

        <SearchBar location={location} setLocation={setLocation} onSearch={handleSearch} loading={loading} />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {weather && <CurrentWeather weather={weather} />}

        {forecast.length > 0 && <ForecastList forecast={forecast} />}

        <ClimateData globalTemp={globalTemp} seaLevel={seaLevel} />
      </div>
    </div>
  )
}

