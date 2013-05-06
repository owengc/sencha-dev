Ext.define('Region', {
    extend: 'Ext.data.Model',
    config: {
	fields: [
	    {name: 'id', type: 'int'},
	    {name: 'start', type: 'int'},
	    {name: 'end', type: 'int'}
	]
    }
});
