var ContributorsActions = require('../actions/ContributorsActions');

module.exports = {

  loadContributors: function(selector) {
    var contributors=[
      {name: 'Ali Khalili', id:1},
      {name: 'user'+selector.id, id:2},
      {name: 'user'+ selector.type, id:3}
    ]
    // received data from web service, call action
    ContributorsActions.loadContributors(contributors);
  }

};
