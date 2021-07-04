/* eslint-disable no-undef */
import { Loader } from '@googlemaps/js-api-loader'

const loader = new Loader({
  apiKey: 'AIzaSyBvg67xaPq-ELmeeaFWryUvQ2O0Y1470nk',
  version: 'weekly',
})

const startButton = document.querySelector('#header-start')

let map, marker, centerChanged

export const init = async () => {
  await loader.load()
  const center = { lat: 54.7125203992322, lng: 54.31587500000005 }

  map = new google.maps.Map(document.querySelector('#header-map'), {
    zoom: 2,
    panControl: false,
    // zoomControl: false,
    streetView: false,
    streetViewControl: false,
    fullscreenControl: false,
    center,
  })

  marker = new google.maps.Marker({
    map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: center,
  })

  marker.addListener('drag',
    (e) => {
      centerChanged = true
      map.panTo(e.latLng)
    })
}

const getLatLng = (latLng) => ({ lat: latLng.lat(), lng: latLng.lng() })

startButton.addEventListener('click', () => {
  if (!centerChanged) {
    alert('Drag the marker on the map, and try again!')
    return
  }

  const center = getLatLng(map.getCenter())
  const options = { ...center, zoom: map.getZoom() }
  const url = new URL(location.href)
  url.pathname = '/app.html'

  Object.entries(options)
    .forEach(
      (params) => url.searchParams.append(...params),
    )

  location.href = url.href
})

init()
