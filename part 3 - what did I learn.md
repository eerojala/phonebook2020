# What I (re-)learned - part 3
### Truthy and falsy
All javascript objects are considered 'true' in if-statements and other boolean contexts ('truthy'). On the other hand, 'falsy' values are values which are considered false in such contexts. List of falsy values here https://developer.mozilla.org/en-US/docs/Glossary/Falsy . All values which are not falsy are considered truthy.
Example:
```
if (note) {    
	response.json(note)  
} else {    
	response.status(404).end()  
}
```
### Status code for DELETE-requests to non-existing objects
When attempting to delete a non-existing object, the server should return either status code ```204```(No content, i.e. request successful, no need to move user from the current view), or ```404``` (not found) (Apparently there is no wide consensus on which to use)

### The spread syntax
Some functions like ```Math.max``` take only individual variables as parameters (not arrays). If one wishes to use them on an array, one can use the so-called spread syntax (```...``` before the variable) (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). For example:
```
Math.max(...notes.map(n => n.id))
```
### Categories of HTTP-requests:
* Safe (GET, HEAD): requests should not modify the database etc, only return data 
* Idempotent (GET, HEAD, PUT, DELETE): can (but doesn't have to) modify the database, multiple identical requests should leave the database in the same state as only one request (e.g. sending a PUT-request with to api/entries/2 with content```{ name: Eero, number: "05-123456"}``` multiple times ends up with the same database state as sending only once) ()
* Neither (POST): modifies the database, multiple identical requests results in a different database state than sending only once (e.g. sending a POST-request to api/entries with the same content (assuming there no constrictions on fields being unique))

### CORS
CORS (cross origin resource sharing) is a mechanism that allows requesting restricted resurces from other origins (see https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy for which counts as a separate origin). By default the web applications javascript which is run on the browser can only communicate with a server which has the same origin. If CORS is not enabled on the server, then it will block HTTP requests from ```XMLHttpRequests``` and the Fetch API (axios uses ```XMLHttpRequest```) that come from other origins. For example, if the server is running on localhost:3000 and the front-end is running on localhost:3001, the requests from the front-end will be denied because it runs on a different port.

### Document-oriented databases
* Class/object analogy: class: collection, object: document
* Documents can have nested objects
* Schemas not supported natively, data's validity and it's correct interpretation must be enforced on the application level
* Join operations not supported natively, must be implemented on the application level
* Harder to form a schema (more available options because of less restrictions)
* No standard query language
* No support for transactionality for operations which change multiple collections (however there is support for transactionality for operations which only change one collection)