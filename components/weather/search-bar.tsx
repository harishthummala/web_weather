"use client"

interface SearchBarProps {
  location: string
  setLocation: (location: string) => void
  onSearch: () => void
  loading: boolean
}

export default function SearchBar({ location, setLocation, onSearch, loading }: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-4">
      <input
        className="flex-1 border border-gray-300 rounded px-4 py-2"
        placeholder="Enter location (e.g., London)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button
        onClick={onSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? "Loading..." : "Get Weather"}
      </button>
    </div>
  )
}

