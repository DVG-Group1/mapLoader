const http = require('request-promise-json');
const {inspect} = require('./utils');

const square = x => x * x;
const nodeDistance = (a, b) => Math.sqrt(square(a[0] - b[0]) + square(a[1] - b[1]));
const btoa = str => new Buffer(str).toString('base64');

const saveGraph = ({nodes, edges, neo4jLogin}) => {

	var deleteAllRequest = {
		method: 'POST',
		to: '/cypher',
		body: {query: 'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r'}
	};

	// "nodes" is an array of coordinates, a coordinate is an array with two values, x and y
	var nodeCreationRequests = nodes.map((node, index) => ({
		method: 'POST',
		to: '/node',
		id: index,
		body: {x: node[0], y: node[1]}
	}));

	// "edges" is an array of node index pairs, a node index pair is an array with two numbers, each being the index of a coord in "nodes"
	var relationshipCreationRequests = edges.map(edge => ({
		method: 'POST',
		to: '{' + edge[0] + '}/relationships',
		body: {
			to: '{' + edge[1] + '}',
			type: 'road',
			data: {
				cost: nodeDistance(nodes[edge[0]], nodes[edge[1]])
			}
		}
	}));

	var allRequests = [].concat(
		deleteAllRequest,
		nodeCreationRequests,
		relationshipCreationRequests
	);

	// console.log('Neo4j request length: ' + JSON.stringify(allRequests).length / 1e6 + 'm');
	// inspect(allRequests);

	// console.log(allRequests);

	return http.request({
		method: 'POST',
		url: 'http://localhost:7474/db/data/batch',
		body: allRequests,
		headers: {
			Authorization: 'Basic ' + btoa(neo4jLogin)
		},
	}).then(res => {
		inspect(res);
		console.log('Neo4j\'s response is above.');
	});
}

module.exports = {saveGraph};
