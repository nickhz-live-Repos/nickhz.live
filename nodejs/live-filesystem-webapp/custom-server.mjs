import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';

const server = createServer((req, res) => {
	
	
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.write(`OK!`);
	res.end();
});

server.listen(8000);

console.log('server now running...');
