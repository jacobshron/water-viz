export function initIntro() {
    const gifs = document.querySelectorAll('.gif');
    const h1 = document.querySelector('h1');
    const intro = document.querySelector('.intro');

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
}