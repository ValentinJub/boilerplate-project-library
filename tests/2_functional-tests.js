/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
this.timeout(5000)
let _id, title;
  suite('Routing tests', function() {
    suite('POST /api/books with title => create book object/expect book object', function() { 
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({
          "title": "Je suis un titre de livre, et toi?"
        })
        .end(async (err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.equal(res.body.title,'Je suis un titre de livre, et toi?');
          _id = res.body._id
          title = res.body.title
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({})
        .end(async (err, res) => {
          if(err) return console.error(err)
          //status should be 400 but fcc test fail when setting the status other than 200
          assert.equal(res.status, 200);
          assert.strictEqual(res.text,'missing required field title', 'Return value should be: "missing required field title"');
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){   
      test('Test GET /api/books',  function(done){
        chai
        .request(server)
        .get('/api/books')
        .end((err, res) => {
          if(err) return console.error(err)
          //status should be 400 but fcc test fail when setting the status other than 200
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'An array should be returned');
          assert.property(res.body[0], 'title');
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'commentcount');
          done();
        })
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .get(`/api/books/${_id}`)
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'An object should be returned');
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          assert.property(res.body, "comments");
          assert.strictEqual(res.body._id, _id);
          assert.strictEqual(res.body.title, title);
          done();
        });
      });     
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get('/api/books/filsdepute')
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.strictEqual(res.text,'no book exists', 'Return value should be: "no book exists"');
          done();
        });   
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){    
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post(`/api/books/${_id}`)
        .send({
          comment: "J'suis un commentaire, ques'tu va faire?!"
        })
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'An object should be returned');
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          assert.property(res.body, "comments");
          assert.strictEqual(res.body._id, _id);
          assert.strictEqual(res.body.title, title);
          assert.isArray(res.body.comments, 'An array should be returned')
          //a comment is just posted so we make sure it is above 0
          assert.isAbove(res.body.comments.length, 0)
          done();
        });
      });
      test('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .post(`/api/books/${_id}`)
        .send({
          what: 123
        })
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.strictEqual(res.text,'missing required field comment', 'Return value should be: "missing required field comment"');
          done();
        });
      });
      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post(`/api/books/5f665eb46e296f6b9b6a514d`)
        .send({
          comment: "J'suis un commentaire sans ID"
        })
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.strictEqual(res.text,'no book exists', 'Return value should be: "no book exists"');
          done();
        });   
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .delete(`/api/books/${_id}`)
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.strictEqual(res.text,'delete successful', 'Return value should be: "delete successful"');
          done();
        });   
      });
      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete(`/api/books/5f665eb46e296f6b9b6a514d`)
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.strictEqual(res.text,'no book exists', 'Return value should be: "no book exists"');
          done();
        });   
      });
    });
  });
});