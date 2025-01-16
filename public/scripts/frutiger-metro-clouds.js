/*
    "Frutiger Metro Clouds" in-browser DHTML/JavaScript visual effect

    Initially written for https://nickhz.live/professional

    Copyright Nicolas Hernandez 2025
*/

const frutigerMetroClouds = (inputConfig) => {
    /*
        CONFIG WITH DEFAULT VALUES IS BETTER DONE USING 
        
        Objects.assign({default config settings}, inputConfig)

        BUT THIS WILL BE KEPT AS IS FOR DEMONSTRATION
    */
    const safeDefine = (property, defaultValue) => {
        return property === undefined ? defaultValue : property;
    };
    inputConfig = safeDefine(inputConfig, {});

    // effect config
    const config = {
        spawnerYPercentage: inputConfig.spawnerYPercentage === undefined ? 
            {
                min: 60, // percent from bottom
                max: 100 // percent from bottom
            }
            :
            {
                min: safeDefine(inputConfig.spawnerYPercentage.min, 60),
                max: safeDefine(inputConfig.spawnerYPercentage.max, 100)
            }
        ,
        spawnerSpawnRate: safeDefine(inputConfig.spawnerSpawnRate, 0.1), // per second spawner spawns
        spawnerVelocity: safeDefine(inputConfig.spawnerVelocity, 200), // px/s
        spawnerSpawnRadius: safeDefine(inputConfig.spawnerSpawnRadius, 75), // px from spawn
        circleSpawnRate: safeDefine(inputConfig.circleSpawnRate, 10), // per second circle spawns
        circleLifetime: safeDefine(inputConfig.circleLifetime, 2000), // ms until circle shrinks to 0
        circleSize: safeDefine(inputConfig.circleSize, 200) // px max size
    };

    const effectFrame = document.createElement('div');
    effectFrame.style.pointerEvents = 'none';
    effectFrame.style.zIndex = -2;
    effectFrame.style.overflow = 'visible';
    effectFrame.style.position = 'absolute';
    effectFrame.style.bottom = `${config.spawnerYPercentage.min}%`;
    effectFrame.style.left = 0;
    effectFrame.style.width = '100%';
    effectFrame.style.height = `${config.spawnerYPercentage.max - config.spawnerYPercentage.min}%`;

    document.body.appendChild(effectFrame);

    // spawner spawning
    const spawners = new Array();
    let spawnerSpawnTimeoutId = null;
    const spawnSpawner = () => {
        const spawner = document.createElement('div');
        spawner.style.position = 'absolute';
        spawner.style.bottom = `${Math.random() * 100}%`;

        effectFrame.appendChild(spawner);
        spawners.push(
            {
                element: spawner,
                x: -config.spawnerSpawnRadius,
                lastSpawnTime: performance.now()
            }
        );
        
        // indicates spawner spawning is no longer in timeout
        spawnerSpawnTimeoutId = null;
    };

    // circle spawning
    const circles = new Array();
    const spawnCircle = (spawner, now) => {
        spawner.lastSpawnTime = now;

        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.background = 'white';
        circle.style.border = '1px solid black';
        circle.style.borderRadius = '50%';
        circle.style.transform = 'translate(-50%, 50%)';

        const r = 
            Math.random() * config.spawnerSpawnRadius
        ;
        const theta =
            Math.random() * 2 * Math.PI
        ;

        circle.style.bottom = 
            `${parseInt(getComputedStyle(spawner.element).bottom) + r * Math.sin(theta)}px`
        ;
        circle.style.left = 
            `${spawner.x + r * Math.cos(theta)}px`
        ;

        effectFrame.appendChild(circle);
        circles.push(
            {
                element: circle,
                radius: 0,
                spawnTime: now
            }
        );
    };

    // motion iteration
    const update = (dt) => {
        for(let i = 0; i < spawners.length; i++) {
            const spawner = spawners[i];
            spawner.x += config.spawnerVelocity * dt / 1000;

            const now = performance.now();
            if(spawner.x > document.body.clientWidth + config.spawnerSpawnRadius) {
                spawner.element.remove();
                spawners.splice(i, 1);
                i--;
            } else {
                if(now - spawner.lastSpawnTime >= 1000 / config.circleSpawnRate) {
                    spawnCircle(spawner, now);
                }
            }
        }

        for(let j = 0; j < circles.length; j++) {
            const circle = circles[j];
            const t = (performance.now() - circle.spawnTime);

            const expression = (t-(config.circleLifetime/2.0))/(config.circleLifetime/2.0);

            if(expression > 1) {
                circle.element.remove();
                circles.splice(j, 1);
                j--;
            } else {
                const radius = config.circleSize * Math.sqrt(1 - expression * expression);
                // console.log(radius);
                circle.element.style.width = `${radius / 2}px`;
                circle.element.style.height = `${radius / 2}px`;
            }
        }
    }

    let lastFrameTime = performance.now();
    const runFrutigerClouds = (now) => {
        const delta = now - lastFrameTime;
        lastFrameTime = now;

        if(spawnerSpawnTimeoutId === null) {
            spawnerSpawnTimeoutId = setTimeout(
                spawnSpawner,
                1000 * 1 / config.spawnerSpawnRate
            );
        }

        update(delta);
        requestAnimationFrame(runFrutigerClouds);
    };
    spawnSpawner();
    requestAnimationFrame(runFrutigerClouds);
};
