App = Ember.Application.create({
  // LOG_TRANSITIONS: true,
  // LOG_TRANSITIONS_INTERNAL: true,
  // LOG_VIEW_LOOKUPS: true,
  LOG_ACTIVE_GENERATION: true
});

App.ApplicationController = Ember.ArrayController.extend({
  content: kids,
  one: 'two',
  sortProperties: ['order'],
  sortAscending: true,
  // actions: {
  //   test: function() {
  //     return true; //boolean true doesn't work???
  //   }
  // },

  onValidateItemDrop: function(event) {
    console.log('validateItemDrop');

    if(event.dataTransfer.types.contains('text/uri-list')) {
      return true;
    }
    console.log('uri-list',event.dataTransfer.getData('text/uri-list'));
    
    return true;
  },

  onDrop: function(event,oldList,newList,object,newIndex) {
    console.log('onItemDrop',event);
    console.log('uri-list',event.dataTransfer.getData('text/uri-list'));
    console.log('parentModel',newList);
    console.log('object',object);
    if(typeof newList !== 'undefined' && typeof object !== 'undefined') {
      Ember.set(object,'order',newIndex - 0.1);
      newList.pushObject(object);
      var order = 0;
      newList.forEach(function(item) {
        Ember.set(item,'order',order);
        order++;
      });
    }

    return true;
  }
});

App.IndexController = Ember.ArrayController.extend({

});