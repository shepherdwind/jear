var utils = require('./utils')
var text = require('./text')(utils)

var show;

function getRef(ast, _show){

  show = _show;

  var type = getType(ast)

  var type2Text = {
    1 : 'plain',
    2 : 'simple method',
    3 : 'chain method',
    4 : 'unknow'
  };

  var ret = {
    type: type2Text[type],
    value: text(ast),
    path: getPath(ast)
  };

  if (type === 1) {
    //console.log(ret)
    return ret;
  }

  if (type === 2) {
    return simple(ret, ast)
  }

  if (type === 3) {
    return chain(ret, ast)
  }

}

function chain(ret, ast){

  var len = ast.path.length;
  ret.path.pop()
  ret.actions = []

  var now = ret.path.length - 1;

  for (var i = now; i  < len; i ++) {

    var args = []
    var current = ast.path[i]

    utils.forEach(current.args, function(ast){
      if (ast.type === 'references') return args.push(show(ast).value);
      args.push(ast.value)
    })

    ret.actions.push({ action: current.id, args: args })

  }

  return ret

}

function simple(ret, ast){

  var len = ast.path.length - 1;
  var last = ast.path[len];

  var args = [];

  utils.forEach(last.args, function(ast){

    if (ast.type === 'references') return args.push(show(ast).value);

    args.push(ast.value)

  })

  ret.args = args;

  return ret;
}

function getPath(ast){

  var ret = [ast.id]

  utils.some(ast.path, function(ast){

    ret.push(ast.id)
    return ast.type === 'method'

  })

  return ret;
}

/**
 * 获取变量类型，大致分为3中类型
 * 1. $a.b[1]，变量路径读取类型
 * 2. $a.b.c($aaa, 1) 最后一个为函数读取
 * 3. $a.setUrl($url).addQuery('a', '123').addQuery('c', 'd') 连缀函数类型
 * 4. 其他类型
 */
function getType(ast){

  if (!ast.path)
    return ast.type === 'method' ? 2 : 1;

  var len = ast.path.length - 1;
  var types = [];

  types = utils.map(ast.path, function(ast){
    return ast.type === 'method' ? 1: 0;
  })

  // 如果是函数类型，数组为1，否则，数组为0，如果全部是0，那么属于第一种类型
  types.unshift(0);

  var a = + types.join('')

  if (a === 0) return 1;

  // 如果有函数，types中存在1，把types中前面的0去掉，然后把1取异或，如果得到
  // 的值是0，那么属于第二种或者第三种类型
  var rTypes = utils.map(String(a).split(''), function(i) { return i ^ 1; })

  var b = + rTypes.join('')

  if (b === 0)
    return a === 1 ? 2 : 3;

  return 4;

}

exports.getRef = getRef
