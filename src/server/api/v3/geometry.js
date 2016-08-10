'use strict';
var file = require('./file');
var _ = require('lodash');

/***************************** Endpoint Functions *****************************/

function _getGeometry(req, res) {
  let ms = file.ms;
  let find = file.find;

  if (req.params.type === 'shell') {
    res.status(200).send(ms.GetGeometryJSON(req.params.id , 'MESH'));
    return;
  } else if (req.params.type === 'annotation') {
    res.status(200).send(ms.GetGeometryJSON(req.params.id , 'POLYLINE'));
    return;
  } else if (req.params.type === 'tool') {
    let toolId = find.GetToolWorkpiece(Number(req.params.id));
    res.status(200).send(find.GetJSONProduct(toolId)); // toolId));
    return;
  } else if (req.params.type === 'ws') {
    let tobe = find.GetExecutableWorkpieceAsIs(Number(req.params.id));
    tobe = JSON.parse(find.GetJSONProduct(tobe));
    tobe.geom.usage='tobe';
    let asis = find.GetExecutableWorkpieceToBe(Number(req.params.id));
    asis = JSON.parse(find.GetJSONProduct(asis));
    asis.geom.usage='asis';
    let delta = find.GetExecutableWorkpieceRemoval(Number(req.params.id));
    delta = JSON.parse(find.GetJSONProduct(delta));
    delta.geom.usage='delta';

    let json = tobe;
    json.geom = _.concat(json.geom, asis.geom, delta.geom);

    res.status(200).send(JSON.stringify(json));
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

module.exports = function(app, cb) {
  app.router.get('/v3/nc/geometry', _getGeometry);
  app.router.get('/v3/nc/geometry/:id/:type', _getGeometry);
  app.router.get('/v3/nc/geometry/:eid', _getGeometry);
  if (cb) {
    cb();
  }
};
