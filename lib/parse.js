
var fs = require('fs')
var utils = require('./utils')

exports.parse = function(file){

  var str = fs.readFileSync(file).toString()
  var jsonReg = /@@@[\s\S]+?@@@/g

  var jsons = []
  str.replace(jsonReg, function(json){

    json = json.slice(3, -3).replace(/^[\w_]+/, '')

    jsons.push( getJson(json) )

  })

  return getJsonString(jsons)

}

function getJson(jsonStr){

  jsonStr = jsonStr.replace(/{{{[\s\S]*?}}}/g, function(str){
    var word = str.slice(3, -3)
    return word.replace(/\n/g, '\\n').replace(/"/g, '\\"')
  })

  return JSON.parse(jsonStr)

}

function getJsonString(obj){

  var ret = {}

  if (!utils.isArray(obj)) obj = [obj];

  utils.forEach(obj, function(oo){

    utils.forEach(oo, function(o, key){

      key = key.replace(/@@/g, '$').replace(/==/g, '"')
      if (o === 'false') o = false
      if (o === 'true') o = true

      if (key != o) {

        if (o.indexOf && o.indexOf(':list: ') === 0) {
          o = parseList(o)
        }

        ret[key] = o
      }

    })

  })

  return JSON.stringify(ret, null, 2)
}

function parseList(o){

  var str = o.slice(8, -1)
  var objReg = /[\w\.\d]+\(([^)]+)\)/gi
  var ret = []

  str.replace(objReg, function(t, ostr){

    var arr = ostr.split(',')
    var o = {}

    arr.forEach(function(str){
      var i = str.indexOf('=')
      var key = str.slice(0, i).trim()
      var value = str.slice(i + 1)
      o[key]  = value
    })

    ret.push(o)

  })

  return ret
}
