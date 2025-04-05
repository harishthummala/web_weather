export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temp_c: number
    condition: {
      text: string
      icon: string
    }
    humidity: number
    wind_kph: number
    last_updated: string
  }
  forecast: {
    forecastday: ForecastDay[]
  }
}

export interface ForecastDay {
  date: string
  day: {
    maxtemp_c: number
    mintemp_c: number
    avghumidity: number
    condition: {
      text: string
      icon: string
    }
  }
}

