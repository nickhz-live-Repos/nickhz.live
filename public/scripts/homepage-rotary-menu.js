
// TODO implement no-JS rotation, for the giggles.
// JS would have to disable this for its stoppable rotation.
{
    const menuItems = document.getElementsByClassName('menu-item');
    const transitionFrame = document.getElementById('bg-transition-frame');
    const menuItemBgs = [
        null,
        '#2c3c54',
        null,
        null,
        'rgb(0, 0, 27)',
        '#472e1f',
        null,
        null
    ];
    const count = menuItems.length;

    const angles = new Array(count);

    for(let i = 0; i < count; i++) {
        angles[i] = 2 * i * Math.PI / count;
    }
    
    let motionRadius = 15;
    let last;
    let paused = false;
    let hardpaused = false;
    const rotate = (now) => {
        if(last === undefined) {
            last = now;
            requestAnimationFrame(rotate);
        } else {
            const delta = now  - last;
            last = now;

            for(let r = 0; r < angles.length; r++) {
                angles[r] += 0.0005 * delta;
            }

            for(let i = 0; i < menuItems.length; i++) {
                const zCoord = 10 * motionRadius * Math.cos(angles[i]);

                menuItems[i].style.translate = `${motionRadius * Math.sin(angles[i])}vw 0 ${zCoord}px`;

                menuItems[i].style.zIndex = Math.round(zCoord);
            }

            if(!paused && !hardpaused) {
                requestAnimationFrame(rotate);
            }
        }
    }

    for(let index = 0; index < count; index++) {
        item = menuItems[index];

        item.addEventListener('mouseenter', (event) => {
            paused = true;

            if(menuItemBgs[index]) {
                transitionFrame.style.background = menuItemBgs[index];
            }
        });
        item.addEventListener('mouseleave', (event) => {
            last = performance.now();
            paused = false;
            transitionFrame.style.background = 'transparent';
            requestAnimationFrame(rotate);
        })
    }

    const updateRotaryParams = (event) => {
        for(const item of menuItems) {
            item.style.left = `calc(50% - ${parseFloat(getComputedStyle(item).width) / 2}px)`;
        }

        if(window.innerWidth < 768) {
            motionRadius = 30;
        } else {
            motionRadius = 15;
        }
    };

    updateRotaryParams();
    requestAnimationFrame(rotate);

    addEventListener('resize', updateRotaryParams);

    document.getElementById('rotary-menu-stop').addEventListener(
        'click',
        (event) => {
            hardpaused = !hardpaused;

            if(!hardpaused) {
                event.target.innerHTML = 'STOP';
                last = performance.now();
                requestAnimationFrame(rotate);
            } else {
                event.target.innerHTML = 'GO';
            }
        }
    );
};
