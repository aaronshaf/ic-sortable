var kids = Ember.ArrayProxy.create({content: []});

kids.addObject({
  id: 1,
  name: 'John',
  order: 0,
  url: 'http://localhost:8080/kids/1',
  chores: Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,{
    content: [
      {
        id: 1,
        url: 'http://localhost:8080/kids/1/chores/1',
        name: 'Dishes',
        order: 1
      },
      {
        id: 2,
        url: 'http://localhost:8080/kids/1/chores/2',
        name: 'Laundry',
        order: 0
      },
    ],
    sortProperties: ['order']
  })
});

kids.addObject({
  id: 2,
  name: 'Jane',
  order: 2,
  url: 'http://localhost:8080/kids/2',
  chores: Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,{
    content: [
      {
        id: 3,
        url: 'http://localhost:8080/kids/2/chores/3',
        name: 'Sweep floor',
        order: 0
      },
      {
        id: 4,
        url: 'http://localhost:8080/kids/2/chores/4',
        name: 'Mow lawn',
        order: 1
      },
    ],
    sortProperties: ['order']
  })
});

kids.addObject({
  id: 3,
  name: 'Jimmy',
  order: 1,
  url: 'http://localhost:8080/kids/3',
  chores: Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,{
    content: [
      {
        id: 5,
        url: 'http://localhost:8080/kids/3/chores/5',
        name: 'Vacuum',
        order: 1
      },
      {
        id: 6,
        url: 'http://localhost:8080/kids/3/chores/6',
        name: 'Take trash out',
        order: 0
      },
    ],
    sortProperties: ['order']
  })
});