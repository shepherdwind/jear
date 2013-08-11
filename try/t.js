var jsonify = require('../lib/index')
var fs = require('fs')

var str = fs.readFileSync('./t.vm').toString()

//var str = '$!moneyUtil.getMoney($math.add($math.sub($math.mul($!{order.getAuctionPrice()},$!{order.getBuyAmount()}),$!{order.getDiscountFee()}),$!{order.getAdjustFee()}, 10))';

        //var str = '#if("1"=="$!{order.getAttribute(\'3c3\')}") <a class="xiaobao" href="http://www.taobao.com/go/act/315/xfzbz_wx.php?ad_id=&am_id=13001183050ce2498755&cm_id=&pm_id=" title="消费者保障服务，卖家承诺30天维修" target="_blank"><img src="$!{assetsServer.getURI(\'tbsp/icon/xiaobao/a_30-day_guarantee_16x16.png\')}" alt="消费者保障服务，卖家承诺30天维修" /></a> #end #if("1"=="$!{order.getAttribute(\'qk\')}") <a class="xiaobao" href="http://www.taobao.com/go/act/315/xfzbz_sdfh.php?ad_id=&am_id=13001183083c787ce2b4&cm_id=&pm_id=" title="卖家承诺付款后1小时发货" target="_blank"><img src="$!{assetsServer.getURI(\'tbsp/icon/xiaobao/a_thunder-like_delivery_16x16.png\')}" alt="卖家承诺付款后1小时发货" /></a> #end';
new jsonify(str)
