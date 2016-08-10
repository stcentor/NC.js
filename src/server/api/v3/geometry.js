'use strict';
var file = require('./file');
let find = file.find;
let fileType = file.fileT;

/***************************** Endpoint Functions *****************************/

function _getGeometry(req, res) {
  let ms = file.ms;

  if(fileType === 'stpnc'){
    if (req.params.type === 'shell') {
      res.status(200).send(ms.GetGeometryJSON(req.params.id , 'MESH'));
      return;
    } else if (req.params.type === 'annotation') {
      res.status(200).send(ms.GetGeometryJSON(req.params.id , 'POLYLINE'));
      return;
    } else if (req.params.type === 'tool') {
      let toolId = find.GetToolWorkpiece(Number(req.params.id));
      res.status(200).send(find.GetJSONProduct(toolId));
      return;
    } else if (!req.params.type && req.params.eid) {
      if (!isNaN(Number(req.params.eid)) && isFinite(Number(req.params.eid))) {
        res.status(200).send(find.GetJSONProduct(Number(req.params.eid)));
      } else {
        res.status(200).send(find.GetJSONGeometry(req.params.eid, 'MESH'));
      }
      return;
    }
    res.status(200).send(ms.GetGeometryJSON());
    return;
  }
  else if (fileType === 'stp'){
    if (req.params.type === 'shell') {
      res.status(200).send(find.GetJSONGeometry(req.params.id , 'MESH'));
      return;
    } else if (req.params.type === 'annotation') {
      res.status(200).send(find.GetJSONGeometry(req.params.id , 'POLYLINE'));
      return;
    } else if (req.params.type === 'tool') {
      let toolId = find.GetToolWorkpiece(Number(req.params.id));
      res.status(200).send(find.GetJSONProduct(toolId));
      return;
    } else if (!req.params.type && req.params.eid) {
      if (!isNaN(Number(req.params.eid)) && isFinite(Number(req.params.eid))) {
        res.status(200).send(find.GetJSONProduct(Number(req.params.eid)));
      } else {
        res.status(200).send(find.GetJSONGeometry(req.params.eid, 'MESH'));
      }
      return;
    }
    return;
  }
}

function _InitStp(req, res){
  let wps = find.GetWorkpieceAll();
  res.status(200).send(find.GetJSONProduct(wps[0]));
}

module.exports = function(app, cb) {
  app.router.get('/v3/nc/geometry', _getGeometry);
  app.router.get('/v3/nc/geometry/:id/:type', _getGeometry);
  app.router.get('/v3/nc/geometry/:eid', _getGeometry);
  app.router.get('/v3/nc/stpinit', _InitStp);
  if (cb) {
    cb();
  }
};
