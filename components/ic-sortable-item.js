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

  dragLeave: function(event) {
    // event.stopPropagation();
    // event.preventDefault();
    // return true;
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
    newIndex = this.$().parent().find('> ic-sortable-item').index(this.$());
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
    // use validator handler if supplied
    if(this.get('parentView.on-validate-drop')) {
      if(this.get('parentView.on-validate-drop').call(this,event) === false) {
        return false;
      }
    }
    // otherwise, make sure it's the same data type
    else {
      if(!event.dataTransfer.types.contains('text/' + this.get('type'))) {
        return false;
      }
    }

    // debugger
    if(typeof currentDraggable === 'undefined') {
      // return false;
      // foreignObjectElement = undefined
      var placeholder = this.get('parentView.placeholder');

      if(typeof placeholder !== 'undefined') {
        var draggedElement = placeholder.$().get(0);
        var thisElement = this.$().get(0);
        if(isBelow(draggedElement, thisElement)) {
          thisElement.parentNode.insertBefore(draggedElement, thisElement);
        } else {
          thisElement.parentNode.insertBefore(draggedElement, thisElement.nextSibling);
        }
      }

      // if(typeof foreignObjectElement === 'undefined') {

      // }
    } else if(currentDraggable === this || currentDraggable.$().get(0) === this.$().get(0)) {
      // Do nothing?
    } else {
      var draggedElement = currentDraggable.$().get(0);
      var thisElement = this.$().get(0);

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
