// App.ApplicationView = Ember.View.extend({
//   didInsertElement: function() {
//     $('.sortable').sortable();
//   }
// });

// App.IcSortableItem = Ember.View.extend({
  
// });

var oldList = undefined;
var currentDraggable = undefined;
var currentDraggableModel = undefined;
var foreignObjectElement = undefined;
var newIndex = undefined;

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

function normalizeOrder(list) {
  order = 0;
  list.forEach(function(item) {
    Ember.set(item,'order',order);
    order++;
  });
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

App.IcSortableComponent = Ember.Component.extend(CustomElement,{
  // classNames: ['primary'],
  registerPlaceholder: function(placeholder) {
    this.set('placeholder', placeholder);
  },
  showPlaceholder: function() {
    var placeholder = this.get('placeholder');
    if(typeof placeholder === 'undefined') return;
    placeholder.$().get(0).style.display = '';
  },
  hidePlaceholder: function() {
    var placeholder = this.get('placeholder');
    if(typeof placeholder === 'undefined') return;
    placeholder.$().get(0).style.display = 'none';
  },
  resetPlaceholder: function() {
    var placeholder = this.get('placeholder');
    if(typeof placeholder === 'undefined') return;
    // insert into original location
    debugger
  },
  draggingDepth: 0,
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

  validate: function(event) {
    if(this.get('on-validate-drop')) {
      if(!this.get('on-validate-drop').call(this,event)) {
        return false;
      }
    } else {
      if(!event.dataTransfer.types.contains('text/' + this.get('type'))) {
        return false;
      }
    }
    return true;
  },

  dragEnter: function(event) {
    this.incrementProperty('draggingDepth');
    // console.debug('draggingDepth + 1 =',this.get('draggingDepth'));

    // if(!this.validate(event)) return false;
    if(typeof currentDraggable === 'undefined') {
      this.showPlaceholder();
    } else {
      if(!this.$('ic-sortable-item').length) {
        var draggedElement = currentDraggable.$().get(0);
        this.$().prepend(draggedElement);
      }
    }
  },

  dragLeave: function(event) {
    this.decrementProperty('draggingDepth');
    // console.debug('draggingDepth - 1 =',this.get('draggingDepth'));

    if (this.get('draggingDepth') === 0) {
      this.hidePlaceholder();
      // this.resetPlaceholder();
    }

    // if(event.target.parentNode !== event.currentTarget) {
    //   return;
    // }

    // console.log('dragLeave',event);

  },

  drop: function(event) {
    this.hidePlaceholder();
    if(!this.validate(event)) return false;

    var newList = this.get('model');
    var oldList;
    var draggedElement;
    var cameFromDifferentList;
    var otherObjectWithSameOrder;
    var draggable = currentDraggable; // for terseness
    currentDraggable = undefined;
    var draggableModel = currentDraggableModel; // for terseness
    currentDraggableModel = undefined;

    // draggable is "local" and is already represented and rendered
    if(typeof draggable !== 'undefined') {
      oldList = draggable.get('parentView.model');
      cameFromDifferentList = oldList !== newList;

      // if dropped in the same location it came from
      if(typeof newIndex === 'undefined' || typeof draggable.get('model.order') === 'undefined' || !cameFromDifferentList && draggable.get('model.order') === newIndex) {
        return false;
      }

      draggedElement = draggable.$().get(0);
      if(cameFromDifferentList) {
        oldList.removeObject(draggable.get('model'));
      }

      draggedElement.remove();
      otherObjectWithSameOrder = newList.findBy('order',newIndex);
      if(cameFromDifferentList) {
        if(typeof otherObjectWithSameOrder !== 'undefined') {
          Ember.set(otherObjectWithSameOrder,'order',newIndex + 0.5);
        }
      } else if(draggableModel.order < newIndex) {
        Ember.set(otherObjectWithSameOrder,'order',newIndex - 0.5);
      } else if(draggableModel.order >= newIndex) {
        Ember.set(otherObjectWithSameOrder,'order',newIndex + 0.5);
      }

      Ember.set(draggableModel,'order',newIndex);
      
      if(cameFromDifferentList) {
        newList.pushObject(draggableModel);
      }
    } else {
      if(typeof newIndex === 'undefined') {
        newIndex = this.$('> ic-sortable-item,> ic-sortable-placeholder').index(this.$('> ic-sortable-placeholder'));
      }
      otherObjectWithSameOrder = newList.findBy('order',newIndex);
      if(typeof otherObjectWithSameOrder !== 'undefined') {
        Ember.set(otherObjectWithSameOrder,'order',newIndex + 0.5);
      }
    }

    if(this.get('on-drop')) {
      if(this.get('on-drop').call(this,event,newIndex,currentDraggableModel,oldList,this.get('model')) === false) { //parentModel, model
        return false;
      }
    }

    // is this necessary?
    normalizeOrder(newList);
    if(cameFromDifferentList) {
      normalizeOrder(oldList);
    }

    newIndex = undefined;
    currentDraggableModel = undefined;
    foreignObjectElement = undefined
    event.preventDefault()
    return false; // don't bubble
  }
});
