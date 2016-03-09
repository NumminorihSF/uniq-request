uniq-request
============

An express.js middleware that wrap similar requests, and allow to do some actions only for one of them.

It allow increase count of concurrent requests and decrease memory usage.


## Installation

```sh
npm install uniq-request --save
```

## Principle of work

To understand, how it is work, lets decide, that all request to 1 URI are similar.

On our sever code we has:

```
app.get('/some/path', uniqRequest(heavyDBQuery, moreCalculation), function (req, res) {
  res.send(res.locals.response);
});
```

For example, `heavyDbQuery` need 3 seconds to returning response.

If 10 clients will start GET /some/path, without uniq-request module, we open 10 connections to DB, and DB has some overload (10 similar requests).
Also if we need to do some calculation in nodejs process after db response, we spent X10 time of CPU.

If we use uniq-request module, we make only 1 request into DB and only 1 time will calc.
 
Sometime it can make server LA lower.

**But** it can not make 1st response faster.
Also if you have not many similar requests at 1 time, you need not this middleware.

It can help you to make nodejs faster, if there are many similar requests and your backend need some time to response.



## Usage

The most simple usage is:

```javascript

var uniqRequest = require('uniq-request')();

app.get('/some/path', uniqRequest(func1ToWrap, func2ToWrap, func3ToWrap), function (req, res) {
  res.send(res.locals.response);
});

```


## Configurating

`uniqRequest` waits 2 parameters:

`var uniqRequest = require('uniq-request')(options, uniqStringCalc);`

`options` is an object, that provides paths for transport data from and into request, response objects.

`uniqStringCalc` is a function that should calculate some string to make request uniq. By default it is:

```
function(req, res){
  return req.method+':'+req.originalPath;
};
```

If `uniqStringCalc` has 3 arguments, this function can be async, than 3rd argument will be an callback function.
First arg on callback function is an error object. Second should be a string to unify request.

### Options


Options is an Object with unnecessary fields:

* `.source` _String_ - Path on object, were output data exist. Default: `'res.locals'`. It means, 
that module will get `res.locals` and try to returning it as result after some work.
  * You can use `'req'` or `'request'` as request object link.
  * You can use `'res'` or `'response'` as response object link.
  * If no such route in object, module will return error to express.
* `.dest` _String_ - Path on object, to put result data. Default `'res.locals'`.
  * Linking to object is like on `.source`
  * If no such route in object, module will create it.



## LICENSE - "MIT License"

Copyright (c) 2016 Konstantine Petryaev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.