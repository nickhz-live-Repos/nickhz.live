/* 
    Exercise 7.1 - Measuring a Robot

    This only works in the context of the textbook page, when run from the 
    editable code box in the exercise's section. The exercise is here: 

    https://eloquentjavascript.net/07_robot.html#i-JrK0ADjuHH
*/

{
    runRobot = function(state, robot, memory) {
        for (let turn = 0;; turn++) {
            if (state.parcels.length == 0) {
            return turn;
            }
            let action = robot(state, memory);
            state = state.move(action.direction);
            memory = action.memory;
        }
    };
    
    function compareRobots(robot1, memory1, robot2, memory2) {
        let [sum1, sum2] = [0, 0];
        
        for(let i = 0; i < 100; i++) {
            const initialState = VillageState.random();
        
            sum1 += runRobot(initialState, robot1, memory1);
            sum2 += runRobot(initialState, robot2, memory2);
        }
        
        const [avg1, avg2] = [sum1 / 100, sum2 / 100];
        
        console.log(`Average 1: ${avg1}; Average 2: ${avg2}`);
        return [avg1, avg2];
    };
    
    // compareRobots(routeRobot, [], goalOrientedRobot, []);
}

/*
    Exercise 7.2 - Robot Efficiency

    Is this graph theory? I was never taught graph theory, but I'm comfortable 
    with thinking in complex logical structures.

    Link to the exercise:
    https://eloquentjavascript.net/07_robot.html#i-VbBsQJ1lp6
*/

{
    /*
        Find routeGraph from roadGraph...

        For each location, there will be shortest routes that lead to every 
        other location.

        These routes are the sets of locations that must be traversed to reach 
        those destinations from the given locations.

        {"Alice's House":{"Bob's House": ["Bob's House"], "Town Hall": ["Bob's House", "Town Hall"], ...}, "Bob's House":{"Alice's House":..., ...}, ...}

        The shortest route for every adjacent location is trivially just the 
        one-location set containing that adjacent location.

        routeGraph["Alice's House"]["Bob's House"] = ["Bob's House"]
        routeGraph["Alice's House"]["Town Hall"] = []

        After finding all these trivial routes, then assess the routes 
        associated with those adjacent locations.

        routeGraph["Bob's House"]["Town Hall"] = ["Town Hall"]

        If the adjacent locations' known routes have destinations whose routes 
        aren't known for the base location, concatenate that route with the 
        route to the adjacent location to get the total route for that 
        non-adjacent location.

        routeGraph["Alice's House"]["Town Hall"] = 
            routeGraph["Alice's House"]["Bob's House"]
            .concat(routeGraph["Bob's House"]["Town Hall"])
        ;
        routeGraph["Alice's House"]["Town Hall"] = ["Bob's House", "Town Hall"]

        Now do the same thing for all the non-adjacent locations, gathering 
        all the known locations (the base location plus adjacent ones) and 
        excluding those from destinations that are considered from 
        non-adjacent locations, so that routes don't try to double back.

        After the non-adjacent locations have their previously-unknown 
        destinations added to the routes from the base location, assess the 
        adjacent locations of all the newly known destinations to determine 
        the routes from those newly known destinations to any unknown
        destinations adjacent to them.

        Do this iteratively until this location knows all the routes to every 
        location on the graph structure.

        Now, do THAT iteratively to get all the shortest routes from every 
        location to every location.

        routeGraph = {"Alice's House":{"Bob's House": ["Bob's House"], "Town Hall": ["Bob's House", "Town Hall"], ...}, ...}
    */
    const buildRouteGraph = (graph) => {
        const routeGraph = {};

        // create all one-step routes
        for(const fromLocation in graph) {
            const routes = {};
            routeGraph[fromLocation] = routes;

            for(const toLocation in graph) {
                if(toLocation !== fromLocation) {
                    routes[toLocation] = graph[fromLocation].includes(toLocation) ? [toLocation] : [];
                }
            }
        }

        // for each location, branch from the known routes until all destinations have routes
        for(const fromLocation in routeGraph) {
            const routesFromLocation = routeGraph[fromLocation];
            const knownLocations = [fromLocation];

            // get all known locations for this location
            for(const knownRoutes in routesFromLocation) {
                const routeToDestination = routesFromLocation[knownRoutes];
                const knownDestination = routeToDestination.length > 0 ? routeToDestination[routeToDestination.length - 1] : null;
                if(knownDestination !== null && !knownLocations.includes(knownDestination)) {
                    knownLocations.push(knownDestination);
                }
            }

            // get the next step that comes after these locations, and from this, build routes to the places that weren't known
            for(const knownLocation of knownLocations) {
                const adjacentLocations = graph[knownLocation];

                for(const adjacentLocation of adjacentLocations) {
                    if(!knownLocations.includes(adjacentLocation)) {
                        routesFromLocation[adjacentLocation] = routesFromLocation[knownLocation].slice();
                        routesFromLocation[adjacentLocation].push(adjacentLocation);
                        knownLocations.push(adjacentLocation);
                    }
                }
            } // !!! BECAUSE KNOWN LOCATIONS EXPANDS WITH EACH SUCCESSFUL ITERATION, THIS ALSO ITERATES OVER NEW KNOWN LOCATIONS, FINDING ALL ROUTES
            // (this exceeded expected behavior upon writing; I expected it to find routes up to 2 spaces away)
        }

        return routeGraph;
    };

    // const routeGraph = buildRouteGraph(roadGraph);
    // const currentState = VillageState.random();
 
    /*
        For the robot itself, hold its intended route as the memory. Initial 
        memory will be an empty route:

        memory = []

        When the memory is empty, find which route to assign as its memory. 
        The possible routes are route arrays from the route graph, above, that 
        begin at the current location (villageState.place).

        possible routes = routeGraph[villageState.place] = 
            {"Alice's House": ["Alice's House"], "Bob's House": ["Alice's House", "Bob's House"], ...}
        ;

        Now assess the current route associated with each parcel. For a 
        parcel that's at the same location as the robot, it'll be the route 
        leading to the address on that parcel, and for a parcel that's at a 
        different location than the robot, it'll be the place of that parcel.

        If that route is the shortest one for any of the available parcels, 
        assign that route to the memory and traverse that route.

        This behavior's key advantage over the goalOrientedRobot from the 
        chapter's text is that it can assess whether to go to a parcel or to 
        a current parcel's "address" next, whichever is closer, rather than 
        only being able to target a parcel address whenever a parcel is held.
    */
    const myRobot = (villageState, memory) => {

        // if it's not currently en-route, pick a next route
        if(memory.length === 0) {
            const currentLocation = villageState.place;

            const parcels = villageState.parcels;

            // if a parcel is held, assess its destination; if not, assess its location
            let distance = Infinity;
            for(const parcel of parcels) {
                const potentialDestination = parcel.place == currentLocation 
                    ? 
                    parcel.address
                    :
                    parcel.place
                ;
                const potentialRoute = routeGraph[currentLocation][potentialDestination];

                if(potentialRoute.length <= distance) {
                    memory = potentialRoute;
                    distance = memory.length;
                }
            }
        }

        return {
            direction: memory[0],
            memory: memory.slice(1)
        };
    };

    // runRobotAnimation(currentState, myRobot, []);
    
    

    // measurement assessment; copied from my answer to the last exercise
    runRobot = function(state, robot, memory) {
        for (let turn = 0;; turn++) {
            if (state.parcels.length == 0) {
            return turn;
            }
            let action = robot(state, memory);
            state = state.move(action.direction);
            memory = action.memory;
        }
    };
    
    function compareRobots(robot1, memory1, robot2, memory2) {
        let [sum1, sum2] = [0, 0];
        
        for(let i = 0; i < 100; i++) {
            const initialState = VillageState.random();
        
            sum1 += runRobot(initialState, robot1, memory1);
            sum2 += runRobot(initialState, robot2, memory2);
        }
        
        const [avg1, avg2] = [sum1 / 100, sum2 / 100];
        
        console.log(`Average 1: ${avg1}; Average 2: ${avg2}`);
        return [avg1, avg2];
    };
    
    // myRobot average: ~12.5, goalOrientedRobot average: ~15
    // compareRobots(myRobot, [], goalOrientedRobot, []);

    /*
        This algorithm could be made better by scoring locations based on the 
        routes traveled and processing using that, but I've already done more 
        than the exercise was asking for. I should just move on, so I will.
    */
};

/*
    Exercise 7.3 - Persistent Group

    Yeah, maybe I went overboard on the exercise above.

    Link to the exercise:
    https://eloquentjavascript.net/07_robot.html#i-s+ntyh5xrm
*/
{
    const PGroup = class {
        static #empty = new this([]);
        #group;

        constructor(values) {
            this.#group = values;
        }

        static get empty() {
            return this.#empty;
        }

        add(item) {
            const newGroup = this.#group.slice();

            if(!this.has(item)) {
                newGroup.push(item);
            }

            return new PGroup(newGroup);
        }

        delete(item) {
            const newGroup = this.#group.slice();
            const itemIndex = newGroup.indexOf(item);

            if(itemIndex !== -1) {
                newGroup.splice(itemIndex, 1);
            }

            return new PGroup(newGroup);
        }

        has(item) {
            return this.#group.includes(item);
        }
    };

    // let a = PGroup.empty.add("a");
    // let ab = a.add("b");
    // let b = ab.delete("a");

    // console.log(b.has("b"));
    // // → true
    // console.log(a.has("b"));
    // // → false
    // console.log(b.has("a"));
    // // → false
};
