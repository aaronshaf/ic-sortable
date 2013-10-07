App = Ember.Application.create();

var kids = Ember.ArrayProxy.create({content: []});
kids.addObject({
  name: 'John',
  url: 'http://localhost:8080/kids/1',
  chores: Ember.ArrayProxy.create({content: [
    {
      url: 'http://localhost:8080/kids/1/chores/1',
      name: 'Dishes'
    },
    {
      url: 'http://localhost:8080/kids/1/chores/2',
      name: 'Laundry'
    }
  ]})
});

kids.addObject({
  name: 'Jane',
  url: 'http://localhost:8080/kids/2',
  chores: Ember.ArrayProxy.create({content: [
    {
      url: 'http://localhost:8080/kids/2/chores/3',
      name: 'Sweep floor'
    },
    {
      url: 'http://localhost:8080/kids/2/chores/4',
      name: 'Mow lawn'
    }
  ]})
});

kids.addObject({
  name: 'Jimmy',
  url: 'http://localhost:8080/kids/3',
  chores: Ember.ArrayProxy.create({content: [
    {
      url: 'http://localhost:8080/kids/3/chores/5',
      name: 'Vacuum'
    },
    {
      url: 'http://localhost:8080/kids/3/chores/6',
      name: 'Take trash out'
    }
  ]})
});

App.ApplicationController = Ember.Object.extend({
  kids: kids
});

// App.ApplicationView = Ember.View.extend({
//   didInsertElement: function() {
//     $('.sortable').sortable();
//   }
// });

// App.IcSortableItem = Ember.View.extend({
  
// });

function isBelow(el1, el2) {
  var parent = el1.parentNode;
  if (el2.parentNode != parent) {
    return false;
  }

  var cur = el1.previousSibling;
  while (cur && cur.nodeType !== 9) {
    if (cur === el2) {
      return true;
    }
    cur = cur.previousSibling;
  }
  return false;
}

var CustomElement = Ember.Mixin.create({
  init: function() {
    this._super.apply(this, arguments);
    var name = this.constructor.toString().split('.')[1]
      .camelize().dasherize().replace(/-component$/, '');
    document.createElement(name);
    this.set('tagName', name);
  }
});

var currentlyDraggingInstance = undefined;

App.IcSortableComponent = Ember.Component.extend(CustomElement,{
  // classNames: ['primary'],
  dropEffect: 'move',
  attributeBindings: [
    'dropEffect:aria-dropeffect'
  ],
  didInsertElement: function() {
    // this.$().sortable({
    //   items: this.$('> ic-sortable-item'),
    //   connectWith: this.get('connected-with'),
    //   handle: this.$('.ic-drag-handler[connected-with="' + this.get('connected-with') + '"]'),
    //   forcePlaceholderSize: true
    // });
    // alert(this.get('connected-with'));
  },

  drop: function(event) {
    console.log('drop 2');
    event.preventDefault()
    return false;
  }
});

App.IcSortableItemComponent = Ember.Component.extend(CustomElement,{
  draggable: 'true',
  tabindex: "0",
  grabbed: true,
  attributeBindings: [
    'draggable::draggable',
    'tabindex',
    'label:aria-label',
    'ariaGrabbed:aria-grabbed',
    'connectedWith:ic-connected-with'
  ],
  connectedWith: function() {
    return this.get('parentView.connected-with');
  }.property('parentView.connected-with'),
  ariaGrabbed: function() {
    return this.get('grabbed') + '';
  }.property('grabbed'),
  dragStart: function(event) {
    event.stopPropagation()
    currentlyDraggingInstance = this;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text/uri-list', this.get('url')); // necessary to have something
    event.dataTransfer.setData('Text', this.get('url')); // necessary to have something
    // event.target.opacity = "1.0";
    // event.dataTransfer.setDragImage(event.target,-10,-10);

    var nodeList = document.querySelectorAll('[ic-connected-with="' + this.get('connectedWith') + '"]')
    for(var i = 0; i < nodeList.length; ++i) {
      nodeList[i].setAttribute('aria-dropeffect', 'move');
    }

    this.set('grabbed',true);
  },

  dragOver: function(event) {
    // if (!currentlyDraggingInstance) {
    //   return true;
    // }

    // console.log(event.dataTransfer.types)
    // if(event.dataTransfer.types.contains("text/uri-list")) {
      if(event.preventDefault) {
        event.preventDefault();
      }
      return false;
    // }
  },

  drop: function(event) {
    console.log(event.dataTransfer.getData('text/uri-list'));
    event.preventDefault();
    return false;
  },

  dragEnter: function(event) {
    if(!event.dataTransfer.types.contains('text/uri-list')) {
      return false;
    }

    if(typeof currentlyDraggingInstance === 'undefined' 
        || currentlyDraggingInstance.$().get(0) === this.$().get(0)) {
      // return false;
    } else {
      var draggedElement = currentlyDraggingInstance.$().get(0);
      var thisElement = this.$().get(0);

      if (thisElement != draggedElement.parentNode) {
        if(!this.get('parentView.connected-with')) {
          return false;
        }
        if(this.get('parentView.connected-with') !== currentlyDraggingInstance.get('parentView.connected-with')) {
          return false;
        }
      }

      if(isBelow(draggedElement, thisElement)) {
        thisElement.parentNode.insertBefore(draggedElement, thisElement);
      } else {
        thisElement.parentNode.insertBefore(draggedElement, thisElement.nextSibling);
      }
      draggedElement.style.opacity = 0; // setting visibility to none prevents proper drop event
    }

    event.preventDefault();
    return false;
  },

  dragEnd: function(event) {
    var draggedElement = this.$().get(0);
    draggedElement.style.opacity = 1;
    currentlyDraggingInstance = undefined;
    this.set('grabbed',false);

    var nodeList = document.querySelectorAll('[aria-dropeffect]')
    for(var i = 0; i < nodeList.length; ++i) {
      nodeList[i].removeAttribute('aria-dropeffect');
    }
    event.preventDefault();
  }
});
