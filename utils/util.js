function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var Get = function(_url, param, cache, callback){
	ToRequest(false, _url, param, cache, callback);
}

var Post = function(_url, param, cache, callback){
	ToRequest(true, _url, param, cache, callback);
}

var ToRequest = function(ispost, _url, param, cache, callback){

	if(cache){

		//对浮点的参数，处理保留小数点后两位（更多的考虑是坐标参数，小数点后位数太多浮动太大）
		for(var _item in param){
			try{
				var _val = param[_item];
				if(!isNaN(_val) && _val.indexOf('.') >= 0){
					param[_item] = parseFloat( _val.substring(0,_val.indexOf('.') + 3));
				}
			}catch (e){}
		}

		var _datakey = _url.replace(/http:\/\//g, "").replace(/\//g, "") + "_" + JSON.stringify(param).replace(/"/g, "").replace(/:/g, "").replace(/,/g, "").replace(/{/g, "").replace(/}/g, "");
		var _timestampkey = _datakey + "_timestamp";

		var _data = wx.getStorageSync(_datakey);
		var _timestamp = wx.getStorageSync(_timestampkey);
		var _now = new Date();

		if(!_data || _data == null || _data == undefined){

			if(ispost){
				wx.request({ url: _url, data: param, header: {'Content-Type': 'application/json'}, method: "POST",
					success: function(_result) {
							if(_result){
								callback(_result);
								wx.setStorage({key:_datakey,data:_result})
								wx.setStorage({key:_timestampkey,data:new Date().getTime()})
							}
					}
				});
			}
			else {
				wx.request({ url: _url, data: param, header: {'Content-Type': 'application/json'},
					success: function(_result) {
							if(_result){
								callback(_result);
								wx.setStorage({key:_datakey,data:_result})
								wx.setStorage({key:_timestampkey,data:new Date().getTime()})
							}
					}
				});
			}
		}
		else {

			//return cache
			callback(_data);

			//ref cache
			var _timeDiff = (_now.getTime()-_timestamp)/1000;	//秒
			if(_timeDiff >= 180){

				setTimeout(function(){
					if(ispost){
						wx.request({ url: _url, data: param, header: {'Content-Type': 'application/json'}, method: "POST",
							success: function(_result) {
									if(_result){
										callback(_result);
										wx.setStorage({key:_datakey,data:_result})
										wx.setStorage({key:_timestampkey,data:new Date().getTime()})
									}
							}
						});
					}
					else {
						wx.request({ url: _url, data: param, header: {'Content-Type': 'application/json'},
							success: function(_result) {
									if(_result){
										callback(_result);
										wx.setStorage({key:_datakey,data:_result})
										wx.setStorage({key:_timestampkey,data:new Date().getTime()})
									}
							}
						});
					}
				}, 0);
			}
		}
	}
	else {

		if(ispost) wx.request({ url: _url, data: param, header: {'Content-Type': 'application/json'}, method: "POST", success: callback});
		else wx.request({ url: _url, data: param, header: {'Content-Type': 'application/json'}, success: callback});
	}
}

module.exports = {
  formatTime: formatTime,
	get: Get,
	post: Post
}