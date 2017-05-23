var isMenuFocused, focusedResizing;

window.textarea = function() {
  var inputs = document.getElementsByTagName('textarea');
  for (var i = 0; i < inputs.length; i++) {
    input = inputs[i];
    input.onfocus = focused;
    input.onblur = blured;
  }
  window.onscroll = scrolled;
}

window.inputfield = function() {
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    input = inputs[i];
    input.onfocus = focused;
    input.onblur = blured;
  }
  window.onscroll = scrolled;
}

function focused(event) {
  isMenuFocused = true;
  scrolled();
}

function blured(event) {
  isMenuFocused = false;
  var headStyle = document.getElementById('toolbar').style;
  if (focusedResizing) {
    focusedResizing = false;
    headStyle.position = 'fixed';
    headStyle.top = 0;
  }
}

function scrolled() {
 // document.title = 'test';
  var headStyle = document.getElementById('toolbar').style;
  if (isMenuFocused) {
    if (!focusedResizing) {
      focusedResizing = true;
      headStyle.position = 'absolute';
    } 
    headStyle.top = window.pageYOffset + 'px';
    // window.innerHeight wrong
    //var footTop = window.pageYOffset + window.innerHeight - foot.offsetHeight;
    //footStyle.bottom = (document.body.offsetHeight - footTop) + 'px';
  }
}