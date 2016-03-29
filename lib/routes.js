FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("main", { content: "startMenu" });
  }
});

FlowRouter.route('/:accessCode', {
  action: function(params) {
    BlazeLayout.render("main", { content: "joinGame", accessCode: params.accessCode });
  }
});
