import { map } from './map.js'

const story = document.querySelector('.story');

function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function revealProgress(scrollFraction, start, duration = 0.1) {
    return clamp((scrollFraction - start) / duration);
}

function updateMapLayers() {
    const storyTop = story.offsetTop;
    const storyHeight = story.offsetHeight;
    const scrollable = Math.max(storyHeight - window.innerHeight, 1);

    const scrollFraction = clamp((window.scrollY - storyTop)/scrollable);

    // step 1: watersheds
    const watersheds = revealProgress(scrollFraction, 0.1);

    map.setPaintProperty(
        'watersheds-layer',
        'fill-opacity',
        watersheds * 0.4
    );

    map.setPaintProperty(
        'watersheds-layer',
        'fill-outline-color',
        `rgba(215, 224, 240, ${watersheds})`
    );
    // step 2: reservoirs
    const reservoirs = revealProgress(scrollFraction, .4);

    map.setPaintProperty(
        'reservoirs-layer',
        'fill-opacity',
        reservoirs
    );

    // step 3: aqueducts/esopus
    const aqueducts = revealProgress(scrollFraction, 0.7);

    map.setPaintProperty(
        'aqueducts-layer',
        'line-opacity',
        aqueducts
    )

    map.setPaintProperty(
        'esopus-layer',
        'line-opacity',
        aqueducts
    )

}

export function initStory(map) {

    window.addEventListener('scroll', updateMapLayers, {passive: true});

    updateMapLayers();
}
