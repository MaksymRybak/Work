var http = require('request');
var cors = require('cors');
var _ = require('lodash');
var linkify = require("html-linkify");
var moment = require('moment');
var debug = require('debug')('HipConnectTester:routes');
var prettyjson = require('prettyjson');

function getTheme(req) {
  return req.query.theme || 'light';
}

module.exports = function (app, addon) {
  var hipchat = require('../lib/hipchat')(addon);
  var generator = require('../lib/generator');

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  var conditionalGlanceEnabled = true;

  // Root route. This route will serve the `addon.json` unless a homepage URL is
  // specified in `addon.json`.
  app.get('/',
      function(req, res) {
        // Use content-type negotiation to choose the best way to respond
        res.format({
          // If the request content-type is text-html, it will decide which to serve up
          'text/html': function () {
            res.redirect(addon.descriptor.links.homepage);
          },
          // This logic is here to make sure that the `addon.json` is always
          // served up when requested by the host
          'application/json': function () {
            res.redirect('/atlassian-connect.json');
          }
        });
      }
  );

  app.get('/sidebar/cards',
      addon.authenticate(),
      function (req, res) {
        addon.logger.info("Servicing /sidebar/cards for ", req.clientInfo.clientKey);
        res.render('cards', {
          card: generator.randomCard(),
          json: generator.cardJSON(),
          theme: getTheme(req)
        });
      });

  app.get('/sidebar/glances',
      addon.authenticate(),
      function (req, res) {
        addon.logger.info("Servicing /sidebar/glances for ", req.clientInfo.clientKey);
        res.render('glances', {
          json: generator.glanceJSON(),
          theme: getTheme(req)
        });
      });

  app.get('/sidebar/dialogs',
      addon.authenticate(),
      function (req, res) {
        addon.logger.info("Servicing /sidebar/dialogs for ", req.clientInfo.clientKey);
        res.render('dialogs', {
          json: generator.dialogJSON(),
          theme: getTheme(req)
        });
      });

  app.get('/sidebar/messages',
      addon.authenticate(),
      function (req, res) {
        addon.logger.info("Servicing /sidebar/messages for ", req.clientInfo.clientKey);
        res.render('messages', {
          json: generator.dialogJSON(),
          theme: getTheme(req)
        });
      });

  app.get('/sidebar/input-actions',
      addon.authenticate(),
      function (req, res) {
        addon.logger.info("Servicing /sidebar/input-actions for ", req.clientInfo.clientKey);
        res.render('input-actions', {
          theme: getTheme(req),
          params: {}
        });
      });

  app.get('/sidebar/message-actions',
      addon.authenticate(),
      function (req, res) {
        addon.logger.info("Servicing /sidebar/message-actions for ", req.clientInfo.clientKey);
        res.render('message-actions', {
          theme: getTheme(req),
          params: {}
        });
      });

  app.get('/sidebar/invite-user-dialog',
      addon.authenticate(),
      function (req, res) {
        addon.logger.info("Servicing /sidebar/invite-user-dialog for ", req.clientInfo.clientKey);
        res.render('invite-user-dialog', {
          json: generator.glanceJSON(),
          theme: getTheme(req)
        });
      });

  app.get('/glance/dynamic',
      addon.authenticate(),
      function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send({
          label: {
            type: 'html',
            value: '<em>' + addon.descriptor.capabilities.glance[1].name.value + '</em>'
          }
        });
      });

  app.post('/glance/update',
      addon.authenticate(),
      function(req, res) {
        debug(req.body);
        var data = req.body;
        if (data.type === 'json' || data.type === 'custom') {
          data.glance = JSON.parse(data.glance);
        }
        hipchat
            .pushGlanceDataToRoom(req.clientInfo, req.identity.roomId, 'hctester.glance.dynamic', data.glance)
            .then(function (hcdata) {
              res.send(hcdata);
            }, function (err) {
              res.send(err);
            });
      }
  );

  app.post('/glance/create', addon.authenticate(), function(req, res) {
    var data = req.body;
    hipchat.createGlance(req.clientInfo, req.identity.roomId, {
      key: data.key,
      name: {
        value: data.name
      },
      icon: {
        'url': 'http://icons.iconarchive.com/icons/icons8/windows-8/128/Messaging-Online-icon.png',
        'url@2x': 'http://icons.iconarchive.com/icons/icons8/windows-8/128/Messaging-Online-icon.png'
      }
    }).then(function(data) {
      console.log(data);
      res.send(data);
    }).catch(function(err) {
      console.log(err);
      res.send(err);
    })
  });

  app.post('/glance/delete', addon.authenticate(), function(req, res) {
    var data = req.body;
    hipchat.deleteGlance(req.clientInfo, req.identity.roomId, data.key).then(function(data) {
      console.log(data);
      res.send(data);
    }).catch(function(err) {
      console.log(err);
      res.send(err);
    })
  });

  app.get('/glance/conditional',
      addon.authenticate(),
      function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send({
          label: {
            type: 'html',
            value: '<em>' + addon.descriptor.capabilities.glance[2].name.value + '</em>'
          },
          metadata: {
            isEnabled: conditionalGlanceEnabled
          }
        });
      });

  app.get('/dialog/simple',
      addon.authenticate(),
      function(req, res) {
        res.render('simple-dialog', {
          theme: getTheme(req)
        });
      });

  app.get('/dialog/complex',
      addon.authenticate(),
      function(req, res) {
        res.render('complex-dialog', {
          theme: getTheme(req)
        });
      });

  app.get('/external',
      addon.authenticate(),
      function(req, res) {
        res.render('external', {
          theme: getTheme(req),
          query: _.omit(req.query, 'signed_request')
        });
      });

  app.post('/enable',
      addon.authenticate(),
      function(req, res) {
        conditionalGlanceEnabled = true;
        hipchat
            .pushGlanceDataToRoom(req.clientInfo, req.identity.roomId, 'hctester.glance.condition.metadata',
                {
                  label: {
                    type: 'html',
                    value: '<em>' + addon.descriptor.capabilities.glance[2].name.value + '</em>'
                  },
                  metadata: {
                    isEnabled: conditionalGlanceEnabled
                  }
                })
            .then(function (hcdata) {
              res.send(hcdata);
            }, function (err) {
              res.send(err);
            });
      }
  );

  app.post('/disable',
      addon.authenticate(),
      function(req, res) {
        conditionalGlanceEnabled = false;
        hipchat
            .pushGlanceDataToRoom(req.clientInfo, req.identity.roomId, 'hctester.glance.condition.metadata',
                {
                  label: {
                    type: 'html',
                    value: '<em>' + addon.descriptor.capabilities.glance[2].name.value + '</em>'
                  },
                  metadata: {
                    isEnabled: conditionalGlanceEnabled
                  }
                })
            .then(function (hcdata) {
              res.send(hcdata);
            }, function (err) {
              res.send(err);
            });
      }
  );

  app.post('/sendcard',
      addon.authenticate(),
      function (req, res) {
        addon.logger.info("Servicing /sendcard for ", req.clientInfo.clientKey);
        debug(req.body);
        var data = req.body;
        if (data.type === 'random') {
          data.card = generator.randomCard();
        } else if (data.type === 'image') {
          data.card = generator.imageCard();
        } else if (data.type === 'link') {
          data.card = generator.linkCard();
        } else if (data.type === 'media') {
          data.card = generator.mediaCard();
        } else if (data.type === 'application') {
          data.card = generator.applicationCard();
        } else if (data.type === 'activity') {
          data.card = generator.activityCard();
        } else if (data.type === 'json' || data.type === 'custom') {
          try {
            data.card = JSON.parse(data.card);
          }
          catch (e) {
            res.status(400).send("JSON parsing error");
          }
        }
        hipchat.getRoom(req.clientInfo, req.identity.roomId)
            .then(function (data) {
              return _.get(_.find(data.body.participants, {'id': parseInt(req.identity.userId)}), 'name');
            })
            .then(function (userName) {
              hipchat.sendMessage(req.clientInfo, req.identity.roomId, '<b>Fallback message</b>',
                  {
                    options: {
                      color: 'gray',
                      from: data.from || userName
                    }
                  }, data.card)
                  .then(function (hcdata) {
                    res.send({card: data.card, hcdata: hcdata});
                  }, function (err) {
                    res.send(err);
                  });
            })
            .catch(function (err) {
              res.send(err);
            });
      });

    app.post('/updated', function(req, res) {
        addon.logger.info(req.body);
        res.sendStatus(204);
    });

    app.post('/send/action', addon.authenticate(), function (req, res) {
        addon.logger.info("Servicing /send/action for ", req.clientInfo.clientKey);
        debug(req.body);
        var actionCard = {
            card: ''
        };
        actionCard.card = getActionCard(req.headers.origin, req.body.actionSpec);
        hipchat.getRoom(req.clientInfo, req.identity.roomId)
            .then(function (data) {
                return _.get(_.find(data.body.participants, {'id': parseInt(req.identity.userId)}), 'name');
            })
            .then(function (userName) {
                hipchat.sendMessage(req.clientInfo, req.identity.roomId, '<b>Fallback message</b>',
                    {
                        options: {
                            color: 'yellow',
                            from: userName
                        }
                    }, actionCard.card)
                    .then(function (hcdata) {
                        res.send({card: actionCard, hcdata: hcdata});
                        if (!hcdata.body || !hcdata.body.error) {
                            // TODO: send card to room Piloti, only if there is no errors
                            SendCardToRoomPiloti(userName, req.clientInfo.roomId, '<b>Fallback message</b>', actionCard.card);
                        }
                    }, function (err) {
                        res.send(err);
                    });
            })
            .catch(function (err) {
                res.send(err);
            });
    });

    function getActionCard(baseUrl, actionSpec) {
        var card = {
            style: 'application',
            id: 'action-card',
            title: 'New action',
            format: 'medium',
            description: {
                value: actionSpec,
                format: 'html'
            }
        };
        return card;
    };

    app.get('/get/actions',
        addon.authenticate(),
        function (req, res) {
            hipchat.getRoomMessages(req.clientInfo, req.identity.roomId)
                .then(function (data) {
                    var allMessages = data.body.items;
                    var allCards = _.filter(allMessages, function(m) { return m.card; });
                    var actionCards = _.filter(allCards, function(m) {
                        var cardJson = JSON.parse(m.card);
                        return cardJson.id === 'action-card';
                    });
                    var notDoneActionCards = _.filter(actionCards, function (m) {
                        var relDoneMsg = _.find(allMessages, function (am) {
                            // TODO: si puo' megliorare mettendo id del msg nel tag strong per esempio
                            return am.message === '<strong>DONE: </strong>' + JSON.parse(m.card).description.value;
                        });
                        return !relDoneMsg;
                    });
                    res.setHeader('Content-Type', 'application/json');
                    res.send({
                        actions: notDoneActionCards
                    });
                });
        });

    app.post('/read/action', addon.authenticate(), function (req, res) {
        addon.logger.info("Servicing /read/action for ", req.clientInfo.clientKey);
        var data = req.body;
        var msg = '<strong>READ: </strong>' + data.actionSpec;
        hipchat.getRoom(req.clientInfo, req.identity.roomId)
            .then(function (data) {
                return _.get(_.find(data.body.participants, {'id': parseInt(req.identity.userId)}), 'name');
            })
            .then(function (username) {
                hipchat.sendMessage(req.clientInfo, req.identity.roomId, msg, {
                    options: {
                        from: username,
                        format: "html",
                        color: "yellow"
                    }
                }).then(function(){
                    SendMsgToRoomPiloti(username, req.clientInfo.roomId, msg);
                });
            })
            .then(function() {
                res.send();
            })
            .catch(function (err) {
                res.send(err);
            });
    });

    app.post('/done/action', addon.authenticate(), function (req, res) {
        addon.logger.info("Servicing /done/action for ", req.clientInfo.clientKey);
        var data = req.body;
        var msg = '<strong>DONE: </strong>' + data.actionSpec;
        hipchat.getRoom(req.clientInfo, req.identity.roomId)
            .then(function (data) {
                return _.get(_.find(data.body.participants, {'id': parseInt(req.identity.userId)}), 'name');
            })
            .then(function (username) {
                hipchat.sendMessage(req.clientInfo, req.identity.roomId, msg, {
                    options: {
                        from: username,
                        format: "html",
                        color: "yellow"
                    }
                }).then(function(){
                    SendMsgToRoomPiloti(username, req.clientInfo.roomId, msg);
                });
            })
            .then(function() {
                res.send();
            })
            .catch(function (err) {
                res.send(err);
            });
    });

    app.get('/sidebar/send/action', addon.authenticate(), function (req, res) {
        addon.logger.info("Servicing /sidebar/send/action for ", req.clientInfo.clientKey);
        res.render('webpanel-send-action', {
            theme: getTheme(req)
        });
    });

    app.get('/sidebar/get/actions', addon.authenticate(), function (req, res) {
        addon.logger.info("Servicing /sidebar/ges/actions for ", req.clientInfo.clientKey);
        res.render('webpanel-get-actions', {
            theme: getTheme(req)
        });
    });

    // post read confirmation to the room
    app.post('/dialog/reply/message/read', addon.authenticate(), function (req, res) {
        var data = req.body;
        var username = data.username;
        var msg = 'READ - ' + data.message;
        hipchat.sendMessage(req.clientInfo, req.identity.roomId, msg, {
            options: {
                from: username,
                format: "html",
                color: "yellow"
            }
        }).then(function(){
            SendMsgToRoomPiloti(username, req.clientInfo.roomId, msg);
        });
    });

    // post done confirmation to the room
    app.post('/dialog/reply/message/done', addon.authenticate(), function (req, res) {
        var data = req.body;
        var username = data.username;
        var msg = 'DONE - ' + data.message;
        hipchat.sendMessage(req.clientInfo, req.identity.roomId, msg, {
            options: {
                from: username,
                format: "html",
                color: "yellow"
            }
        }).then(function(){
            SendMsgToRoomPiloti(username, req.clientInfo.roomId, msg);
        });
    });

    function SendMsgToRoomPiloti(originMsgFrom, originRoomId, msg) {
        var requestData = null;
        if (originRoomId === 2783635) {
            var requestData = {
                from: "Vettel - " + originMsgFrom,
                message : msg,
                color: "red",
                message_format: "html"
            };
        } else if (originRoomId === 2783636) {
            var requestData = {
                from: "Raikkonen - " + originMsgFrom,
                message : msg,
                color: "green",
                message_format: "html"
            };
        }
        http({
            url: 'https://tccf1.hipchat.com/v2/room/Piloti/notification?auth_token=fllVD2J3Ve8UgrqOb0n2488nGHL8b6H723oeBPiw',
            method: "POST",
            json: requestData
        }, function (error, response, body) {
            if (error)
                console.log("error: " + JSON.parse(error));
        });
    }

    function SendCardToRoomPiloti(originMsgFrom, originRoomId, msg, card) {
        var requestData = null;
        if (originRoomId === 2783635) {
            var requestData = {
                from: "Vettel - " + originMsgFrom,
                message : msg,
                color: "red",
                message_format: "html",
                card: card
            };
        } else if (originRoomId === 2783636) {
            var requestData = {
                from: "Raikkonen - " + originMsgFrom,
                message : msg,
                color: "green",
                message_format: "html",
                card: card
            };
        }
        http({
            url: 'https://tccf1.hipchat.com/v2/room/Piloti/notification?auth_token=fllVD2J3Ve8UgrqOb0n2488nGHL8b6H723oeBPiw',
            method: "POST",
            json: requestData
        }, function (error, response, body) {
            if (error)
                console.log("error: " + JSON.parse(error));
        });
    }

    // post info message to the room
    app.post('/dialog/message/info', addon.authenticate(), function (req, res) {
        var data = req.body;
        var username = data.username;
        var msg = '/info ' + data.message;
        hipchat.sendMessage(req.clientInfo, req.identity.roomId, msg, {
            options: {
                from: username,
                format: "html",
                color: "yellow"
            }
        }).then(function(){
            SendMsgToRoomPiloti(username, req.clientInfo.roomId, msg);
        });
    });

    // post action message to the room
    app.post('/dialog/message/action', addon.authenticate(), function (req, res) {
        var data = req.body;
        var username = data.username;
        var msg = '/action ' + data.message;
        hipchat.sendMessage(req.clientInfo, req.identity.roomId, msg, {
            options: {
                from: username,
                format: "html",
                color: "yellow"
            }
        }).then(function() {
            SendMsgToRoomPiloti(username, req.clientInfo.roomId, msg);
        });
    });

    // webhook listening for info messages
    app.post('/webhook/send-to-piloti', addon.authenticate(), function(req, res) {
        var msg = req.body.item.message.message;
        // NOTA: non funziona post di msg da una room ad un'altra (token ritornato da HipChat non da sufficienti permessi)
        /*hipchat.sendMessage(req.clientInfo, 'Piloti', msg, {
         format: "html",
         color: req.body.item.room.name === 'Vettel'? "red" : "blue"
         });*/
        hipchat.getRoom(req.clientInfo, req.identity.roomId)
            .then(function (data) {
                return _.get(_.find(data.body.participants, {'id': parseInt(req.identity.userId)}), 'name');
            })
            .then(function (username) {
                SendMsgToRoomPiloti(username, req.clientInfo.roomId, msg);
            })
            .catch(function (err) {
                res.send(err);
            });
    });

    // Notify the room that the add-on was installed
    addon.on('installed', function (clientKey, clientInfo, req) {
        //addon.logger.info('curl --data "grant_type=client_credentials" -u ' + clientInfo.clientKey + ':' + clientInfo.oauthSecret + ' https://devvm.hipchat.com/v2/oauth/token')
        if (req.body.roomId) {
            hipchat.sendMessage(clientInfo, req.body.roomId, 'The ' + addon.descriptor.name + ' add-on has been installed in this room');
        }
    });

    // Clean up clients when uninstalled
    addon.on('uninstalled', function (id) {
        addon.settings.client.keys(id + ':*', function (err, rep) {
            rep.forEach(function (k) {
                addon.logger.info('Removing key:', k);
                addon.settings.client.del(k);
            });
        });
    });
};
