
  var $page_warp = document.querySelector('.page_warp')
  $page_warp.style.minHeight = window.innerHeight + 'px'

  var viewWidth = window.innerWidth;
  if(viewWidth>500){
    viewWidth = 500
  }
  document.documentElement.style.fontSize = viewWidth/39 + 'px';