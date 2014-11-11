//var AppTreeActions = require('../actions/AppTreeActions');

module.exports = {
// delivers content: be it of type 'slide', 'deck', 'question', etc.
  getContent: function(type, id) {
    var text='Here is content for item type '+type+' and ID '+id;
    var content={
      id:id,
      type: type,
      text: text
     }
  }

};
