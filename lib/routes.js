FlowRouter.route('/', function () {
  this.render('main');
  Session.set("currentView", "startMenu");
});

FlowRouter.route('/:accessCode', function () {
  var accessCode = this.params.accessCode;
  this.render('main');
  Session.set("urlAccessCode", accessCode);
  Session.set("currentView", "joinGame");
});
