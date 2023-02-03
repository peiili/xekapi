var send = function (tag) { var xhr = new XMLHttpRequest(); xhr.open('get', 'https://dlsjf.top/api/log?tag=' + tag)
xhr.send() 
xhr.onreadystatechange = function () { if (xhr.readyState === 4 && xhr.status === 200) { console.log(xhr.responseText); } } } 
var findXek = function (ele) { if (ele) { if (ele && ele.getAttribute('xek-t')) { var tag = ele.getAttribute('xek-t'); send(tag) } else { findXek(ele.parentElement) } } }; 
document.addEventListener('click', function (event) { findXek(event.target) }); var xekLogJsApi = function (tag) { send(tag) }
window.xekLogJsApi = xekLogJsApi;
