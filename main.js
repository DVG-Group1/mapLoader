const neo4jUsername = 'neo4j';
const neo4jPassword = '4dm1n';
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

const savedJSONLocation = 'public/coords.json';
const saveDataAsJSON = processedData => {
	const json = JSON.stringify(processedData);
	return save(savedJSONLocation, json).then(() => console.log(`Saved ${json.length / 1e6}m`));
};

readJSON(jsonLocation).then(data => {
	const {nodes, edges} = processData({excludeTypes, boundingBox, data});

	return saveGraph({nodes, edges, neo4jUsername, neo4jPassword});
	// if you'd like to save the nodes and edges as json, uncomment this line and comment out the one above
	// return saveDataAsJSON({nodes, edges});
}).catch(err => console.error(err));
