// exports.utilFun = function parseTime(time= +new Date()) {
//     var date = new Date(time + 8 * 3600 * 1000);
//     return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
// }

module.exports = {

    parseTime:function(time) {
        var date = +new Date(time + 8 * 3600 * 1000).valueOf();
        return date;
    },
    addFun:function(x,y){
        return x+y;
    }

}

// module.exports = {parseTime:parseTime,sub:sub};