const fs = require('fs');

if (!Array.prototype.includes) Array.prototype.includes = function(item){
	return this.indexOf(item) !== -1;
};

const flatten = arr => {
	let flat = [];
	for (let i = 0; i < arr.length; i++){
		for (let j = 0; j < arr[i].length; j++){
			flat.push(arr[i][j]);
		}
	}
	return flat;
};

const arrayUnique = (arr, idFunc) => {
	let seen = {};
	idFunc = idFunc || (el => el);
	return arr.filter(el => {
		let id = idFunc(el);
		return !seen[id] && (seen[id] = true);
	});
};

const reverseIndex = arr => {
	var index = {};
	arr.forEach((el, i) => index[el] = i);
	return index;
};

const inspect = (() => {
	const indent = str => str.replace(/\n/g, '\n ');
	const toStr = (ob, depth) => {
		if (ob === null) return 'null';
		if (Array.isArray(ob)){
			if (!ob.length) return '[]';
			if (depth){
				let rows = ob.slice(0, 3).map((el, index) => `\n${index}: ` + toStr(el, depth - 1));
				if (ob.length > rows.length){
					rows.push(`\n...${ob.length - rows.length} more items...`);
				}
				return '[' + indent(rows.join(',')) + '\n]';
			}
			return `[...${ob.length} items...]`;
		}
		if (typeof ob == 'object'){
			let keys = Object.keys(ob);
			if (!keys.length) return '{}';
			if (depth){
				let rows = keys.map(key => `\n${key}: ` + toStr(ob[key], depth - 1));
				return '{' + indent(rows.join(',')) + '\n}';
			}
			return `{...${keys.length} props...}`;
		}
		if (typeof ob == 'string') return `'${ob}'`;
		return ob.toString();
	}
	return ob => console.log(toStr(ob, 8));
})();



const readJSON = filename => new Promise((resolve, reject) => {
	fs.readFile(filename, (err, data) => {
		if (err) reject(err);
		else {
			try {
				resolve(JSON.parse(data));
			} catch (e){
				reject(e);
			}
		}
	});
});

const save = (filename, data) => new Promise((resolve, reject) => {
	fs.writeFile(filename, data, err => {
		if (err) reject(err);
		else resolve(data);
	});
});

const getBoundingBox = coords => {
	let min = [Infinity, Infinity], max = [-Infinity, -Infinity];
	coords.forEach(coord => {
		min[0] = Math.min(min[0], coord[0]);
		min[1] = Math.min(min[1], coord[1]);
		max[0] = Math.max(max[0], coord[0]);
		max[1] = Math.max(max[1], coord[1]);
	});
	return {min, range: [max[0] - min[0], max[1] - min[1]]};
};

module.exports = {inspect, readJSON, save, getBoundingBox, flatten, arrayUnique, reverseIndex};
