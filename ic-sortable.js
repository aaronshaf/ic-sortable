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

var oldList = undefined;
var currentDraggable = undefined;
var currentDraggableModel = undefined;
var newIndex = undefined;

App.IcSortableComponent = Ember.Component.extend(CustomElement,{
  // classNames: ['primary'],
  dropEffect: 'move',
  attributeBindings: [
    'dropEffect:aria-dropeffect'
  ],
  type: function() {
    // If type isn't provided upon instantiation, use list type
    return this.get('parentView.type');
  }.property(),

  didInsertElement: function() {
    // this.$().sortable({
    //   items: this.$('> ic-sortable-item'),
    //   connectWith: this.get('connected-with'),
    //   handle: this.$('.ic-drag-handler[connected-with="' + this.get('connected-with') + '"]'),
    //   forcePlaceholderSize: true
    // });
    // alert(this.get('connected-with'));
  },

  dragEnter: function() {
    // console.log('dragEnter 2');
  },

  drop: function(event) {
    //verify
    if(this.get('on-validate-drop')) {
      if(!this.get('on-validate-drop').call(this,event)) {
        return false;
      }
    } else {
      if(!event.dataTransfer.types.contains('text/' + this.get('type'))) {
        return false;
      }
    }

    var newList = this.get('model');
    var draggedElement;
    var cameFromDifferentList;
    // console.debug('sortable drop');
    // console.log('event.target',event.target);

    // event,oldList,newList,object,newIndex
    
    if(typeof currentDraggable !== 'undefined') {
      oldList = currentDraggable.get('parentView.model');
      cameFromDifferentList = oldList !== newList;
      draggedElement = currentDraggable.$().get(0);
      if(cameFromDifferentList) {
        oldList.removeObject(currentDraggable.get('model'));    
      }
      draggedElement.remove();

      var object = currentDraggableModel; // for terseness
      if(typeof object !== 'undefined') {
        if(cameFromDifferentList) {
          newIndex -= 0.1;
        } else if(object.order < newIndex) {
          newIndex += 0.1;
        } else if(object.order >= newIndex) {
          newIndex -= 0.1;
        }
        Ember.set(object,'order',newIndex);
        
        if(cameFromDifferentList) {
          newList.pushObject(object);
        }
      }
    } else {

    }
    
    if(this.get('on-drop')) {
      if(this.get('on-drop').call(this,event,[],this.get('model'),currentDraggableModel,newIndex) === false) { //parentModel, model
        return false;
      }
    }
    
    var order = 0;
    newList.forEach(function(item) {
      Ember.set(item,'order',order);
      order++;
    });

    if(cameFromDifferentList) {
      order = 0;
      oldList.forEach(function(item) {
        Ember.set(item,'order',order);
        order++;
      });
    }

    event.preventDefault()
    currentDraggableModel = undefined;
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
    'ariaLabel:aria-label',
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
    // console.debug('dragStart');

    event.stopPropagation();
    currentDraggable = this;
    currentDraggableModel = this.get('model')
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    
    var type = this.get('type');
    if(typeof type === 'undefined') {
      type = this.get('parentView.type');
    }

    event.dataTransfer.setData('text/' + type, this.get('url')); // necessary to have something
    event.dataTransfer.setData('Text', this.get('url')); // necessary to have something
    // event.target.opacity = "1.0";
    // event.dataTransfer.setDragImage(event.target,-10,-10);

    var nodeList = document.querySelectorAll('[ic-connected-with="' + this.get('connectedWith') + '"]')
    for(var i = 0; i < nodeList.length; ++i) {
      nodeList[i].setAttribute('aria-dropeffect', 'move');
    }

    this.originalParentNode = this.$().get(0).parentNode;
    this.set('grabbed',true);
  },

  dragOver: function(event) {

    // console.debug('dragOver');

    // if (!currentDraggable) {
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
    /*
    If outside uri resource (no instance, no object), then...
    If 'local' object, then push it to array proxy
    If dropped onto itself(?)...
    */

    var draggedElement = this.$().get(0);
    newIndex = this.$().parent().find('ic-sortable-item').index(this.$());
    // console.debug('index',index);

    // console.log('originalParentNode',!!this.originalParentNode);

    // if(!!this.originalParentNode && this.originalParentNode !== draggedElement.parentNode) {
    //   this.get('parentView.model').removeObject(this.get('model'));
    //   draggedElement.remove();
    // } else {
    // }

    // var draggedElement = this.$().get(0);

    // var nodeList = document.querySelectorAll('[aria-dropeffect]')
    // for(var i = 0; i < nodeList.length; ++i) {
    //   nodeList[i].removeAttribute('aria-dropeffect');
    // }
    // event.preventDefault();
    // this.set('grabbed',false);
    // currentDraggable = undefined;
    // draggedElement.style.opacity = 1;

    // if(this.originalParentNode !== draggedElement.parentNode) {
    //   this.get('parentView.model').removeObject(this.get('model'));
    // }

    // this.destroy();
    // draggedElement.remove();





    // Ember.run(function() {
      // this.get('parentView.model').pushObject(currentDraggableModel);
      // console.log(this.get('parentView.model.length'));
    // }.bind(this));

    // determine index/order of dropped item
    // console.log(event.currentTarget.parentNode);

    // to do: don't create if it already exists in model
    // to do: insert at the right index

    // this.get('parentView.model.content'); //not sure why this is necessary
    // if(this.get('parentView.model').contains(currentDraggableModel)) {
    //   console.log('found it');
    //   console.log('---',this.$().get(0))
    //   // console.log('currentDraggableModel',currentDraggableModel);
    //   // console.log('parentView.model',this.get('parentView.model.content').get('firstObject'));
    // } else {
    //   console.log('did not find');
    // }

    // // console.log('parent',this.get('parentView.model.content'));

    // if(!this.get('parentView.model').contains(currentDraggableModel)) {
    //   console.log('did not already contain');
    //   this.get('parentView.model').pushObject(currentDraggableModel);  
    // } else {
    //   console.log('already contained');
    // }

    // currentDraggableModel = undefined;
    event.preventDefault();
    // return false;
  },

  dragEnter: function(event) {
    if(this.get('parentView.on-validate-drop')) {
      if(!this.get('parentView.on-validate-drop').call(this,event)) {
        return false;
      }
    } else {
      if(!event.dataTransfer.types.contains('text/' + this.get('type'))) {
        return false;
      }
    }

    // if(!event.dataTransfer.types.contains('text/uri-list')) {
    //   return false;
    // }

    // debugger
    if(typeof currentDraggable === 'undefined' 
        || currentDraggable.$().get(0) === this.$().get(0)) {
      // return false;
    } else {
      var draggedElement = currentDraggable.$().get(0);
      var thisElement = this.$().get(0);

      // if (thisElement != draggedElement.parentNode) {
      //   if(!this.get('parentView.connected-with')) {
      //     return false;
      //   }
      //   if(this.get('parentView.connected-with') !== currentDraggable.get('parentView.connected-with')) {
      //     return false;
      //   }
      // }

      if(isBelow(draggedElement, thisElement)) {
        thisElement.parentNode.insertBefore(draggedElement, thisElement);
      } else {
        thisElement.parentNode.insertBefore(draggedElement, thisElement.nextSibling);
      }
      draggedElement.style.opacity = 0.2; // setting visibility to none prevents proper drop event
    }

    event.preventDefault();
    return true;
  },

  dragEnd: function(event) {
    // alert('dragEnd')
    // console.log('dragEnd');
    currentDraggable = undefined;

    var nodeList = document.querySelectorAll('[aria-dropeffect]')
    for(var i = 0; i < nodeList.length; ++i) {
      nodeList[i].removeAttribute('aria-dropeffect');
    }
    this.set('grabbed',false);

    var draggedElement = this.$().get(0);
    draggedElement.style.opacity = 1;

    event.preventDefault();
    return false;
  }
});
