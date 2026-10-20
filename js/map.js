import { initStory } from "./story.js";

mapboxgl.accessToken = window.MAPBOX_TOKEN;

export const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jacobshron/cmvcoyrxa00do01s862g7d8i6',
    center: [-74.2, 41.5],
    zoom: 7.6,

    scrollZoom: false,
    dragPan: false,
    dragRotate: false,
    keyboard: false,
    doubleClickZoom: false,
    touchZoomRotate: false
});

export function initMap() {

    map.getCanvas().style.cursor = 'default';

    map.on('load', () => {
        console.log("Map loaded successfully.");

        // data sources
        map.addSource('dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1'
        });

        map.addSource('watersheds', {
            type: 'geojson',
            data: 'data/watersheds.geojson'
        });

        map.addSource('aqueducts', {
            type: 'geojson',
            data: 'data/aqueducts.geojson'
        });

        map.addSource('esopus', {
            type: 'geojson',
            data: 'data/esopus.geojson'
        });

        map.addSource('reservoirs', {
            type: 'geojson',
            data: 'data/reservoirs.geojson'
        });

        // layers
        map.addLayer({
            'id': 'hillshading',
            'source': 'dem',
            'type': 'hillshade',
            'slot': 'bottom'
        });

        map.addLayer({
            id: 'watersheds-layer',
            type: 'fill',
            source: 'watersheds',
            paint: {
                'fill-color': '#1d3557',
                'fill-opacity': 0,
                'fill-outline-color': 'rgb(215, 224, 240)',
            }
        });

        map.addLayer({
            id: 'aqueducts-layer',
            type: 'line',
            source: 'aqueducts',
            paint: {
                'line-color': '#457b9d',
                'line-width': 2,
                'line-opacity': 0
            }
        });

        map.addLayer({
            id: 'esopus-layer',
            type: 'line',
            source: 'esopus',
            paint: {
                'line-color': '#7aadba',
                'line-width': 1,
                'line-opacity': 0
            }
        });

        map.addLayer({
            id: 'reservoirs-layer',
            type: 'fill',
            source: 'reservoirs',
            paint: {
                'fill-color': '#7aadba',
                'fill-opacity': 0
            }
        });

        initStory(map);

    });
}