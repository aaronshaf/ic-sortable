var kids = Ember.ArrayProxy.create({content: []});

kids.addObject({
  name: 'John',
  order: 0,
  url: 'http://localhost:8080/kids/1',
  chores: Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,{
    content: [
      {
        url: 'http://localhost:8080/kids/1/chores/1',
        name: 'Dishes',
        order: 1
      },
      {
        url: 'http://localhost:8080/kids/1/chores/2',
        name: 'Laundry',
        order: 0
      },
    ],
    sortProperties: ['order']
  })
});

kids.addObject({
  name: 'Jane',
  order: 2,
  url: 'http://localhost:8080/kids/2',
  chores: Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,{
    content: [
      {
        url: 'http://localhost:8080/kids/2/chores/3',
        name: 'Sweep floor',
        order: 0
      },
      {
        url: 'http://localhost:8080/kids/2/chores/4',
        name: 'Mow lawn',
        order: 1
      },
    ],
    sortProperties: ['order']
  })
});

kids.addObject({
  name: 'Jimmy',
  order: 1,
  url: 'http://localhost:8080/kids/3',
  chores: Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,{
    content: [
      {
        url: 'http://localhost:8080/kids/3/chores/5',
        name: 'Vacuum',
        order: 1
      },
      {
        url: 'http://localhost:8080/kids/3/chores/6',
        name: 'Take trash out',
        order: 0
      },
    ],
    sortProperties: ['order']
  })
});