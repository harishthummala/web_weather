interface ForecastDay {
  date: string
  day: {
    condition: {
      text: string
    }
    maxtemp_c: number
    mintemp_c: number
    avghumidity: number
  }
}

interface ForecastCardProps {
  day: ForecastDay
}

export default function ForecastCard({ day }: ForecastCardProps) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-bold mb-2">{day.date}</h3>
      <p className="text-sm text-gray-700">🌤️ {day.day.condition.text}</p>
      <p className="text-sm">🌡️ Max: {day.day.maxtemp_c}°C</p>
      <p className="text-sm">🌡️ Min: {day.day.mintemp_c}°C</p>
      <p className="text-sm">💧 Humidity: {day.day.avghumidity}%</p>
    </div>
  )
}

