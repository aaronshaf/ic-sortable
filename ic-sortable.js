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
var currentlyDraggingObject = undefined;
var newIndex = undefined;

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
    // console.debug('sortable drop');
    // console.log('event.target',event.target);

    if(this.get('on-drop')) {
      if(!this.get('on-drop').call(this,event,[],this.get('model'),currentlyDraggingObject,newIndex)) { //parentModel, model
        return false;
      }
    }

    event.preventDefault()
    currentlyDraggingObject = undefined;
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
    currentlyDraggingInstance = this;
    currentlyDraggingObject = this.get('model')
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

    this.originalParentNode = this.$().get(0).parentNode;
    this.set('grabbed',true);
  },

  dragOver: function(event) {

    // console.debug('dragOver');

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
    /*
    If outside uri resource (no instance, no object), then...
    If 'local' object, then push it to array proxy
    If dropped onto itself(?)...
    */

    var draggedElement = this.$().get(0);
    newIndex = this.$().parent().find('ic-sortable-item').index(this.$());
    // console.debug('index',index);

    // console.log('originalParentNode',!!this.originalParentNode);

    this.get('parentView.model').removeObject(this.get('model'));
    draggedElement.remove();

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
    // currentlyDraggingInstance = undefined;
    // draggedElement.style.opacity = 1;

    // if(this.originalParentNode !== draggedElement.parentNode) {
    //   this.get('parentView.model').removeObject(this.get('model'));
    // }

    // this.destroy();
    // draggedElement.remove();





    // Ember.run(function() {
      // this.get('parentView.model').pushObject(currentlyDraggingObject);
      // console.log(this.get('parentView.model.length'));
    // }.bind(this));

    // determine index/order of dropped item
    // console.log(event.currentTarget.parentNode);

    // to do: don't create if it already exists in model
    // to do: insert at the right index

    // this.get('parentView.model.content'); //not sure why this is necessary
    // if(this.get('parentView.model').contains(currentlyDraggingObject)) {
    //   console.log('found it');
    //   console.log('---',this.$().get(0))
    //   // console.log('currentlyDraggingObject',currentlyDraggingObject);
    //   // console.log('parentView.model',this.get('parentView.model.content').get('firstObject'));
    // } else {
    //   console.log('did not find');
    // }

    // // console.log('parent',this.get('parentView.model.content'));

    // if(!this.get('parentView.model').contains(currentlyDraggingObject)) {
    //   console.log('did not already contain');
    //   this.get('parentView.model').pushObject(currentlyDraggingObject);  
    // } else {
    //   console.log('already contained');
    // }

    // currentlyDraggingObject = undefined;
    event.preventDefault();
    // return false;
  },

  dragEnter: function(event) {
    if(this.get('on-validate-drop')) {
      if(!this.get('on-validate-drop').call(this,event)) {
        return false;
      }
    }

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
      draggedElement.style.opacity = 0.2; // setting visibility to none prevents proper drop event
    }

    event.preventDefault();
    return false;
  },

  dragEnd: function(event) {
    // console.log('dragEnd');
    currentlyDraggingInstance = undefined;

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
