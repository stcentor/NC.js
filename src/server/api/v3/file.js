'use strict';
let StepNC = require('../../../../../STEPNode/build/Release/StepNode');
let fs = require('fs');
let pth = require('path');

function init(path, machinetool) {
  fs.accessSync(path, fs.R_OK , () => process.exit());
  this.apt = new StepNC.AptStepMaker();
  this.find = new StepNC.Finder();
  this.tol = new StepNC.Tolerance();

	var ext = pth.extname(path);
	if(ext === '.stpnc'){
		this.apt.OpenProject(path);
		this.ms = new StepNC.machineState(path);
		this.find.OpenProject(path);

		//this.ms = new StepNC.machineState(path);
		if(machinetool !== null){
			if(!this.ms.LoadMachine(machinetool))
				console.log("ERROR: Machinetool was not loaded");
			else
				console.log("Loaded Machine Successfully")
		}
		this.fileT = 'stpnc';
	}
	else if(ext === '.stp'){
		this.apt.OpenProject(path);
		this.ms = new StepNC.machineState(path);
		this.find.OpenProject(path);
		this.fileT = 'stp';
	}
	else{
		this.fileT = 'Unknown File Type';
	}
}

module.exports.init = init;
module.exports.find = this.find;
module.exports.apt = this.apt;
module.exports.tol = this.tol;
module.exports.ms = this.ms;
module.exports.fileT = this.fileT;
