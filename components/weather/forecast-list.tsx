import ForecastCard from "./forecast-card"

interface ForecastListProps {
  forecast: any[]
}

export default function ForecastList({ forecast }: ForecastListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-2 text-center">Weekly Forecast</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {forecast.map((day) => (
          <ForecastCard key={day.date} day={day} />
        ))}
      </div>
    </div>
  )
}

