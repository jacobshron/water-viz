const story = document.querySelector('.map-story');

let activeLayer = null;
let registeredLayers = [];

function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function revealProgress(scrollFraction, start, duration = 0.1) {
    return clamp((scrollFraction - start) / duration);
}

function updateMapLayers(map) {
    const storyTop = story.offsetTop;
    const storyHeight = story.offsetHeight;
    const scrollable = Math.max(
        storyHeight - window.innerHeight,
        1
    );

    const scrollFraction = clamp(
        (window.scrollY - storyTop) / scrollable
    );

    const watersheds = revealProgress(scrollFraction, 0.05);
    const reservoirs = revealProgress(scrollFraction, 0.25);
    const aqueducts = revealProgress(scrollFraction, 0.5);

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

    map.setPaintProperty(
        'reservoirs-layer',
        'fill-opacity',
        reservoirs
    );

    map.setPaintProperty(
        'aqueducts-layer',
        'line-opacity',
        aqueducts
    );

    map.setPaintProperty(
        'esopus-layer',
        'line-opacity',
        aqueducts
    );

    // Select the interactive layer based on scroll progress.
    let nextLayer = null;

    if (aqueducts > 0.1) {
        nextLayer = 'aqueducts-layer';
    } else if (reservoirs > 0.5) {
        nextLayer = 'reservoirs-layer';
    } else if (watersheds > 0.9) {
        nextLayer = 'watersheds-layer';
    }

    if (nextLayer !== activeLayer) {
        activeLayer = nextLayer;
        updateInteractiveLayer(map);
    }
}

function updateInteractiveLayer(map) {
    // Remove listeners from the previous layer.
    for (const layer of registeredLayers) {
        map.off('mousemove', onMapMouseMove);
        map.off('mouseleave', layer, onFeatureLeave);
    }

    registeredLayers = [];

    if (!activeLayer) return;

    map.on('mousemove', onMapMouseMove);
    map.on('mouseleave', activeLayer, onFeatureLeave);

    registeredLayers.push(activeLayer);
}

let popup;


function onMapMouseMove(e) {
    const map = e.target;

    // Search a radius around the cursor.
    const radius = 5;

    const features = map.queryRenderedFeatures(
        [
            [e.point.x - radius, e.point.y - radius],
            [e.point.x + radius, e.point.y + radius]
        ],
        {
            layers: [activeLayer]
        }
    );

    if (features.length === 0) {
        popup.remove();
        return;
    }

    const feature = features[0];

    const name =
        feature.properties?.Name ??
        feature.properties?.name ??
        'Unknown';

    popup
        .setLngLat(feature.geometry.type === 'Point'
            ? feature.geometry.coordinates
            : e.lngLat)
        .setText(name)
        .addTo(map);
}


function onFeatureLeave() {
    popup.remove();
}

export function initStory(map) {
    popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 8
    });

    window.addEventListener('scroll', () => {
        updateMapLayers(map);
    }, { passive: true });

    updateMapLayers(map);
}
