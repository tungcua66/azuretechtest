export const showParticles = (element, reaction) => {
    const colors = {
        like: 'blue',
        dislike: 'red',
        love: 'pink'
    };
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = colors[reaction];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particleContainer.appendChild(particle);
    }
    element.appendChild(particleContainer);
    setTimeout(() => {
        particleContainer.remove();
    }, 1000);
}