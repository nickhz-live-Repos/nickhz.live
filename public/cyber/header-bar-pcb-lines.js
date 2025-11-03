/* 
    Header-bar PCB lines animation script for https://nickhz.live/cyber
*/

{
    // in a class definition so the same code can apply once for each side
    class PCBLineAnim {
        #viewBoxHeight;
        #viewBoxWidth;
        #strokeWidth;
        #laneCount;
        #laneHeight;
        #rightFacing;
        #color;
        #translucentLength;
        #opaqueLength;

        #maxDelayMsBetweenLines;
        #lineLifespanMs;

        constructor(parentElement, rightFacing) {
            this.parent = parentElement;
            this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.parent.replaceChildren(this.svg);

            this.#viewBoxHeight = 120;
            this.#strokeWidth = 1.5;
            this.#laneCount = 5;
            this.#laneHeight = Math.floor(this.#viewBoxHeight / (1 + this.#laneCount));
            this.#rightFacing = rightFacing;
            this.#color = 'var(--primary-accent)';
            this.#translucentLength = 50;
            this.#opaqueLength = 100 - this.#translucentLength;
            this.#maxDelayMsBetweenLines = 3000;
            this.#lineLifespanMs = 700;

            this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            this.svg.appendChild(this.defs);
            this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            this.svg.appendChild(this.g);

            this.g.setAttribute('stroke-width', this.#strokeWidth);
            this.g.setAttribute('fill', 'none');

            const initGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            const initPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            this.defs.append(initGradient);
            this.g.append(initPath);

            // connect the gradient to the PCB line
            const gradientId = `${rightFacing ? 'right' : 'left'}-line-gradient-${Date.now()}`;
            initGradient.setAttribute('id', gradientId);
            initPath.setAttribute('stroke', `url(#${gradientId})`);

            // set breakpoints for the gradient
            // transparent stop, opaque stop, end stop, and a dummy stop that renders transparency after the end stop
            const initStops = [
                document.createElementNS('http://www.w3.org/2000/svg', 'stop'),
                document.createElementNS('http://www.w3.org/2000/svg', 'stop'),
                document.createElementNS('http://www.w3.org/2000/svg', 'stop'),
                document.createElementNS('http://www.w3.org/2000/svg', 'stop')
            ];
            for(const stopTag of initStops) {
                stopTag.setAttribute('stop-color', this.#color);
            }
            initStops[0].setAttribute('stop-opacity', '0%');
            initStops[1].setAttribute('stop-opacity', '100%');
            initStops[2].setAttribute('stop-opacity', '100%');
            initStops[3].setAttribute('stop-opacity', '0%');

            initStops[0].setAttribute('offset', '0%');
            initStops[1].setAttribute('offset', '0%');
            initStops[2].setAttribute('offset', '100%');
            initStops[3].setAttribute('offset', '0%');

            initGradient.append(...initStops);

            // package lines into an array, for the case of having multiple lines at once
            this.lines = [
                {
                    gradient: initGradient,
                    path: initPath,
                    transparentStop: initStops[0],
                    opaqueStop: initStops[1],
                    endStop: initStops[2],
                    lastSpawnTime: 0,
                    nextDespawnTime: 0,
                    nextSpawnTime: 0
                }
            ];

            // set the effect's dimensional specs
            initGradient.setAttribute('x1', 0);
            initGradient.setAttribute('y1', 0);
            initGradient.setAttribute('y2', 0);
            initGradient.setAttribute('gradientUnits', 'userSpaceOnUse');

            this.refreshDimensions();
            window.addEventListener('resize', () => { this.refreshDimensions(); });

            this.run();

            // un-comment this to check that the constructor functions
            // initPath.setAttribute('d', 'M 0 60 h 2000');
        }

        /**
         * Runs the PCB lines visual effect animation.
         */
        run() {
            let lastFrameTime = performance.now();

            // generates the d attribute for a PCB line's path element
            const generatePathData = () => {
                let lane = Math.floor(Math.random() * this.#laneCount);
                const startingHeight = this.#laneHeight * (lane + 1);

                let currentPoint = 0;
                let result = `M 0 ${startingHeight} h `;

                // 90% chance to change lanes at least once
                const initChance = 1;
                let laneChangeChance = initChance;
                let remainingLength = this.#viewBoxWidth;
                let roll = Math.random();

                if(roll >= laneChangeChance) {
                    result = result + this.#viewBoxWidth;
                } else {
                    while(roll < laneChangeChance) {
                        const changePoint = Math.random() * remainingLength;
                        const newLane = Math.floor(Math.random() * this.#laneCount);
                        const heightChange = (newLane - lane) * this.#laneHeight;

                        result = result + `${changePoint} l ${Math.abs(heightChange)} ${heightChange} h `;
                        currentPoint += changePoint + Math.abs(heightChange);

                        // chance adjusts based on the remaining length of the line
                        remainingLength = this.#viewBoxWidth - currentPoint;
                        laneChangeChance = initChance * remainingLength / this.#viewBoxWidth;
                        roll = Math.random();
                    }

                    result = result + `${Math.max(this.#viewBoxWidth - currentPoint, 0)}`;
                }

                return result;
            }

            const updateGradientData = (line, now) => {
                const endDistance = 200 * (now - line.lastSpawnTime) / this.#lineLifespanMs;
                const opaqueDistance = endDistance - this.#opaqueLength;
                const transparentDistance = opaqueDistance - this.#translucentLength;

                line.transparentStop.setAttribute('offset', `${transparentDistance}%`);
                line.opaqueStop.setAttribute('offset', `${opaqueDistance}%`);
                line.endStop.setAttribute('offset', `${endDistance}%`);
            };

            const runEffect = (now) => {
                // const delta = now - lastFrameTime;
                lastFrameTime = now;

                for(const line of this.lines) {
                    if(now >= line.nextSpawnTime) {
                        // spawn next line
                        line.path.setAttribute('d', generatePathData());

                        line.lastSpawnTime = now;
                        line.nextDespawnTime = now + this.#lineLifespanMs;
                        line.nextSpawnTime = line.nextDespawnTime + this.#maxDelayMsBetweenLines * Math.random();
                    }

                    // update the gradient information
                    updateGradientData(line, now);
                }

                requestAnimationFrame(runEffect);
            };

            requestAnimationFrame(runEffect);
        }

        /**
         * Updates the viewbox to be in line with the actual dimensions of the visual on the page.
         * 
         * Viewbox height may not match the header height, so viewbox width is adjusted proportionally.
         */
        refreshDimensions() {
            this.#viewBoxWidth = this.parent.offsetWidth * this.#viewBoxHeight / this.parent.offsetHeight;

            this.svg.setAttribute(
                'viewBox',
                `0 0 ${this.#viewBoxWidth} ${this.#viewBoxHeight}`
            );

            if(!this.#rightFacing) {
                this.g.setAttribute('transform', `scale(-1,1) translate(-${this.#viewBoxWidth}, 0)`);
            }

            for(const line of this.lines) {
                line.gradient.setAttribute('x2', this.#viewBoxWidth);
            }
        }
    }; // end class
    
    new PCBLineAnim(document.getElementById('left-pcb-anim'), false);
    new PCBLineAnim(document.getElementById('right-pcb-anim'), true);
};
