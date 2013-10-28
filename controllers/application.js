App.ApplicationController = Ember.ArrayController.extend({
  content: modules,
  sortProperties: ['order'],
  sortAscending: true,

  onValidateModuleDrop: function(event) {
    return event.dataTransfer.types.contains('text/module');
  },

  onValidateModuleItemDrop: function(event) {
    if(event.dataTransfer.types.contains('text/module')) return false;
    return event.dataTransfer.types.contains('text/module-item') || event.dataTransfer.types.contains('text/uri-list');
  },

  onModuleDrop: function(event,newIndex) {
    // alert('Set module ' + event.dataTransfer.getData('text/module') + ' to index ' + newIndex);
    // Example:
    // var id = event.dataTransfer.getData('text/module');
    // this.get('store').update('module', id)
  },

  onModuleItemDrop: function(event,newIndex,object,oldList,newList) {
    var name;
    var url;
    var module_item;

    if(typeof object !== 'undefined') {
      return;
    }

    if(event.dataTransfer.types.contains('text/module-item')) {
      // newList
      // alert('module-item');
      // var id = event.dataTransfer.getData('text/module-item');
      // this.get('store').update('module-item', id)
    } else if(event.dataTransfer.types.contains('text/uri-list')) {
      if(event.dataTransfer.types.contains('text/uri-list') && event.dataTransfer.files && event.dataTransfer.files.length) {
        name = event.dataTransfer.files[0].name;
      } else {
        name = event.dataTransfer.getData('text/uri-list');
      }
      url = event.dataTransfer.getData('text/uri-list');
      module_item = Ember.Object.create({
        id: ++lastId,
        url: url,
        name: name,
        order: newIndex
      });
      newList.pushObject(module_item);
    }
  }
});