
export default (roads) => {
    const result = Object.create(null);

    const addPath = (from, to) => {
        if(!result[from]) {
            result[from] = new Array();
        }

        if(!result[from].includes(to)) {
            result[from].push(to);
        }
    }
    
    for(const road of roads) {
        const [pointA, pointB] = road.split('-');

        addPath(pointA, pointB);
        addPath(pointB, pointA);
    }

    return result;
};
