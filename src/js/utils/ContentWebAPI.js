var DeckActions = require('../actions/DeckActions');
var SlideActions = require('../actions/SlideActions');


module.exports = {
// delivers content: be it of type 'slide', 'deck', 'question', etc.
  loadContent: function(type, id) {
    var text='Here comes content for item type '+type+' and ID '+id;
    var res={
      id:id,
      content:{
        body: text
      }
     }
     switch(type){
       case "deck":
         DeckActions.loadDeck(res);
       break;
       case "slide":
         SlideActions.loadSlide(res);
       break;
     }

  }

};
