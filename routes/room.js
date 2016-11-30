var express = require('express');
var router = express.Router();
var OpenTok = require('opentok');

var apiKey = '45711252';
var opentok = new OpenTok(apiKey, 'f5ecfc73d3d418b5da3ddf40ed4597ea9a5f8e64');
var rooms = {};

function makeNewSession(roomName, callback) {
  if (typeof rooms[roomName] === 'undefined') {
    opentok.createSession({ mediaMode: 'routed' }, function createSessionCallback(error, session) {
      if (error) {
        callback(error);
      }
      rooms[roomName] = session;
      callback(session);
    });
  }
  else {
    callback(rooms[roomName]);
  }
}


router.get('/:roomName', function createRoomAndSessionCallback(req, res) {
  makeNewSession(req.params.roomName, function makeNewSessionCallback(session) {
    var tokenOptions = {};
    if (typeof session.sessionId === 'undefined') {
      res.send('Sorry, an error ocurred.');
    }
    else {
      tokenOptions.data = req.query.user;
      if (req.query.mod === 'true') {
        tokenOptions.role = 'moderator';
      }
      res.render('index', {
        title: req.params.roomName,
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: session.generateToken(tokenOptions),
        user: req.query.user,
        mod: req.query.mod
      });
    }
  });
});

router.post('/:roomName', function responseToPostCallback(req, res) {
  if (req.body.request === 'start') {
    opentok.startArchive(req.body.sessionId, function startArchiveCallback(error, video) {
      if (error) {
        res.send('Sorry, an error occurred.');
      }
      else {
        res.send(video.id);
      }
    });
  }
  else {
    opentok.stopArchive(req.body.videoId, function stopArchiveCallback(error, video) {
      if (error) {
        res.send('Sorry an error occurred.');
      }
      res.send('Stopped' + video.videoId);
    });
  }
});

module.exports = router;
