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

// const boundingBox = { // All of STL
// 	min: [-90.481630, 38.597452],
// 	max: [-90.177094, 38.813553]
// };

readJSON(jsonLocation).then(data => {

	const {nodes, edges} = processData({excludeTypes, boundingBox, data});
	return saveGraph({nodes, edges, neo4jUsername, neo4jPassword});

	// this part here is for saving as JSON in the public folder so it can be viewed by public/index.html
	// const json = JSON.stringify(processedData);
	// return save('public/coords.json', json).then(() => console.log(`Saved ${json.length / 1e6}m`));

}).catch(err => console.error(err));
