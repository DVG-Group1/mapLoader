const utils = require('./utils');

const processData = ({excludeTypes, boundingBox, data}) => {

	// roads is an array of arrays of coordinates
	const roads = data.features.filter(f =>
		!excludeTypes.includes(f.properties.type) &&
		f.geometry.coordinates.some(c =>
			c[0] > boundingBox.min[0] && // 70/270 Interchange
			c[0] < boundingBox.max[0] &&
			c[1] < boundingBox.max[1] &&
			c[1] > boundingBox.min[1]
		)
	).map(f => f.geometry.coordinates);

	const allNodes = utils.flatten(roads);
	const nodes = utils.arrayUnique(allNodes, node => node.toString());

	// make a map from node to index in nodes
	const reverseIndex = utils.reverseIndex(nodes);

	// get the edges. This only works because "normalize" altered the original data
	const edges = [];
	roads.forEach(road => {
		for (let i = 0; i < road.length - 1; i++){
			let a = reverseIndex[road[i]];
			let b = reverseIndex[road[i + 1]];
			if (a != b) {
				edges.push([a, b]);
			}
		}
	});

	return {nodes, edges};
};

module.exports = {processData};
