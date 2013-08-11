var utils = require('./utils')

function makeTree(asts){

  var obj = {}

  utils.forEach(asts, function(ast){

    var t = obj
    var len = ast.path.length - 1

    utils.forEach(ast.path, function (path, i){

      t[path] = t[path] || {}
      t = t[path]

    })

    if (ast.type === 'plain') {

      t.$value = ast.value
      t.$type = ast.type

    } else {

      if (t.$$) {

        //排除已经出现过的函数
        var hasUsed = utils.some(t.$$, function($$){
          return $$.value == ast.value
        })

        if (!hasUsed) t.$$.push(ast)

      } else {
        t.$$ = [ast]
      }

    }

  })

  return obj

}

exports.tree = makeTree
