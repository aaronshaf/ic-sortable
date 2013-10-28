App.IcSortableEmptyComponent = Ember.Component.extend(CustomElement,{
  didInsertElement: function() {
    this.$().get(0).style.display = 'none';
  }
});