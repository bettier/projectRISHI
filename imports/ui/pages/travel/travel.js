import './travel.html'
import {ReactiveVar} from 'meteor/reactive-var';

let p = [
  {
    title: "Title",
    content: "hihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihii"
  }
];

let projects = new ReactiveVar(p);

Template.App_travel.helpers({
  projects() {
    if (projects) {
      return projects.get();
    }
    return projects;
  }
});