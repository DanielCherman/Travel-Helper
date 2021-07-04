export const discoverPlaces = async (cat, lat, lng) => {
  const req = await fetch(`https://places.sit.ls.hereapi.com/places/v1/discover/around?in=${lat},${lng};r=500000&cat=${cat}&apiKey=rVLkSVXcXWx1580AtDjyu6KmodQhDRa595_e39wW78c`, { method: 'GET' })

  const res = await req.json()

  return res.results.items
}
