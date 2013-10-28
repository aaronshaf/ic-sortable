App.IcSortablePlaceholderComponent = Ember.Component.extend(CustomElement,{
  registerWithParent: function() {
    this.get('parentView').registerPlaceholder(this);
  }.on('didInsertElement'),
  didInsertElement: function() {
    this.$().get(0).style.display = 'none';
  }
});
