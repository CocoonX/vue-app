// 判断来源  false为外部分享来源   true为内部来源
export function source () {
	// console.log(window.location.search.indexOf('singlemessage'))
    if (window.location.search.indexOf('singlemessage') !== -1 || window.location.search.indexOf('timeline') !== -1 || window.location.search.indexOf('qqshare') !== -1) {
      return false
    } else {
      return true
    }
}
