FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("main", { currentView: "startMenu "});
  }
});

FlowRouter.route('/:accessCode', {
  action: function(params) {
    BlazeLayout.render("main", { currentView: "joinGame", accessCode: params.accessCode });
  }
});
