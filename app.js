lastId = 6;
courseId = 1;
modules = Ember.ArrayProxy.create({content: []});

$.ajax('data/modules.json',{
  dataType: 'json',
  url: 'data/modules.json',
  success: function(data) {
    // Add URL attribute
    data.forEach(function(module,index) {
      if(!module.href) {
        data[index].href = 'http://localhost:3000/api/v1/courses/' + courseId + '/modules/' + module.id;  
      }

      if(module.items) {
        module.items.forEach(function(item,index) {
          if(!item.href) {
            module.items[index].href = 'http://localhost:3000/api/v1/courses/' + courseId + '/modules/' + module.id + '/items/' + item.id;
          }
        });
        module.items = Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,{
          content: module.items,
          sortProperties: ['order']
        });
      }

      modules.addObject(module);
    });

    // modules = Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,{
    //   content: data,
    //   sortProperties: ['order']
    // });
  }
});

App = Ember.Application.create({
  // LOG_TRANSITIONS: true,
  // LOG_TRANSITIONS_INTERNAL: true,
  // LOG_VIEW_LOOKUPS: true,
  LOG_ACTIVE_GENERATION: true
});

