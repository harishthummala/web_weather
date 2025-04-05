import axios from "axios"
import type { WeatherData } from "./types"

export async function fetchWeatherData(location: string) {
  const apiKey = "3896ff240f484eac9af100613250404"
  const response = await axios.get(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`,
  )

  const weatherData: WeatherData = response.data
  const forecastData = response.data.forecast.forecastday.slice(1)

  const lat = response.data.location.lat
  const lon = response.data.location.lon

  // Fetch sea level data
  let seaLevelData = null
  try {
    const stormGlassApiKey = "f6f2544c-114a-11f0-a906-0242ac130003-f6f254f6-114a-11f0-a906-0242ac130003"
    const now = new Date().toISOString()

    const seaLevelResponse = await axios.get(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=seaLevel&start=${now}&end=${now}`,
      {
        headers: {
          Authorization: stormGlassApiKey,
        },
      },
    )

    const seaLevelValue = seaLevelResponse.data?.hours?.[0]?.seaLevel?.sg
    if (seaLevelValue !== undefined) {
      seaLevelData = `${seaLevelValue.toFixed(2)} meters`
    } else {
      seaLevelData = `Sea level data not available for ${location}`
    }
  } catch (error) {
    seaLevelData = `Sea level data not available for ${location}`
  }

  return { weatherData, forecastData, seaLevelData }
}

export async function fetchClimateData() {
  // This would typically fetch from a climate data API
  // For now, we're returning static data
  return {
    globalTemp: "+1.2°C since pre-industrial levels",
  }
}

