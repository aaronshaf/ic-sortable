App = Ember.Application.create({
  // LOG_TRANSITIONS: true,
  // LOG_TRANSITIONS_INTERNAL: true,
  // LOG_VIEW_LOOKUPS: true,
  LOG_ACTIVE_GENERATION: true
});

App.ApplicationController = Ember.ArrayController.extend({
  content: kids,
  sortProperties: ['order'],
  sortAscending: true,

  onValidateModuleDrop: function(event) {
    return event.dataTransfer.types.contains('text/module');
  },

  onValidateModuleItemDrop: function(event) {   
    return event.dataTransfer.types.contains('text/module-item') || event.dataTransfer.getData('text/uri-list');
  },

  onModuleDrop: function(event,oldList,newList,object,newIndex) {
  },

  onModuleItemDrop: function(event,oldList,newList,object,newIndex) {
    alert('onModuleItemDrop');
    var name;
    var url;
    var module_item;

    if(typeof object === 'undefined') {
      if(event.dataTransfer.types.contains('text/module-item')) {
        // alert('module-item');
      } else if(event.dataTransfer.types.contains('text/uri-list')) {
        if(event.dataTransfer.types.contains('text/uri-list') && event.dataTransfer.files && event.dataTransfer.files.length) {
          name = event.dataTransfer.files[0].name;
        } else {
          name = event.dataTransfer.getData('text/uri-list');
        }
        url = event.dataTransfer.getData('text/uri-list');
        module_item = Ember.Object.create({
          url: url,
          name: name,
          order: newIndex + 0.1
        });
        newList.pushObject(module_item);
      }
    }

    return true;
  }
});

App.IndexController = Ember.ArrayController.extend({

});