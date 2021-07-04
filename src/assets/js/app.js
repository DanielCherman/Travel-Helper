/* eslint-disable no-undef */
import { Loader } from '@googlemaps/js-api-loader'
import { TravelHelper } from './services/travel-helper'

const loader = new Loader({
  apiKey: 'AIzaSyBvg67xaPq-ELmeeaFWryUvQ2O0Y1470nk',
  version: 'weekly',
})

let map

const t = document.querySelector('#t')
const st = document.querySelector('#st')
const dt = document.querySelector('#dt')
const urlSearchParams = new URLSearchParams(window.location.search)
const params = Object.fromEntries(urlSearchParams.entries())
const categories = document.querySelector('#categories')
const center = { lat: parseFloat(params.lat), lng: parseFloat(params.lng) }
let markers = []

export const init = async () => {
  await loader.load()

  map = new google.maps.Map(document.querySelector('#app-map'), {
    zoom: 12,
    panControl: false,
    // zoomControl: false,
    streetViewControl: false,
    zoomControl: false,
    fullscreenControl: false,
    center,
  })

  markers.push(new google.maps.Marker({
    map,
    draggable: false,
    animation: google.maps.Animation.DROP,
    position: center,
  }))

  window.th = new TravelHelper(center, [
    'eat-drink',
    'restaurant',
    'coffee-tea',
    'snacks-fast-food',
    'going-out',
    'sights-museums',
    'accommodation',
    'shopping',
    'leisure-outdoor',
    'administrative-areas-buildings',
    'natural-geographical',
    'petrol-station',
    'atm-bank-exchange',
    'toilet-rest-area',
    'hospital-health-care-facility',
  ])

  await process(th)

  th.categories.forEach((category) => {
    categories.innerHTML += `
      <div onclick="toggleCategory('${category}')" id="${category}" class="bg-green-500 rounded-md h-12 flex items-center justify-center text-white text-2xl font-bold">
        ${category}
      </div>
    `
  })

  window.toggleCategory = async (category) => {
    const el = document.getElementById(category)

    if (window.th.categories.includes(category)) {
      el.classList.remove('bg-green-500')
      el.classList.add('bg-yellow-500')
      const index = window.th.categories.indexOf(category)
      if (index !== -1) {
        window.th.categories.splice(index, 1)
      }
    } else {
      el.classList.remove('bg-yellow-500')
      el.classList.add('bg-green-500')
      window.th.categories.push(category)
    }

    await process(th)
  }
}

const process = async (th) => {
  window.results = await th.query()
  const places = Object.values(results).flat()

  t.innerHTML = 'Found <br>'
  st.innerHTML = `${places.length} places`
  dt.innerHTML = `In ${Object.keys(results).length} categories <br> scroll down and click to toggle the categories`

  // FIXME: markers dirty hack
  markers.forEach((marker) => marker.setOpacity(0))
  markers = []

  places.forEach((place) => {
    const [lat, lng] = place.position

    markers.push(new google.maps.Marker({
      map,
      icon: place.icon,
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: { lat, lng },
    }))
  })
}

init()
