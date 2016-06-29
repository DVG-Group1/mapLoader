const neo4jLogin = 'neo4j:4dm1n';
const jsonLocation = './saint-louis_missouri_roads.geojson';

const excludeTypes = ['footway', 'pedestrian', 'path', 'cycleway', 'light_rail', 'rail', 'disused', 'steps', 'pier', 'unclassified', 'service', 'living_street'];

const boundingBoxName = 'St. Louis'; // see possible names below
const boundingBoxPresets = {
	'70/270 Interchange': {
		min: [-90.449728, 38.738143],
		max: [-90.431133, 38.761202]
	},
	'St. Louis': {
		min: [-90.481630, 38.597452],
		max: [-90.177094, 38.813553]
	},
	'Inner City': {
		min: [-90.270463, 38.615831],
		max: [-90.180288, 38.661658]
	}
	// add your own here if you want, use Google Maps to find the coordinates. Remember though, the latitude increases as you go north, so min is south and max is north. Latitude increases as you go east, so min is west, max is east.
};

const {processData} = require('./nodeScripts/dataProcessor');
const {saveGraph} = require('./nodeScripts/saveToNeo4j');
const {readJSON, save} = require('./nodeScripts/utils');

readJSON(jsonLocation).then(data => {
	const {nodes, edges} = processData({excludeTypes, boundingBox: boundingBoxPresets[boundingBoxName], data});
	return saveGraph({nodes, edges, neo4jLogin});
}).catch(err => console.error(err));
