/*
    "Virtual Particles" in-browser DHTML/JavaScript visual effect

    Initially written for the homepage of https://nickhz.live

    Copyright Nicolas Hernandez 2025
*/

const virtualParticles = (
    configuration // will get the variable values from here in a future update
) => {


    // these variables make the visual effect easily configurable
    
    // particle spawn amount should vary with screen size
    const minSecondsPerParticleSpawnPerMpx = 0.01;
    const maxSecondsPerParticleSpawnPerMpx = 0.1;

    // travel speed of particles
    const minInitialPxPerSecond = 100;
    const maxInitialPxPerSecond = 1000;

    // number of seconds for a particle to decay
    const minParticleDecaySeconds = 0.2;
    const maxParticleDecaySeconds = 1;
    
    // auto-set variables; these just frontload the calculations so the script doesn't repeat them
    const secondsPerParticleSpawnPerMpxVariance = maxSecondsPerParticleSpawnPerMpx - minSecondsPerParticleSpawnPerMpx;
    const initialPxPerSecondVariance = maxInitialPxPerSecond - minInitialPxPerSecond;
    const particleDecaySecondsVariance = maxParticleDecaySeconds - minParticleDecaySeconds;

    // element where the effect is visible
    const effectFrame = document.createElement('div');
    effectFrame.style.pointerEvents = 'none';
    effectFrame.style.zIndex = -2;
    effectFrame.style.overflow = 'hidden';
    effectFrame.className = 'fully-occupies-parent';

    document.body.append(effectFrame);

    // allows dynamic adjustment of particle spawn count based on screen size, so that smaller screens aren't given huge particle densities
    const getFrameSize = () => {
        return effectFrame.offsetWidth * effectFrame.offsetHeight;
    };

    // determines when the next particle will spawn
    const getNextParticleSpawnTime = (particleSpawnTime) => {
        return particleSpawnTime + 
            1000 * (minSecondsPerParticleSpawnPerMpx + Math.random() * secondsPerParticleSpawnPerMpxVariance) 
                / (getFrameSize() / 1000000)
        ;
    };

    const particles = new Array();

    const getNewParticleElement = () => {
        const result = document.createElement('div');
        result.style.position = 'absolute';
        result.style.width = '3px';
        result.style.height = '3px';
        result.style.background = 'var(--primary-accent)';

        return result;
    };

    const spawnNewParticle = () => {
        const newParticle = 
            {
                element: getNewParticleElement(),
                position:
                    {
                        x: Math.random() * effectFrame.offsetWidth,
                        y: Math.random() * effectFrame.offsetHeight
                    },
                velocity:
                    {
                        r: (minInitialPxPerSecond + Math.random() * initialPxPerSecondVariance) / 1000,
                        theta: 2 * Math.PI * Math.random()
                    },
                acceleration:
                    {
                        r: 0,
                        theta: 0
                    },
                decayTime: 1000 * (minParticleDecaySeconds + Math.random() * particleDecaySecondsVariance)
            }
        ;
        
        newParticle.element.style.left = `${newParticle.position.x}px`;
        newParticle.element.style.bottom = `${newParticle.position.y}px`;

        particles.push(newParticle);
        effectFrame.appendChild(newParticle.element);
    };

    const updateParticles = (delta) => {
        for(let i = 0; i < particles.length; i++) {
            const particle = particles[i];

            if(particle.decayTime <= delta) {
                // remove any dead particles
                particle.element.remove();
                particles.splice(i, 1);
            } else {
                // update any live particles
                particle.decayTime -= delta;

                particle.position.x += particle.velocity.r * Math.cos(particle.velocity.theta);
                particle.position.y += particle.velocity.r * Math.sin(particle.velocity.theta);

                particle.element.style.left = `${particle.position.x}px`;
                particle.element.style.bottom = `${particle.position.y}px`;
            }
        }
    };

    let lastFrameTime = performance.now();
    let lastParticleSpawnTime = lastFrameTime;
    let nextParticleSpawnTime = getNextParticleSpawnTime(lastFrameTime);

    const runVirtualParticles = (now) => {
        const delta = now - lastFrameTime;
        lastFrameTime = now;

        if(now >= nextParticleSpawnTime) {
            spawnNewParticle();

            lastParticleSpawnTime = now;
            nextParticleSpawnTime = getNextParticleSpawnTime(now);
        }

        updateParticles(delta);

        requestAnimationFrame(runVirtualParticles);
    };

    requestAnimationFrame(runVirtualParticles);
};
