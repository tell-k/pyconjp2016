var initDoms = function(){

  var nl2br = function(str) {
      str = str.replace(/\r\n/g, "<br>");
      str = str.replace(/(\n|\r)/g, "<br>");
      return str;
  }

  var el = $("body > div.section");
  $(el).addClass("layout-widescreen");
  $("body > div.section").each(function(i, e){
    var target = null;
    var addElements = [];
    for (var i=0; i < e.children.length; i++) {
      target = $(e.children[i]);
      if (target.hasClass('section') || target.hasClass('slide-area')) {
        continue;
      }
      addElements.push(target);
    }
    var ele = $(document.createElement('div'));
    ele = ele.addClass("section");
    for (var j=0; j < addElements.length; j++) {
      ele.append(addElements[j]);
    }
    ele.prependTo("body > div.section");
  });

  $("body > div.section > div.section").each(function(i, e){
     var notesLength = $(e).find('p.presenter-notes').length;
     if((e.children.length - notesLength) == 1) {
        $(e.firstElementChild).addClass("special");
     }
     if (i == 0) {
       $(e).find('p.presenter-notes').each(function(i, e) {
         titleNotes.push(nl2br($(e).text()));
       });
     } else {
       var notes = [];
       $(e).find('p.presenter-notes').each(function(i, e) {
         notes.push(nl2br($(e).text()));
       });
       sections.push({'Notes': notes});
     }
  });

  $("a.headerlink").hide();

  $("body > div.section > div.section a").each(function(i, e){
     if ($.trim($(e).text()) === $.trim(e.href)) {
        $(e).addClass("ignore-explicit-link");
     }
  });
 
};
