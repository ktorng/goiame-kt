import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


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

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render("main", {content: "notFound"});
  }
};
