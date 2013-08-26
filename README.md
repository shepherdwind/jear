# jear

jsonify for velocity

## 基本原理与过程

基本原理，从一个vm文件a.vm中，依次读取所有变量，生成一个结构化的a.mock.vm，在a.vm
底部，引用a.mock.vm

```
<!--
#parse('path/to/a.mock.vm')
-->
```

通过开发的服务器，可以在html注释中得到一些准备好的数据，如下形式

```
<!--
@@@review
{
  "@@!reasonFlag": "{{{false}}}",
  "@@!caseId": "{{{4001308230000001}}}",
  "@@tbToken.getAjaxUniqueToken()": "{{{5bb5de1e764ee}}}",
  "@@!{myserviceModule.setTarget(==json/createMessage.vm==)}": "{{{http://support.daily.taobao.net/myservice/json/create_message.htm}}}"
}@@@
-->
```

通过执行`jear -p xx.html`可以得到json结构的数据，这些构成本地demo的模拟数据:

```json
{
  "$!reasonFlag": false,
  "$!caseId": "4001308230000001",
  "$tbToken.getAjaxUniqueToken()": "5bb5de1e764ee",
  "$!{myserviceModule.setTarget(\"json/createMessage.vm\")}": "http://support.daily.taobao.net/myservice/json/create_message.htm"
}
```

这种方案，不考虑vm模板变量运算过程，只关注vm执行过程的输入和输出。

- 输入: 指一个vm变量的表示形式，对于$a.b，输入即字符串'$a.b'
- 输出: 开发通过java元算得到的结果

正常情况下，变量读取是从对象查找过程，velocityjs在查找变量之前，首先对比jear提供
的map，如果变量所对应的字符串存在于map中，直接返回结果。

问题解决描述为，我们知道$a.b.c()的结果，在本地模拟过程，我们不需要知道$a对应的变
量，我们最终只需要知道$a.b.c()的结果。开发vm中的所有变量求值过程，可以看做一堆
函数运算，我们知道函数描述和函数的输出，但函数运算过程有无数种可能，这个过程是
无法模拟，但是模拟运算过程，也是为了得到最终的结果。

## Started

Install the module with: `npm install jear`

```sh
  Usage: jear [option] <file.vm>

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -o, --output <filename>  out put filename
    -p, --parseJSON          parse html, get json data

  Examples:

    $ jear xx.vm
    $ jear -p xx.html
    $ #pase xx.html to a.json
    $ jear -p -o a.json xx.html

```
## License
Copyright (c) 2013 shepherdwind  
Licensed under the MIT license.
