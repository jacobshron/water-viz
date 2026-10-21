function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function revealProgress(scrollFraction, start, duration = 0.1) {
    return clamp((scrollFraction - start) / duration);
}

export function initIntro() {
    const gifs = document.querySelectorAll('.gif');
    const h1 = document.querySelector('h1');
    const intro = document.querySelector('.intro');

    // gif animation
    window.addEventListener('scroll', () => {
        const introTop = intro.offsetTop;
        const introHeight = intro.offsetHeight;
        const introScrollable = Math.max(introHeight - window.innerHeight, 1);
        
        const localScroll = window.scrollY - introTop;
        const scrollFraction = Math.min(Math.max(localScroll / introScrollable, 0), 1);
        const travelDistance = window.innerWidth + 800;
        
        const introBottom = intro.getBoundingClientRect().bottom;
        const introVisible = introBottom > 0;

        gifs.forEach(gif => {
            const speed = parseFloat(gif.dataset.speed) * 0.8 || 1;
            const moveX = scrollFraction * travelDistance * speed;
            gif.style.transform = `translateX(${moveX}px)`;
            gif.style.visibility = introVisible ? 'visible' : 'hidden';
        });
        h1.style.opacity = 1 - scrollFraction;
    }, { passive: true });

    // swimming pool viz

    const grid = document.getElementById('pool-grid');
    const poolDiv = document.getElementById('swimming-pools');
    const totalRects = 1500;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalRects; i++) {
        const div = document.createElement('div');
        div.classList.add('rect');
        div.style.opacity = 0;
        fragment.appendChild(div);
    }
    grid.appendChild(fragment);

    const rects = grid.querySelectorAll('.rect');
    let revealedCount = 0;

    function updatePools() {
        const poolTop = poolDiv.offsetTop;
        const poolHeight = poolDiv.offsetHeight - 1000;
        const scrollable = Math.max(poolHeight - window.innerHeight, 1);

        const scrollFraction = clamp(
            (window.scrollY - poolTop) / scrollable
        );

        const targetCount = Math.floor(totalRects * scrollFraction);

        // Reveal new rectangles
        for (let i = 0; i < targetCount; i++) {
            rects[totalRects - 1 - i].style.opacity = 1;
        }

        // Hide rectangles again if the user scrolls upward
        for (let i = targetCount; i < revealedCount; i++) {
            rects[totalRects - 1 - i].style.opacity = 0;
        }

        revealedCount = targetCount;
    }

    window.addEventListener('scroll', updatePools, {passive: true});
    updatePools();
    

    

}