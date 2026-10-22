import { initStory } from "./story.js";
import { MAPBOX_TOKEN } from "../config.js";

mapboxgl.accessToken = MAPBOX_TOKEN;

const rootStyles = getComputedStyle(document.documentElement);
const watershedColor = rootStyles.getPropertyValue('--watershed-color').trim();
const upstateReservoirColor = rootStyles.getPropertyValue('--upstate-reservoir-color').trim();
const controlledLakeColor = rootStyles.getPropertyValue('--controlled-lake-color').trim();
const downstateReservoirColor = rootStyles.getPropertyValue('--downstate-reservoir-color').trim();
const aqueductColor = rootStyles.getPropertyValue('--aqueduct-color').trim();

export const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jacobshron/cmvk1im2z010y01rvfwopfe1r',
    center: [-74.2, 41.5],
    zoom: 7.5,

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

        map.addSource('esopus', {
            type: 'geojson',
            data: 'data/esopus.geojson'
        });

        map.addSource('reservoirs', {
            type: 'geojson',
            data: 'data/reservoirs.geojson'
        });

        map.addSource('aqueducts', {
            type: 'geojson',
            data: 'data/aqueducts.geojson'
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
                'fill-color': `${watershedColor}`,
                'fill-opacity': 0,
                'fill-outline-color': 'rgb(215, 224, 240)',
            }
        });

        map.addLayer({
            id: 'esopus-layer',
            type: 'line',
            source: 'esopus',
            paint: {
                'line-color': `${upstateReservoirColor}`,
                'line-width': 1,
                'line-opacity': 0
            }
        });

        map.addLayer({
            id: 'reservoirs-layer',
            type: 'fill',
            source: 'reservoirs',
            paint: {
                'fill-color': [
                    'match',
                    ['get', 'type'],

                    'upstate-reservoir', `${upstateReservoirColor}`,
                    'controlled-lake', `${controlledLakeColor}`,
                    'downstate-reservoir', `${downstateReservoirColor}`,

                    '#888888'
                ],
                'fill-opacity': 0
            }
        });

        map.addLayer({
            id: 'aqueducts-layer',
            type: 'line',
            source: 'aqueducts',
            paint: {
                'line-color': `${aqueductColor}`,
                'line-width': 2,
                'line-opacity': 0
            }
        });

        initStory(map);

    });
}