/*
 * jsonify
 * https://github.com/eward/jsonify
 *
 * Copyright (c) 2013 shepherdwind
 * Licensed under the MIT license.
 */

'use strict';

var Velocity = require('velocityjs')
var utils = require('./utils')
var getRef = require('./reference').getRef
var tree = require('./tree').tree

var jsonify = function(str){

  var asts = Velocity.Parser.parse(str)
  this.tokens = []
  this.show(asts)

  //console.log(this.tokens)
  var _tree = tree(this.tokens)
  console.log(JSON.stringify(_tree))

}

jsonify.prototype = {

  constructor : jsonify,

  show: function(ast){

    var self = this;

    if (utils.isArray(ast)) {
      return utils.forEach(ast, self.show, self)
    } 

    var type = ast.type;

    if (type && type !== 'comment') {

      if (type === 'references') {

        var token = getRef(ast, self.show.bind(self))
        if (token) self.tokens.push(token)

        return token;
      }

      if (type === 'if' || type === 'elseif') {
        return self.show(ast.condition)
      }

      if (type === 'math') {
        return self.show(ast.expression)
      }

      if (type === 'string' && ast.isEval) {
        return self.show(Velocity.Parser.parse(ast.value))
      }

    }

  }

};


module.exports = jsonify;
