
var fs = require('fs')
var utils = require('./utils')

exports.parse = function(file){

  var str = fs.readFileSync(file).toString()
  var jsonReg = /@@@([\s\S]+)@@@/g
  var ret = jsonReg.exec(str)
  var fileName = /^(\w+)/.exec(ret[1])
  fileName = (fileName[1])

  var jsonStr = ret[1].replace(fileName, '')

  jsonStr = jsonStr.replace(/{{{[\s\S]*?}}}/g, function(str){
    var word = str.slice(3, -3)
    return word.replace(/\n/g, '\\n').replace(/"/g, '\\"')
  })

  var obj = JSON.parse(jsonStr)
  var ret = {}

  utils.forEach(obj, function(o, key){
    key = key.replace(/@@/g, '$').replace(/==/g, '"')
    if (o === 'false') o = false
    if (o === 'true') o = true
      ret[key] = o
  })

  console.log(JSON.stringify(ret, null, 2))
}

function parseObj(obj){

  utils.forEach(obj, function(o, key){
    if (o.$type && o.$value && utils.keys(o).length == 2) {
      obj[key] = o.$value
    }
  })

  return obj

}
