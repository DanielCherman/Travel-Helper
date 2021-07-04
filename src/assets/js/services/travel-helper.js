import { discoverPlaces } from './places'

export class TravelHelper {
  constructor(center, categories) {
    this.categories = categories
    this.center = center
  }

  async query() {
    console.log('query')
    let results = await Promise.all(
      this.categories
        .map(async (category) => {
          const places = await discoverPlaces(category, this.center.lat, this.center.lng)

          return [category, places]
        }),
    )

    results = Object.fromEntries(results)

    return results
  }
}
