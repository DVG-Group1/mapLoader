const neo4jLogin = 'neo4j:4dm1n';
const jsonLocation = './saint-louis_missouri_roads.geojson';

const {processData} = require('./nodeScripts/dataProcessor');
const {saveGraph} = require('./nodeScripts/saveToNeo4j');
const {readJSON, save} = require('./nodeScripts/utils');

const excludeTypes = ['footway', 'pedestrian', 'path', 'cycleway', 'light_rail', 'rail', 'disused', 'steps', 'pier', 'unclassified', 'service', 'living_street'];

const boundingBox = { // 70/270 Interchange
	min: [-90.449728, 38.738143],
	max: [-90.431133, 38.761202]
};

// comment out the above bounding box and uncomment the one below to widen the field of view to all of St. Louis
// const boundingBox = { // All of STL
// 	min: [-90.481630, 38.597452],
// 	max: [-90.177094, 38.813553]
// };

readJSON(jsonLocation).then(data => {
	const {nodes, edges} = processData({excludeTypes, boundingBox, data});
	return saveGraph({nodes, edges, neo4jLogin});
}).catch(err => console.error(err));
