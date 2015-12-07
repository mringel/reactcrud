/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var mongoose = require('mongoose');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/react_notes_dev';
mongoose.connect(mongoURI);
var Note = require(__dirname + '/model/note.js');
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/comments', function(req, res) {
  Note.find({}, function(err, data) {
    if (err) return console.log(err);
    res.send(data);
  });
});

app.post('/api/comments', function(req, res) {
  var newNote = new Note(req.body);
  newNote.save(function(err, data) {
    if (err) return console.log(err);
    res.json({msg :"ok"});
  });
});


app.put('/api/comments/:id',  function(req, res) {
  var noteData = req.body;
  console.log(noteData);
  delete noteData._id;
  Note.update({_id: req.params.id}, noteData, function(err) {
    if (err) return console.log(err);
    res.send({msg: 'updated!'});
  });
});


app.delete('/api/comments/:id', function(req, res) {
  Note.remove({_id: req.params.id}, function(err) {
    if (err) return console.log(err);
    res.send({msg: 'deleted!'});
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
