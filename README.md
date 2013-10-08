```handlebars
{{#ic-sortable connected-with="users"}}
  {{#each users}}
    {{#ic-sortable-item url=url aria-label=name}}
    	
    {{/ic-sortable-item}}
   {{/users}}
{{/ic-sortable}}
```