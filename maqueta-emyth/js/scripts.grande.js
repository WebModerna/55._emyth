/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );

// Placeholder
/*<![CDATA[ */$(function(){var input = document.createElement("input") && document.createElement("textarea");if(('placeholder' in input)==false){$('[placeholder]').focus(function(){var i = $(this);if(i.val() == i.attr('placeholder')){i.val('').removeClass('placeholder');if(i.hasClass('password')){i.removeClass('password');this.type='password';}}}).blur(function(){var i = $(this);if(i.val() == '' || i.val() == i.attr('placeholder')){if(this.type=='password'){i.addClass('password');this.type='text';this.type='tel';this.type='email';}i.addClass('placeholder').val(i.attr('placeholder'));}}).blur().parents('form').submit(function(){$(this).find('[placeholder]').each(function(){var i = $(this);if(i.val() == i.attr('placeholder'))i.val('');})});}});/* ]]> */

/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
/*global ActiveXObject */

// AMD support
(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // using AMD; register as anon module
        define(['jquery'], factory);
    } else {
        // no AMD; invoke directly
        factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );
    }
}

(function($) {
"use strict";

/*
    Usage Note:
    -----------
    Do not use both ajaxSubmit and ajaxForm on the same form.  These
    functions are mutually exclusive.  Use ajaxSubmit if you want
    to bind your own submit handler to the form.  For example,

    $(document).ready(function() {
        $('#myForm').on('submit', function(e) {
            e.preventDefault(); // <-- important
            $(this).ajaxSubmit({
                target: '#output'
            });
        });
    });

    Use ajaxForm when you want the plugin to manage all the event binding
    for you.  For example,

    $(document).ready(function() {
        $('#myForm').ajaxForm({
            target: '#output'
        });
    });

    You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
    form does not have to exist when you invoke ajaxForm:

    $('#myForm').ajaxForm({
        delegation: true,
        target: '#output'
    });

    When using ajaxForm, the ajaxSubmit function will be invoked for you
    at the appropriate time.
*/

/**
 * Feature detection
 */
var feature = {};
feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
feature.formdata = window.FormData !== undefined;

var hasProp = !!$.fn.prop;

// attr2 uses prop when it can but checks the return type for
// an expected string.  this accounts for the case where a form 
// contains inputs with names like "action" or "method"; in those
// cases "prop" returns the element
$.fn.attr2 = function() {
    if ( ! hasProp ) {
        return this.attr.apply(this, arguments);
    }
    var val = this.prop.apply(this, arguments);
    if ( ( val && val.jquery ) || typeof val === 'string' ) {
        return val;
    }
    return this.attr.apply(this, arguments);
};

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
    /*jshint scripturl:true */

    // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
    if (!this.length) {
        log('ajaxSubmit: skipping submit process - no element selected');
        return this;
    }

    var method, action, url, $form = this;

    if (typeof options == 'function') {
        options = { success: options };
    }
    else if ( options === undefined ) {
        options = {};
    }

    method = options.type || this.attr2('method');
    action = options.url  || this.attr2('action');

    url = (typeof action === 'string') ? $.trim(action) : '';
    url = url || window.location.href || '';
    if (url) {
        // clean url (don't include hash vaue)
        url = (url.match(/^([^#]+)/)||[])[1];
    }

    options = $.extend(true, {
        url:  url,
        success: $.ajaxSettings.success,
        type: method || $.ajaxSettings.type,
        iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
    }, options);

    // hook for manipulating the form data before it is extracted;
    // convenient for use with rich editors like tinyMCE or FCKEditor
    var veto = {};
    this.trigger('form-pre-serialize', [this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
        return this;
    }

    // provide opportunity to alter form data before it is serialized
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSerialize callback');
        return this;
    }

    var traditional = options.traditional;
    if ( traditional === undefined ) {
        traditional = $.ajaxSettings.traditional;
    }

    var elements = [];
    var qx, a = this.formToArray(options.semantic, elements);
    if (options.data) {
        options.extraData = options.data;
        qx = $.param(options.data, traditional);
    }

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSubmit callback');
        return this;
    }

    // fire vetoable 'validate' event
    this.trigger('form-submit-validate', [a, this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
        return this;
    }

    var q = $.param(a, traditional);
    if (qx) {
        q = ( q ? (q + '&' + qx) : qx );
    }
    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else {
        options.data = q; // data is the query string for 'post'
    }

    var callbacks = [];
    if (options.resetForm) {
        callbacks.push(function() { $form.resetForm(); });
    }
    if (options.clearForm) {
        callbacks.push(function() { $form.clearForm(options.includeHidden); });
    }

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data) {
            var fn = options.replaceTarget ? 'replaceWith' : 'html';
            $(options.target)[fn](data).each(oldSuccess, arguments);
        });
    }
    else if (options.success) {
        callbacks.push(options.success);
    }

    options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
        var context = options.context || this ;    // jQuery 1.4+ supports scope context
        for (var i=0, max=callbacks.length; i < max; i++) {
            callbacks[i].apply(context, [data, status, xhr || $form, $form]);
        }
    };

    if (options.error) {
        var oldError = options.error;
        options.error = function(xhr, status, error) {
            var context = options.context || this;
            oldError.apply(context, [xhr, status, error, $form]);
        };
    }

     if (options.complete) {
        var oldComplete = options.complete;
        options.complete = function(xhr, status) {
            var context = options.context || this;
            oldComplete.apply(context, [xhr, status, $form]);
        };
    }

    // are there files to upload?

    // [value] (issue #113), also see comment:
    // https://github.com/malsup/form/commit/588306aedba1de01388032d5f42a60159eea9228#commitcomment-2180219
    var fileInputs = $('input[type=file]:enabled', this).filter(function() { return $(this).val() !== ''; });

    var hasFileInputs = fileInputs.length > 0;
    var mp = 'multipart/form-data';
    var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

    var fileAPI = feature.fileapi && feature.formdata;
    log("fileAPI :" + fileAPI);
    var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;

    var jqxhr;

    // options.iframe allows user to force iframe mode
    // 06-NOV-09: now defaulting to iframe mode if file input is detected
    if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
        // hack to fix Safari hang (thanks to Tim Molendijk for this)
        // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
        if (options.closeKeepAlive) {
            $.get(options.closeKeepAlive, function() {
                jqxhr = fileUploadIframe(a);
            });
        }
        else {
            jqxhr = fileUploadIframe(a);
        }
    }
    else if ((hasFileInputs || multipart) && fileAPI) {
        jqxhr = fileUploadXhr(a);
    }
    else {
        jqxhr = $.ajax(options);
    }

    $form.removeData('jqxhr').data('jqxhr', jqxhr);

    // clear element array
    for (var k=0; k < elements.length; k++) {
        elements[k] = null;
    }

    // fire 'notify' event
    this.trigger('form-submit-notify', [this, options]);
    return this;

    // utility fn for deep serialization
    function deepSerialize(extraData){
        var serialized = $.param(extraData, options.traditional).split('&');
        var len = serialized.length;
        var result = [];
        var i, part;
        for (i=0; i < len; i++) {
            // #252; undo param space replacement
            serialized[i] = serialized[i].replace(/\+/g,' ');
            part = serialized[i].split('=');
            // #278; use array instead of object storage, favoring array serializations
            result.push([decodeURIComponent(part[0]), decodeURIComponent(part[1])]);
        }
        return result;
    }

     // XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
    function fileUploadXhr(a) {
        var formdata = new FormData();

        for (var i=0; i < a.length; i++) {
            formdata.append(a[i].name, a[i].value);
        }

        if (options.extraData) {
            var serializedData = deepSerialize(options.extraData);
            for (i=0; i < serializedData.length; i++) {
                if (serializedData[i]) {
                    formdata.append(serializedData[i][0], serializedData[i][1]);
                }
            }
        }

        options.data = null;

        var s = $.extend(true, {}, $.ajaxSettings, options, {
            contentType: false,
            processData: false,
            cache: false,
            type: method || 'POST'
        });

        if (options.uploadProgress) {
            // workaround because jqXHR does not expose upload property
            s.xhr = function() {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position; /*event.position is deprecated*/
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        options.uploadProgress(event, position, total, percent);
                    }, false);
                }
                return xhr;
            };
        }

        s.data = null;
        var beforeSend = s.beforeSend;
        s.beforeSend = function(xhr, o) {
            //Send FormData() provided by user
            if (options.formData) {
                o.data = options.formData;
            }
            else {
                o.data = formdata;
            }
            if(beforeSend) {
                beforeSend.call(this, xhr, o);
            }
        };
        return $.ajax(s);
    }

    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUploadIframe(a) {
        var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
        var deferred = $.Deferred();

        // #341
        deferred.abort = function(status) {
            xhr.abort(status);
        };

        if (a) {
            // ensure that every serialized input is still enabled
            for (i=0; i < elements.length; i++) {
                el = $(elements[i]);
                if ( hasProp ) {
                    el.prop('disabled', false);
                }
                else {
                    el.removeAttr('disabled');
                }
            }
        }

        s = $.extend(true, {}, $.ajaxSettings, options);
        s.context = s.context || s;
        id = 'jqFormIO' + (new Date().getTime());
        if (s.iframeTarget) {
            $io = $(s.iframeTarget);
            n = $io.attr2('name');
            if (!n) {
                $io.attr2('name', id);
            }
            else {
                id = n;
            }
        }
        else {
            $io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
            $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
        }
        io = $io[0];


        xhr = { // mock object
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {},
            abort: function(status) {
                var e = (status === 'timeout' ? 'timeout' : 'aborted');
                log('aborting upload... ' + e);
                this.aborted = 1;

                try { // #214, #257
                    if (io.contentWindow.document.execCommand) {
                        io.contentWindow.document.execCommand('Stop');
                    }
                }
                catch(ignore) {}

                $io.attr('src', s.iframeSrc); // abort op in progress
                xhr.error = e;
                if (s.error) {
                    s.error.call(s.context, xhr, e, status);
                }
                if (g) {
                    $.event.trigger("ajaxError", [xhr, s, e]);
                }
                if (s.complete) {
                    s.complete.call(s.context, xhr, e);
                }
            }
        };

        g = s.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (g && 0 === $.active++) {
            $.event.trigger("ajaxStart");
        }
        if (g) {
            $.event.trigger("ajaxSend", [xhr, s]);
        }

        if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
            if (s.global) {
                $.active--;
            }
            deferred.reject();
            return deferred;
        }
        if (xhr.aborted) {
            deferred.reject();
            return deferred;
        }

        // add submitting element to data if we know it
        sub = form.clk;
        if (sub) {
            n = sub.name;
            if (n && !sub.disabled) {
                s.extraData = s.extraData || {};
                s.extraData[n] = sub.value;
                if (sub.type == "image") {
                    s.extraData[n+'.x'] = form.clk_x;
                    s.extraData[n+'.y'] = form.clk_y;
                }
            }
        }

        var CLIENT_TIMEOUT_ABORT = 1;
        var SERVER_ABORT = 2;
                
        function getDoc(frame) {
            /* it looks like contentWindow or contentDocument do not
             * carry the protocol property in ie8, when running under ssl
             * frame.document is the only valid response document, since
             * the protocol is know but not on the other two objects. strange?
             * "Same origin policy" http://en.wikipedia.org/wiki/Same_origin_policy
             */
            
            var doc = null;
            
            // IE8 cascading access check
            try {
                if (frame.contentWindow) {
                    doc = frame.contentWindow.document;
                }
            } catch(err) {
                // IE8 access denied under ssl & missing protocol
                log('cannot get iframe.contentWindow document: ' + err);
            }

            if (doc) { // successful getting content
                return doc;
            }

            try { // simply checking may throw in ie8 under ssl or mismatched protocol
                doc = frame.contentDocument ? frame.contentDocument : frame.document;
            } catch(err) {
                // last attempt
                log('cannot get iframe.contentDocument: ' + err);
                doc = frame.document;
            }
            return doc;
        }

        // Rails CSRF hack (thanks to Yvan Barthelemy)
        var csrf_token = $('meta[name=csrf-token]').attr('content');
        var csrf_param = $('meta[name=csrf-param]').attr('content');
        if (csrf_param && csrf_token) {
            s.extraData = s.extraData || {};
            s.extraData[csrf_param] = csrf_token;
        }

        // take a breath so that pending repaints get some cpu time before the upload starts
        function doSubmit() {
            // make sure form attrs are set
            var t = $form.attr2('target'), 
                a = $form.attr2('action'), 
                mp = 'multipart/form-data',
                et = $form.attr('enctype') || $form.attr('encoding') || mp;

            // update form attrs in IE friendly way
            form.setAttribute('target',id);
            if (!method || /post/i.test(method) ) {
                form.setAttribute('method', 'POST');
            }
            if (a != s.url) {
                form.setAttribute('action', s.url);
            }

            // ie borks in some cases when setting encoding
            if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            // support timout
            if (s.timeout) {
                timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
            }

            // look for server aborts
            function checkState() {
                try {
                    var state = getDoc(io).readyState;
                    log('state = ' + state);
                    if (state && state.toLowerCase() == 'uninitialized') {
                        setTimeout(checkState,50);
                    }
                }
                catch(e) {
                    log('Server abort: ' , e, ' (', e.name, ')');
                    cb(SERVER_ABORT);
                    if (timeoutHandle) {
                        clearTimeout(timeoutHandle);
                    }
                    timeoutHandle = undefined;
                }
            }

            // add "extra" data to form if provided in options
            var extraInputs = [];
            try {
                if (s.extraData) {
                    for (var n in s.extraData) {
                        if (s.extraData.hasOwnProperty(n)) {
                           // if using the $.param format that allows for multiple values with the same name
                           if($.isPlainObject(s.extraData[n]) && s.extraData[n].hasOwnProperty('name') && s.extraData[n].hasOwnProperty('value')) {
                               extraInputs.push(
                               $('<input type="hidden" name="'+s.extraData[n].name+'">').val(s.extraData[n].value)
                                   .appendTo(form)[0]);
                           } else {
                               extraInputs.push(
                               $('<input type="hidden" name="'+n+'">').val(s.extraData[n])
                                   .appendTo(form)[0]);
                           }
                        }
                    }
                }

                if (!s.iframeTarget) {
                    // add iframe to doc and submit the form
                    $io.appendTo('body');
                }
                if (io.attachEvent) {
                    io.attachEvent('onload', cb);
                }
                else {
                    io.addEventListener('load', cb, false);
                }
                setTimeout(checkState,15);

                try {
                    form.submit();
                } catch(err) {
                    // just in case form has element with name/id of 'submit'
                    var submitFn = document.createElement('form').submit;
                    submitFn.apply(form);
                }
            }
            finally {
                // reset attrs and remove "extra" input elements
                form.setAttribute('action',a);
                form.setAttribute('enctype', et); // #380
                if(t) {
                    form.setAttribute('target', t);
                } else {
                    $form.removeAttr('target');
                }
                $(extraInputs).remove();
            }
        }

        if (s.forceSync) {
            doSubmit();
        }
        else {
            setTimeout(doSubmit, 10); // this lets dom updates render
        }

        var data, doc, domCheckCount = 50, callbackProcessed;

        function cb(e) {
            if (xhr.aborted || callbackProcessed) {
                return;
            }
            
            doc = getDoc(io);
            if(!doc) {
                log('cannot access response document');
                e = SERVER_ABORT;
            }
            if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                xhr.abort('timeout');
                deferred.reject(xhr, 'timeout');
                return;
            }
            else if (e == SERVER_ABORT && xhr) {
                xhr.abort('server abort');
                deferred.reject(xhr, 'error', 'server abort');
                return;
            }

            if (!doc || doc.location.href == s.iframeSrc) {
                // response not received yet
                if (!timedOut) {
                    return;
                }
            }
            if (io.detachEvent) {
                io.detachEvent('onload', cb);
            }
            else {
                io.removeEventListener('load', cb, false);
            }

            var status = 'success', errMsg;
            try {
                if (timedOut) {
                    throw 'timeout';
                }

                var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                log('isXml='+isXml);
                if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
                    if (--domCheckCount) {
                        // in some browsers (Opera) the iframe DOM is not always traversable when
                        // the onload callback fires, so we loop a bit to accommodate
                        log('requeing onLoad callback, DOM not available');
                        setTimeout(cb, 250);
                        return;
                    }
                    // let this fall through because server response could be an empty document
                    //log('Could not access iframe DOM after mutiple tries.');
                    //throw 'DOMException: not available';
                }

                //log('response detected');
                var docRoot = doc.body ? doc.body : doc.documentElement;
                xhr.responseText = docRoot ? docRoot.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                if (isXml) {
                    s.dataType = 'xml';
                }
                xhr.getResponseHeader = function(header){
                    var headers = {'content-type': s.dataType};
                    return headers[header.toLowerCase()];
                };
                // support for XHR 'status' & 'statusText' emulation :
                if (docRoot) {
                    xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
                    xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
                }

                var dt = (s.dataType || '').toLowerCase();
                var scr = /(json|script|text)/.test(dt);
                if (scr || s.textarea) {
                    // see if user embedded response in textarea
                    var ta = doc.getElementsByTagName('textarea')[0];
                    if (ta) {
                        xhr.responseText = ta.value;
                        // support for XHR 'status' & 'statusText' emulation :
                        xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
                        xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                    }
                    else if (scr) {
                        // account for browsers injecting pre around json response
                        var pre = doc.getElementsByTagName('pre')[0];
                        var b = doc.getElementsByTagName('body')[0];
                        if (pre) {
                            xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                        }
                        else if (b) {
                            xhr.responseText = b.textContent ? b.textContent : b.innerText;
                        }
                    }
                }
                else if (dt == 'xml' && !xhr.responseXML && xhr.responseText) {
                    xhr.responseXML = toXml(xhr.responseText);
                }

                try {
                    data = httpData(xhr, dt, s);
                }
                catch (err) {
                    status = 'parsererror';
                    xhr.error = errMsg = (err || status);
                }
            }
            catch (err) {
                log('error caught: ',err);
                status = 'error';
                xhr.error = errMsg = (err || status);
            }

            if (xhr.aborted) {
                log('upload aborted');
                status = null;
            }

            if (xhr.status) { // we've set xhr.status
                status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (status === 'success') {
                if (s.success) {
                    s.success.call(s.context, data, 'success', xhr);
                }
                deferred.resolve(xhr.responseText, 'success', xhr);
                if (g) {
                    $.event.trigger("ajaxSuccess", [xhr, s]);
                }
            }
            else if (status) {
                if (errMsg === undefined) {
                    errMsg = xhr.statusText;
                }
                if (s.error) {
                    s.error.call(s.context, xhr, status, errMsg);
                }
                deferred.reject(xhr, 'error', errMsg);
                if (g) {
                    $.event.trigger("ajaxError", [xhr, s, errMsg]);
                }
            }

            if (g) {
                $.event.trigger("ajaxComplete", [xhr, s]);
            }

            if (g && ! --$.active) {
                $.event.trigger("ajaxStop");
            }

            if (s.complete) {
                s.complete.call(s.context, xhr, status);
            }

            callbackProcessed = true;
            if (s.timeout) {
                clearTimeout(timeoutHandle);
            }

            // clean up
            setTimeout(function() {
                if (!s.iframeTarget) {
                    $io.remove();
                }
                else { //adding else to clean up existing iframe response.
                    $io.attr('src', s.iframeSrc);
                }
                xhr.responseXML = null;
            }, 100);
        }

        var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else {
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            }
            return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
        };
        var parseJSON = $.parseJSON || function(s) {
            /*jslint evil:true */
            return window['eval']('(' + s + ')');
        };

        var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

            var ct = xhr.getResponseHeader('content-type') || '',
                xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === 'parsererror') {
                if ($.error) {
                    $.error('parsererror');
                }
            }
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }
            if (typeof data === 'string') {
                if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                    data = parseJSON(data);
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    $.globalEval(data);
                }
            }
            return data;
        };

        return deferred;
    }
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *    is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *    used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
    options = options || {};
    options.delegation = options.delegation && $.isFunction($.fn.on);

    // in jQuery 1.3+ we can fix mistakes with the ready state
    if (!options.delegation && this.length === 0) {
        var o = { s: this.selector, c: this.context };
        if (!$.isReady && o.s) {
            log('DOM not ready, queuing ajaxForm');
            $(function() {
                $(o.s,o.c).ajaxForm(options);
            });
            return this;
        }
        // is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
        log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
        return this;
    }

    if ( options.delegation ) {
        $(document)
            .off('submit.form-plugin', this.selector, doAjaxSubmit)
            .off('click.form-plugin', this.selector, captureSubmittingElement)
            .on('submit.form-plugin', this.selector, options, doAjaxSubmit)
            .on('click.form-plugin', this.selector, options, captureSubmittingElement);
        return this;
    }

    return this.ajaxFormUnbind()
        .bind('submit.form-plugin', options, doAjaxSubmit)
        .bind('click.form-plugin', options, captureSubmittingElement);
};

// private event handlers
function doAjaxSubmit(e) {
    /*jshint validthis:true */
    var options = e.data;
    if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
        e.preventDefault();
        $(e.target).ajaxSubmit(options); // #365
    }
}

function captureSubmittingElement(e) {
    /*jshint validthis:true */
    var target = e.target;
    var $el = $(target);
    if (!($el.is("[type=submit],[type=image]"))) {
        // is this a child element of the submit el?  (ex: a span within a button)
        var t = $el.closest('[type=submit]');
        if (t.length === 0) {
            return;
        }
        target = t[0];
    }
    var form = this;
    form.clk = target;
    if (target.type == 'image') {
        if (e.offsetX !== undefined) {
            form.clk_x = e.offsetX;
            form.clk_y = e.offsetY;
        } else if (typeof $.fn.offset == 'function') {
            var offset = $el.offset();
            form.clk_x = e.pageX - offset.left;
            form.clk_y = e.pageY - offset.top;
        } else {
            form.clk_x = e.pageX - target.offsetLeft;
            form.clk_y = e.pageY - target.offsetTop;
        }
    }
    // clear form vars
    setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
}


// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
    return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic, elements) {
    var a = [];
    if (this.length === 0) {
        return a;
    }

    var form = this[0];
    var formId = this.attr('id');
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    var els2;

    if (els && !/MSIE [678]/.test(navigator.userAgent)) { // #390
        els = $(els).get();  // convert to standard array
    }

    // #386; account for inputs outside the form which use the 'form' attribute
    if ( formId ) {
        els2 = $(':input[form="' + formId + '"]').get(); // hat tip @thet
        if ( els2.length ) {
            els = (els || []).concat(els2);
        }
    }

    if (!els || !els.length) {
        return a;
    }

    var i,j,n,v,el,max,jmax;
    for(i=0, max=els.length; i < max; i++) {
        el = els[i];
        n = el.name;
        if (!n || el.disabled) {
            continue;
        }

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(form.clk == el) {
                a.push({name: n, value: $(el).val(), type: el.type });
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            }
            continue;
        }

        v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            if (elements) {
                elements.push(el);
            }
            for(j=0, jmax=v.length; j < jmax; j++) {
                a.push({name: n, value: v[j]});
            }
        }
        else if (feature.fileapi && el.type == 'file') {
            if (elements) {
                elements.push(el);
            }
            var files = el.files;
            if (files.length) {
                for (j=0; j < files.length; j++) {
                    a.push({name: n, value: files[j], type: el.type});
                }
            }
            else {
                // #180
                a.push({ name: n, value: '', type: el.type });
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            if (elements) {
                elements.push(el);
            }
            a.push({name: n, value: v, type: el.type, required: el.required});
        }
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle it here
        var $input = $(form.clk), input = $input[0];
        n = input.name;
        if (n && !input.disabled && input.type == 'image') {
            a.push({name: n, value: $input.val()});
            a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) {
            return;
        }
        var v = $.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++) {
                a.push({name: n, value: v[i]});
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            a.push({name: this.name, value: v});
        }
    });
    //hand off to jQuery.param for proper encoding
    return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *      <input name="A" type="text" />
 *      <input name="A" type="text" />
 *      <input name="B" type="checkbox" value="B1" />
 *      <input name="B" type="checkbox" value="B2"/>
 *      <input name="C" type="radio" value="C1" />
 *      <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $('input[type=text]').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $('input[type=checkbox]').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $('input[type=radio]').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *    array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = $.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
            continue;
        }
        if (v.constructor == Array) {
            $.merge(val, v);
        }
        else {
            val.push(v);
        }
    }
    return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (successful === undefined) {
        successful = true;
    }

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1)) {
            return null;
    }

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) {
            return null;
        }
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
                var v = op.value;
                if (!v) { // extra pain for IE...
                    v = (op.attributes && op.attributes.value && !(op.attributes.value.specified)) ? op.text : op.value;
                }
                if (one) {
                    return v;
                }
                a.push(v);
            }
        }
        return a;
    }
    return $(el).val();
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function(includeHidden) {
    return this.each(function() {
        $('input,select,textarea', this).clearFields(includeHidden);
    });
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
    var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (re.test(t) || tag == 'textarea') {
            this.value = '';
        }
        else if (t == 'checkbox' || t == 'radio') {
            this.checked = false;
        }
        else if (tag == 'select') {
            this.selectedIndex = -1;
        }
        else if (t == "file") {
            if (/MSIE/.test(navigator.userAgent)) {
                $(this).replaceWith($(this).clone(true));
            } else {
                $(this).val('');
            }
        }
        else if (includeHidden) {
            // includeHidden can be the value true, or it can be a selector string
            // indicating a special test; for example:
            //  $('#myForm').clearForm('.special:hidden')
            // the above would clean hidden inputs that have the class of 'special'
            if ( (includeHidden === true && /hidden/.test(t)) ||
                 (typeof includeHidden == 'string' && $(this).is(includeHidden)) ) {
                this.value = '';
            }
        }
    });
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
            this.reset();
        }
    });
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
    if (b === undefined) {
        b = true;
    }
    return this.each(function() {
        this.disabled = !b;
    });
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
    if (select === undefined) {
        select = true;
    }
    return this.each(function() {
        var t = this.type;
        if (t == 'checkbox' || t == 'radio') {
            this.checked = select;
        }
        else if (this.tagName.toLowerCase() == 'option') {
            var $sel = $(this).parent('select');
            if (select && $sel[0] && $sel[0].type == 'select-one') {
                // deselect all other options
                $sel.find('option').selected(false);
            }
            this.selected = select;
        }
    });
};

// expose debug var
$.fn.ajaxSubmit.debug = false;

// helper fn for console logging
function log() {
    if (!$.fn.ajaxSubmit.debug) {
        return;
    }
    var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
    if (window.console && window.console.log) {
        window.console.log(msg);
    }
    else if (window.opera && window.opera.postError) {
        window.opera.postError(msg);
    }
}

}));


// Script del formulario
(function($) {

	if (typeof _wpcf7 == 'undefined' || _wpcf7 === null)
		_wpcf7 = {};

	_wpcf7 = $.extend({ cached: 0 }, _wpcf7);

	$(function() {
		_wpcf7.supportHtml5 = $.wpcf7SupportHtml5();
		$('div.wpcf7 > form').wpcf7InitForm();
	});

	$.fn.wpcf7InitForm = function() {
		this.ajaxForm({
			beforeSubmit: function(arr, $form, options) {
				$form.wpcf7ClearResponseOutput();
				$form.find('[aria-invalid]').attr('aria-invalid', 'false');
				$form.find('img.ajax-loader').css({ visibility: 'visible' });
				return true;
			},
			beforeSerialize: function($form, options) {
				$form.find('[placeholder].placeheld').each(function(i, n) {
					$(n).val('');
				});
				return true;
			},
			data: { '_wpcf7_is_ajax_call': 1 },
			dataType: 'json',
			success: $.wpcf7AjaxSuccess,
			error: function(xhr, status, error, $form) {
				var e = $('<div class="ajax-error"></div>').text(error.message);
				$form.after(e);
			}
		});

		if (_wpcf7.cached)
			this.wpcf7OnloadRefill();

		this.wpcf7ToggleSubmit();

		this.find('.wpcf7-submit').wpcf7AjaxLoader();

		this.find('.wpcf7-acceptance').click(function() {
			$(this).closest('form').wpcf7ToggleSubmit();
		});

		this.find('.wpcf7-exclusive-checkbox').wpcf7ExclusiveCheckbox();

		this.find('.wpcf7-list-item.has-free-text').wpcf7ToggleCheckboxFreetext();

		this.find('[placeholder]').wpcf7Placeholder();

		if (_wpcf7.jqueryUi && ! _wpcf7.supportHtml5.date) {
			this.find('input.wpcf7-date[type="date"]').each(function() {
				$(this).datepicker({
					dateFormat: 'yy-mm-dd',
					minDate: new Date($(this).attr('min')),
					maxDate: new Date($(this).attr('max'))
				});
			});
		}

		if (_wpcf7.jqueryUi && ! _wpcf7.supportHtml5.number) {
			this.find('input.wpcf7-number[type="number"]').each(function() {
				$(this).spinner({
					min: $(this).attr('min'),
					max: $(this).attr('max'),
					step: $(this).attr('step')
				});
			});
		}
	};

	$.wpcf7AjaxSuccess = function(data, status, xhr, $form) {
		if (! $.isPlainObject(data) || $.isEmptyObject(data))
			return;

		var $responseOutput = $form.find('div.wpcf7-response-output');

		$form.wpcf7ClearResponseOutput();

		$form.find('.wpcf7-form-control').removeClass('wpcf7-not-valid');
		$form.removeClass('invalid spam sent failed');

		if (data.captcha)
			$form.wpcf7RefillCaptcha(data.captcha);

		if (data.quiz)
			$form.wpcf7RefillQuiz(data.quiz);

		if (data.invalids) {
			$.each(data.invalids, function(i, n) {
				$form.find(n.into).wpcf7NotValidTip(n.message);
				$form.find(n.into).find('.wpcf7-form-control').addClass('wpcf7-not-valid');
				$form.find(n.into).find('[aria-invalid]').attr('aria-invalid', 'true');
			});

			$responseOutput.addClass('wpcf7-validation-errors');
			$form.addClass('invalid');

			$(data.into).trigger('invalid.wpcf7');

		} else if (1 == data.spam) {
			$responseOutput.addClass('wpcf7-spam-blocked');
			$form.addClass('spam');

			$(data.into).trigger('spam.wpcf7');

		} else if (1 == data.mailSent) {
			$responseOutput.addClass('wpcf7-mail-sent-ok');
			$form.addClass('sent');

			if (data.onSentOk)
				$.each(data.onSentOk, function(i, n) { eval(n) });

			$(data.into).trigger('mailsent.wpcf7');

		} else {
			$responseOutput.addClass('wpcf7-mail-sent-ng');
			$form.addClass('failed');

			$(data.into).trigger('mailfailed.wpcf7');
		}

		if (data.onSubmit)
			$.each(data.onSubmit, function(i, n) { eval(n) });

		$(data.into).trigger('submit.wpcf7');

		if (1 == data.mailSent)
			$form.resetForm().clearForm();

		$form.find('[placeholder].placeheld').each(function(i, n) {
			$(n).val($(n).attr('placeholder'));
		});

		$responseOutput.append(data.message).slideDown('fast');
		$responseOutput.attr('role', 'alert');
	}

	$.fn.wpcf7ExclusiveCheckbox = function() {
		return this.find('input:checkbox').click(function() {
			$(this).closest('.wpcf7-checkbox').find('input:checkbox').not(this).removeAttr('checked');
		});
	};

	$.fn.wpcf7Placeholder = function() {
		if (_wpcf7.supportHtml5.placeholder)
			return this;

		return this.each(function() {
			$(this).val($(this).attr('placeholder'));
			$(this).addClass('placeheld');

			$(this).focus(function() {
				if ($(this).hasClass('placeheld'))
					$(this).val('').removeClass('placeheld');
			});

			$(this).blur(function() {
				if ('' == $(this).val()) {
					$(this).val($(this).attr('placeholder'));
					$(this).addClass('placeheld');
				}
			});
		});
	};

	$.fn.wpcf7AjaxLoader = function() {
		return this.each(function() {
			var loader = $('<img style="background:#eee;border-radius:50%;-o-border-radius:50%;-ms-border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50;" class="ajax-loader" src="data:image/gif;base64,R0lGODlhEAAQAPQAAP///3d3d/r6+pSUlL29vXp6eouLi+jo6NDQ0IKCgrW1ta2trfDw8MfHx+Dg4J2dnaSkpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==" />')
				.attr({ src: _wpcf7.loaderUrl, alt: _wpcf7.sending })
				.css('visibility', 'hidden');

			$(this).after(loader);
		});
	};

	$.fn.wpcf7ToggleSubmit = function() {
		return this.each(function() {
			var form = $(this);
			if (this.tagName.toLowerCase() != 'form')
				form = $(this).find('form').first();

			if (form.hasClass('wpcf7-acceptance-as-validation'))
				return;

			var submit = form.find('input:submit');
			if (! submit.length) return;

			var acceptances = form.find('input:checkbox.wpcf7-acceptance');
			if (! acceptances.length) return;

			submit.removeAttr('disabled');
			acceptances.each(function(i, n) {
				n = $(n);
				if (n.hasClass('wpcf7-invert') && n.is(':checked')
				|| ! n.hasClass('wpcf7-invert') && ! n.is(':checked'))
					submit.attr('disabled', 'disabled');
			});
		});
	};

	$.fn.wpcf7ToggleCheckboxFreetext = function() {
		return this.each(function() {
			var $wrap = $(this).closest('.wpcf7-form-control');

			if ($(this).find(':checkbox, :radio').is(':checked')) {
				$(this).find(':input.wpcf7-free-text').prop('disabled', false);
			} else {
				$(this).find(':input.wpcf7-free-text').prop('disabled', true);
			}

			$wrap.find(':checkbox, :radio').change(function() {
				var $cb = $('.has-free-text', $wrap).find(':checkbox, :radio');
				var $freetext = $(':input.wpcf7-free-text', $wrap);

				if ($cb.is(':checked')) {
					$freetext.prop('disabled', false).focus();
				} else {
					$freetext.prop('disabled', true);
				}
			});
		});
	};

	$.fn.wpcf7NotValidTip = function(message) {
		return this.each(function() {
			var $into = $(this);
			$into.hide().append('<span role="alert" class="wpcf7-not-valid-tip">' + message + '</span>').slideDown('fast');

			if ($into.is('.use-floating-validation-tip *')) {
				$('.wpcf7-not-valid-tip', $into).mouseover(function() {
					$(this).wpcf7FadeOut();
				});

				$(':input', $into).focus(function() {
					$('.wpcf7-not-valid-tip', $into).not(':hidden').wpcf7FadeOut();
				});
			}
		});
	};

	$.fn.wpcf7FadeOut = function() {
		return this.each(function() {
			$(this).animate({
				opacity: 0
			}, 'fast', function() {
				$(this).css({'z-index': -100});
			});
		});
	};

	$.fn.wpcf7OnloadRefill = function() {
		return this.each(function() {
			var url = $(this).attr('action');
			if (0 < url.indexOf('#'))
				url = url.substr(0, url.indexOf('#'));

			var id = $(this).find('input[name="_wpcf7"]').val();
			var unitTag = $(this).find('input[name="_wpcf7_unit_tag"]').val();

			$.getJSON(url,
				{ _wpcf7_is_ajax_call: 1, _wpcf7: id, _wpcf7_request_ver: $.now() },
				function(data) {
					if (data && data.captcha)
						$('#' + unitTag).wpcf7RefillCaptcha(data.captcha);

					if (data && data.quiz)
						$('#' + unitTag).wpcf7RefillQuiz(data.quiz);
				}
			);
		});
	};

	$.fn.wpcf7RefillCaptcha = function(captcha) {
		return this.each(function() {
			var form = $(this);

			$.each(captcha, function(i, n) {
				form.find(':input[name="' + i + '"]').clearFields();
				form.find('img.wpcf7-captcha-' + i).attr('src', n);
				var match = /([0-9]+)\.(png|gif|jpeg)$/.exec(n);
				form.find('input:hidden[name="_wpcf7_captcha_challenge_' + i + '"]').attr('value', match[1]);
			});
		});
	};

	$.fn.wpcf7RefillQuiz = function(quiz) {
		return this.each(function() {
			var form = $(this);

			$.each(quiz, function(i, n) {
				form.find(':input[name="' + i + '"]').clearFields();
				form.find(':input[name="' + i + '"]').siblings('span.wpcf7-quiz-label').text(n[0]);
				form.find('input:hidden[name="_wpcf7_quiz_answer_' + i + '"]').attr('value', n[1]);
			});
		});
	};

	$.fn.wpcf7ClearResponseOutput = function() {
		return this.each(function() {
			$(this).find('div.wpcf7-response-output').hide().empty().removeClass('wpcf7-mail-sent-ok wpcf7-mail-sent-ng wpcf7-validation-errors wpcf7-spam-blocked').removeAttr('role');
			$(this).find('span.wpcf7-not-valid-tip').remove();
			$(this).find('img.ajax-loader').css({ visibility: 'hidden' });
		});
	};

	$.wpcf7SupportHtml5 = function() {
		var features = {};
		var input = document.createElement('input');

		features.placeholder = 'placeholder' in input;

		var inputTypes = ['email', 'url', 'tel', 'number', 'range', 'date'];

		$.each(inputTypes, function(index, value) {
			input.setAttribute('type', value);
			features[value] = input.type !== 'text';
		});

		return features;
	};
})(jQuery);


// Scroll lento de las anclas
$('a[href*=#]').click(function()
{
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname)
	{
		var $target = $(this.hash);
		$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
		if ($target.length)
		{
			var targetOffset = $target.offset().top;
			$('html,body').animate({scrollTop: targetOffset}, 1000);
			return false;
		};
	};
});






/*!
*  - v1.2.1
* Homepage: http://bqworks.com/slider-pro/
* Author: bqworks
* Author URL: http://bqworks.com/
*/
;(function( window, $ ) {

	"use strict";

	// Static methods for Slider Pro
	$.SliderPro = {

		// List of added modules
		modules: [],

		// Add a module by extending the core prototype
		addModule: function( name, module ) {
			this.modules.push( name );
			$.extend( SliderPro.prototype, module );
		}
	};

	// namespace
	var NS = $.SliderPro.namespace = 'SliderPro';

	var SliderPro = function( instance, options ) {

		// Reference to the slider instance
		this.instance = instance;

		// Reference to the slider jQuery element
		this.$slider = $( this.instance );

		// Reference to the slides (sp-slides) jQuery element
		this.$slides = null;

		// Reference to the mask (sp-mask) jQuery element
		this.$slidesMask = null;

		// Reference to the slides (sp-slides-container) jQuery element
		this.$slidesContainer = null;

		// Array of SliderProSlide objects, ordered by their DOM index
		this.slides = [];

		// Array of SliderProSlide objects, ordered by their left/top position in the slider.
		// This will be updated continuously if the slider is loopable.
		this.slidesOrder = [];

		// Holds the options passed to the slider when it was instantiated
		this.options = options;

		// Holds the final settings of the slider after merging the specified
		// ones with the default ones.
		this.settings = {};

		// Another reference to the settings which will not be altered by breakpoints or by other means
		this.originalSettings = {};

		// Reference to the original 'gotoSlide' method
		this.originalGotoSlide = null;

		// The index of the currently selected slide (starts with 0)
		this.selectedSlideIndex = 0;

		// The index of the previously selected slide
		this.previousSlideIndex = 0;

		// Indicates the position of the slide considered to be in the middle.
		// If there are 5 slides (0, 1, 2, 3, 4) the middle position will be 2.
		// If there are 6 slides (0, 1, 2, 3, 4, 5) the middle position will be approximated to 2.
		this.middleSlidePosition = 0;

		// Indicates the type of supported transition (CSS3 2D, CSS3 3D or JavaScript)
		this.supportedAnimation = null;

		// Indicates the required vendor prefix for CSS (i.e., -webkit, -moz, etc.)
		this.vendorPrefix = null;

		// Indicates the name of the CSS transition's complete event (i.e., transitionend, webkitTransitionEnd, etc.)
		this.transitionEvent = null;

		// Indicates the 'left' or 'top' position
		this.positionProperty = null;

		// Indicates if the current browser is IE
		this.isIE = null;

		// The position of the slides container
		this.slidesPosition = 0;

		// The width of the individual slide
		this.slideWidth = 0;

		// The height of the individual slide
		this.slideHeight = 0;

		// The width or height, depending on the orientation, of the individual slide
		this.slideSize = 0;

		// Reference to the old slide width, used to check if the width has changed
		this.previousSlideWidth = 0;

		// Reference to the old slide height, used to check if the height has changed
		this.previousSlideHeight = 0;
		
		// Reference to the old window width, used to check if the window width has changed
		this.previousWindowWidth = 0;
		
		// Reference to the old window height, used to check if the window height has changed
		this.previousWindowHeight = 0;

		// The distance from the margin of the slider to the left/top of the selected slide.
		// This is useful in calculating the position of the selected slide when there are 
		// more visible slides.
		this.visibleOffset = 0;

		// Property used for deferring the resizing of the slider
		this.allowResize = true;

		// Unique ID to be used for event listening
		this.uniqueId = new Date().valueOf();

		// Stores size breakpoints
		this.breakpoints = [];

		// Indicates the current size breakpoint
		this.currentBreakpoint = -1;

		// An array of shuffled indexes, based on which the slides will be shuffled
		this.shuffledIndexes = [];

		// Initialize the slider
		this._init();
	};

	SliderPro.prototype = {

		// The starting place for the slider
		_init: function() {
			var that = this;

			this.supportedAnimation = SliderProUtils.getSupportedAnimation();
			this.vendorPrefix = SliderProUtils.getVendorPrefix();
			this.transitionEvent = SliderProUtils.getTransitionEvent();
			this.isIE = SliderProUtils.checkIE();

			// Remove the 'sp-no-js' when the slider's JavaScript code starts running
			this.$slider.removeClass( 'sp-no-js' );

			// Add the 'ios' class if it's an iOS device
			if ( window.navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) {
				this.$slider.addClass( 'ios' );
			}

			// Check if IE (older than 11) is used and add the version number as a class to the slider since
			// older IE versions might need CSS tweaks.
			var rmsie = /(msie) ([\w.]+)/,
				ieVersion = rmsie.exec( window.navigator.userAgent.toLowerCase() );
			
			if ( this.isIE ) {
				this.$slider.addClass( 'ie' );
			}

			if ( ieVersion !== null ) {
				this.$slider.addClass( 'ie' + parseInt( ieVersion[2], 10 ) );
			}

			// Set up the slides containers
			// slider-pro > sp-slides-container > sp-mask > sp-slides > sp-slide
			this.$slidesContainer = $( '<div class="sp-slides-container"></div>' ).appendTo( this.$slider );
			this.$slidesMask = $( '<div class="sp-mask"></div>' ).appendTo( this.$slidesContainer );
			this.$slides = this.$slider.find( '.sp-slides' ).appendTo( this.$slidesMask );
			this.$slider.find( '.sp-slide' ).appendTo( this.$slides );
			
			var modules = $.SliderPro.modules;

			// Merge the modules' default settings with the core's default settings
			if ( typeof modules !== 'undefined' ) {
				for ( var i = 0; i < modules.length; i++ ) {
					var defaults = modules[ i ].substring( 0, 1 ).toLowerCase() + modules[ i ].substring( 1 ) + 'Defaults';

					if ( typeof this[ defaults ] !== 'undefined' ) {
						$.extend( this.defaults, this[ defaults ] );
					}
				}
			}

			// Merge the specified setting with the default ones
			this.settings = $.extend( {}, this.defaults, this.options );

			// Initialize the modules
			if ( typeof modules !== 'undefined' ) {
				for ( var j = 0; j < modules.length; j++ ) {
					if ( typeof this[ 'init' + modules[ j ] ] !== 'undefined' ) {
						this[ 'init' + modules[ j ] ]();
					}
				}
			}

			// Keep a reference of the original settings and use it
			// to restore the settings when the breakpoints are used.
			this.originalSettings = $.extend( {}, this.settings );

			// Get the reference to the 'gotoSlide' method
			this.originalGotoSlide = this.gotoSlide;

			// Parse the breakpoints object and store the values into an array,
			// sorting them in ascending order based on the specified size.
			if ( this.settings.breakpoints !== null ) {
				for ( var sizes in this.settings.breakpoints ) {
					this.breakpoints.push({ size: parseInt( sizes, 10 ), properties:this.settings.breakpoints[ sizes ] });
				}

				this.breakpoints = this.breakpoints.sort(function( a, b ) {
					return a.size >= b.size ? 1: -1;
				});
			}

			// Set which slide should be selected initially
			this.selectedSlideIndex = this.settings.startSlide;

			// Shuffle/randomize the slides
			if ( this.settings.shuffle === true ) {
				var slides = this.$slides.find( '.sp-slide' ),
					shuffledSlides = [];

				// Populate the 'shuffledIndexes' with index numbers
				slides.each(function( index ) {
					that.shuffledIndexes.push( index );
				});

				for ( var k = this.shuffledIndexes.length - 1; k > 0; k-- ) {
					var l = Math.floor( Math.random() * ( k + 1 ) ),
						temp = this.shuffledIndexes[ k ];

					this.shuffledIndexes[ k ] = this.shuffledIndexes[ l ];
					this.shuffledIndexes[ l ] = temp;
				}

				// Reposition the slides based on the order of the indexes in the
				// 'shuffledIndexes' array
				$.each( this.shuffledIndexes, function( index, element ) {
					shuffledSlides.push( slides[ element ] );
				});
				
				// Append the sorted slides to the slider
				this.$slides.empty().append( shuffledSlides ) ;
			}
			
			// Resize the slider when the browser window resizes.
			// Also, deffer the resizing in order to not allow multiple
			// resizes in a 200 milliseconds interval.
			$( window ).on( 'resize.' + this.uniqueId + '.' + NS, function() {
			
				// Get the current width and height of the window
				var newWindowWidth = $( window ).width(),
					newWindowHeight = $( window ).height();
				
				// If the resize is not allowed yet or if the window size hasn't changed (this needs to be verified
				// because in IE8 and lower the resize event is triggered whenever an element from the page changes
				// its size) return early.
				if ( that.allowResize === false ||
					( that.previousWindowWidth === newWindowWidth && that.previousWindowHeight === newWindowHeight ) ) {
					return;
				}
				
				// Asign the new values for the window width and height
				that.previousWindowWidth = newWindowWidth;
				that.previousWindowHeight = newWindowHeight;
			
				that.allowResize = false;

				setTimeout(function() {
					that.resize();
					that.allowResize = true;
				}, 200 );
			});

			// Resize the slider when the 'update' method is called.
			this.on( 'update.' + NS, function() {

				// Reset the previous slide width
				that.previousSlideWidth = 0;

				// Some updates might require a resize
				that.resize();
			});

			this.update();

			// add the 'sp-selected' class to the initially selected slide
			this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected' );

			// Fire the 'init' event
			this.trigger({ type: 'init' });
			if ( $.isFunction( this.settings.init ) ) {
				this.settings.init.call( this, { type: 'init' });
			}
		},

		// Update the slider by checking for setting changes and for slides
		// that weren't initialized yet.
		update: function() {
			var that = this;

			// Check the current slider orientation and reset CSS that might have been
			// added for a different orientation, since the orientation can be changed
			// at runtime.
			if ( this.settings.orientation === 'horizontal' ) {
				this.$slider.removeClass( 'sp-vertical' ).addClass( 'sp-horizontal' );
				this.$slider.css({ 'height': '', 'max-height': '' });
				this.$slides.find( '.sp-slide' ).css( 'top', '' );
			} else if ( this.settings.orientation === 'vertical' ) {
				this.$slider.removeClass( 'sp-horizontal' ).addClass( 'sp-vertical' );
				this.$slides.find( '.sp-slide' ).css( 'left', '' );
			}

			// Set the position that will be used to arrange elements, like the slides,
			// based on the orientation.
			this.positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';

			// Reset the 'gotoSlide' method
			this.gotoSlide = this.originalGotoSlide;

			// Loop through the array of SliderProSlide objects and if a stored slide is found
			// which is not in the DOM anymore, destroy that slide.
			for ( var i = this.slides.length - 1; i >= 0; i-- ) {
				if ( this.$slider.find( '.sp-slide[data-index="' + i + '"]' ).length === 0 ) {
					var slide = this.slides[ i ];

					slide.destroy();
					this.slides.splice( i, 1 );
				}
			}

			this.slidesOrder.length = 0;

			// Loop through the list of slides and initialize newly added slides if any,
			// and reset the index of each slide.
			this.$slider.find( '.sp-slide' ).each(function( index ) {
				var $slide = $( this );

				if ( typeof $slide.attr( 'data-init' ) === 'undefined' ) {
					that._createSlide( index, $slide );
				} else {
					that.slides[ index ].setIndex( index );
				}

				that.slidesOrder.push( index );
			});

			// Calculate the position/index of the middle slide
			this.middleSlidePosition = parseInt( ( that.slidesOrder.length - 1 ) / 2, 10 );

			// Arrange the slides in a loop
			if ( this.settings.loop === true ) {
				this._updateSlidesOrder();
			}

			// Fire the 'update' event
			this.trigger({ type: 'update' });
			if ( $.isFunction( this.settings.update ) ) {
				this.settings.update.call( this, { type: 'update' } );
			}
		},

		// Create a SliderProSlide instance for the slide passed as a jQuery element
		_createSlide: function( index, element ) {
			var that = this,
				slide = new SliderProSlide( $( element ), index, this.settings );

			this.slides.splice( index, 0, slide );
		},

		// Arrange the slide elements in a loop inside the 'slidesOrder' array
		_updateSlidesOrder: function() {
			var	slicedItems,
				i,

				// Calculate the distance between the selected element and the middle position
				distance = $.inArray( this.selectedSlideIndex, this.slidesOrder ) - this.middleSlidePosition;

			// If the distance is negative it means that the selected slider is before the middle position, so
			// slides from the end of the array will be added at the beginning, in order to shift the selected slide
			// forward.
			// 
			// If the distance is positive, slides from the beginning of the array will be added at the end.
			if ( distance < 0 ) {
				slicedItems = this.slidesOrder.splice( distance, Math.abs( distance ) );

				for ( i = slicedItems.length - 1; i >= 0; i-- ) {
					this.slidesOrder.unshift( slicedItems[ i ] );
				}
			} else if ( distance > 0 ) {
				slicedItems = this.slidesOrder.splice( 0, distance );

				for ( i = 0; i <= slicedItems.length - 1; i++ ) {
					this.slidesOrder.push( slicedItems[ i ] );
				}
			}
		},

		// Set the left/top position of the slides based on their position in the 'slidesOrder' array
		_updateSlidesPosition: function() {
			var selectedSlidePixelPosition = parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 );

			for ( var slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
				var slide = this.$slides.find( '.sp-slide' ).eq( this.slidesOrder[ slideIndex ] );
				slide.css( this.positionProperty, selectedSlidePixelPosition + ( slideIndex - this.middleSlidePosition  ) * ( this.slideSize + this.settings.slideDistance ) );
			}
		},

		// Set the left/top position of the slides based on their position in the 'slidesOrder' array,
		// and also set the position of the slides container.
		_resetSlidesPosition: function() {
			for ( var slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
				var slide = this.$slides.find( '.sp-slide' ).eq( this.slidesOrder[ slideIndex ] );
				slide.css( this.positionProperty, slideIndex * ( this.slideSize + this.settings.slideDistance ) );
			}

			var newSlidesPosition = - parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ) + this.visibleOffset;
			this._moveTo( newSlidesPosition, true );
		},

		// Called when the slider needs to resize
		resize: function() {
			var that = this;

			// Check if the current window width is bigger than the biggest breakpoint
			// and if necessary reset the properties to the original settings.
			// 
			// If the window width is smaller than a certain breakpoint, apply the settings specified
			// for that breakpoint but only after merging them with the original settings
			// in order to make sure that only the specified settings for the breakpoint are applied
			if ( this.settings.breakpoints !== null && this.breakpoints.length > 0 ) {
				if ( $( window ).width() > this.breakpoints[ this.breakpoints.length - 1 ].size && this.currentBreakpoint !== -1 ) {
					this.currentBreakpoint = -1;
					this._setProperties( this.originalSettings, false );
				} else {
					for ( var i = 0, n = this.breakpoints.length; i < n; i++ ) {
						if ( $( window ).width() <= this.breakpoints[ i ].size ) {
							if ( this.currentBreakpoint !== this.breakpoints[ i ].size ) {
								var eventObject = { type: 'breakpointReach', size: this.breakpoints[ i ].size, settings: this.breakpoints[ i ].properties };
								this.trigger( eventObject );
								if ( $.isFunction( this.settings.breakpointReach ) )
									this.settings.breakpointReach.call( this, eventObject );

								this.currentBreakpoint = this.breakpoints[ i ].size;
								var settings = $.extend( {}, this.originalSettings, this.breakpoints[ i ].properties );
								this._setProperties( settings, false );
								
								return;
							}

							break;
						}
					}
				}
			}

			// Set the width of the main slider container based on whether or not the slider is responsive,
			// full width or full size
			if ( this.settings.responsive === true ) {
				if ( ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) &&
					( this.settings.visibleSize === 'auto' || this.settings.visibleSize !== 'auto' && this.settings.orientation === 'vertical' )
				) {
					this.$slider.css( 'margin', 0 );
					this.$slider.css({ 'width': $( window ).width(), 'max-width': '', 'marginLeft': - this.$slider.offset().left });
				} else {
					this.$slider.css({ 'width': '100%', 'max-width': this.settings.width, 'marginLeft': '' });
				}
			} else {
				this.$slider.css({ 'width': this.settings.width });
			}

			// Calculate the aspect ratio of the slider
			if ( this.settings.aspectRatio === -1 ) {
				this.settings.aspectRatio = this.settings.width / this.settings.height;
			}
			
			// Initially set the slide width to the size of the slider.
			// Later, this will be set to less if there are multiple visible slides.
			this.slideWidth = this.$slider.width();

			// Set the height to the same size as the browser window if the slider is set to be 'fullWindow',
			// or calculate the height based on the width and the aspect ratio.
			if ( this.settings.forceSize === 'fullWindow' ) {
				this.slideHeight = $( window ).height();
			} else {
				this.slideHeight = isNaN( this.settings.aspectRatio ) ? this.settings.height : this.slideWidth / this.settings.aspectRatio;
			}

			// Resize the slider only if the size of the slider has changed
			// If it hasn't, return.
			if ( this.previousSlideWidth !== this.slideWidth ||
				this.previousSlideHeight !== this.slideHeight ||
				this.settings.visibleSize !== 'auto' ||
				this.$slider.outerWidth() > this.$slider.parent().width() ||
				this.$slider.width() !== this.$slidesMask.width()
			) {
				this.previousSlideWidth = this.slideWidth;
				this.previousSlideHeight = this.slideHeight;
			} else {
				return;
			}

			// The slide width or slide height is needed for several calculation, so create a reference to it
			// based on the current orientation.
			this.slideSize = this.settings.orientation === 'horizontal' ? this.slideWidth : this.slideHeight;
			
			// Initially set the visible size of the slides and the offset of the selected slide as if there is only
			// on visible slide.
			// If there will be multiple visible slides (when 'visibleSize' is different than 'auto'), these will
			// be updated accordingly.
			this.visibleSlidesSize = this.slideSize;
			this.visibleOffset = 0;

			// Loop through the existing slides and reset their size.
			$.each( this.slides, function( index, element ) {
				element.setSize( that.slideWidth, that.slideHeight );
			});

			// Set the initial size of the mask container to the size of an individual slide
			this.$slidesMask.css({ 'width': this.slideWidth, 'height': this.slideHeight });

			// Adjust the height if it's set to 'auto'
			if ( this.settings.autoHeight === true ) {

				// Delay the resizing of the height to allow for other resize handlers
				// to execute first before calculating the final height of the slide
				setTimeout( function() {
					that._resizeHeight();
				}, 1 );
			} else {
				this.$slidesMask.css( this.vendorPrefix + 'transition', '' );
			}

			// The 'visibleSize' option can be set to fixed or percentage size to make more slides
			// visible at a time.
			// By default it's set to 'auto'.
			if ( this.settings.visibleSize !== 'auto' ) {
				if ( this.settings.orientation === 'horizontal' ) {

					// If the size is forced to full width or full window, the 'visibleSize' option will be
					// ignored and the slider will become as wide as the browser window.
					if ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) {
						this.$slider.css( 'margin', 0 );
						this.$slider.css({ 'width': $( window ).width(), 'max-width': '', 'marginLeft': - this.$slider.offset().left });
					} else {
						this.$slider.css({ 'width': this.settings.visibleSize, 'max-width': '100%', 'marginLeft': 0 });
					}
					
					this.$slidesMask.css( 'width', this.$slider.width() );

					this.visibleSlidesSize = this.$slidesMask.width();
					this.visibleOffset = Math.round( ( this.$slider.width() - this.slideWidth ) / 2 );
				} else {

					// If the size is forced to full window, the 'visibleSize' option will be
					// ignored and the slider will become as high as the browser window.
					if ( this.settings.forceSize === 'fullWindow' ) {
						this.$slider.css({ 'height': $( window ).height(), 'max-height': '' });
					} else {
						this.$slider.css({ 'height': this.settings.visibleSize, 'max-height': '100%' });
					}

					this.$slidesMask.css( 'height', this.$slider.height() );

					this.visibleSlidesSize = this.$slidesMask.height();
					this.visibleOffset = Math.round( ( this.$slider.height() - this.slideHeight ) / 2 );
				}
			}

			this._resetSlidesPosition();

			// Fire the 'sliderResize' event
			this.trigger({ type: 'sliderResize' });
			if ( $.isFunction( this.settings.sliderResize ) ) {
				this.settings.sliderResize.call( this, { type: 'sliderResize' });
			}
		},

		// Resize the height of the slider to the height of the selected slide.
		// It's used when the 'autoHeight' option is set to 'true'.
		_resizeHeight: function() {
			var that = this,
				selectedSlide = this.getSlideAt( this.selectedSlideIndex ),
				size = selectedSlide.getSize();

			selectedSlide.off( 'imagesLoaded.' + NS );
			selectedSlide.on( 'imagesLoaded.' + NS, function( event ) {
				if ( event.index === that.selectedSlideIndex ) {
					var size = selectedSlide.getSize();
					that._resizeHeightTo( size.height );
				}
			});

			// If the selected slide contains images which are still loading,
			// wait for the loading to complete and then request the size again.
			if ( size !== 'loading' ) {
				this._resizeHeightTo( size.height );
			}
		},

		// Open the slide at the specified index
		gotoSlide: function( index ) {
			if ( index === this.selectedSlideIndex || typeof this.slides[ index ] === 'undefined' ) {
				return;
			}

			var that = this;

			this.previousSlideIndex = this.selectedSlideIndex;
			this.selectedSlideIndex = index;

			// Re-assign the 'sp-selected' class to the currently selected slide
			this.$slides.find( '.sp-selected' ).removeClass( 'sp-selected' );
			this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected' );

			// If the slider is loopable reorder the slides to have the selected slide in the middle
			// and update the slides' position.
			if ( this.settings.loop === true ) {
				this._updateSlidesOrder();
				this._updateSlidesPosition();
			}

			// Adjust the height of the slider
			if ( this.settings.autoHeight === true ) {
				this._resizeHeight();
			}

			// Calculate the new position that the slides container need to take
			var newSlidesPosition = - parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ) + this.visibleOffset;

			// Move the slides container to the new position
			this._moveTo( newSlidesPosition, false, function() {
				if ( that.settings.loop === true ) {
					that._resetSlidesPosition();
				}

				// Fire the 'gotoSlideComplete' event
				that.trigger({ type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex });
				if ( $.isFunction( that.settings.gotoSlideComplete ) ) {
					that.settings.gotoSlideComplete.call( that, { type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex } );
				}
			});

			// Fire the 'gotoSlide' event
			this.trigger({ type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex });
			if ( $.isFunction( this.settings.gotoSlide ) ) {
				this.settings.gotoSlide.call( this, { type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex } );
			}
		},

		// Open the next slide
		nextSlide: function() {
			var index = ( this.selectedSlideIndex >= this.getTotalSlides() - 1 ) ? 0 : ( this.selectedSlideIndex + 1 );
			this.gotoSlide( index );
		},

		// Open the previous slide
		previousSlide: function() {
			var index = this.selectedSlideIndex <= 0 ? ( this.getTotalSlides() - 1 ) : ( this.selectedSlideIndex - 1 );
			this.gotoSlide( index );
		},

		// Move the slides container to the specified position.
		// The movement can be instant or animated.
		_moveTo: function( position, instant, callback ) {
			var that = this,
				css = {};

			if ( position === this.slidesPosition ) {
				return;
			}
			
			this.slidesPosition = position;
			
			if ( ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) && this.isIE === false ) {
				var transition,
					left = this.settings.orientation === 'horizontal' ? position : 0,
					top = this.settings.orientation === 'horizontal' ? 0 : position;

				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				if ( typeof instant !== 'undefined' && instant === true ) {
					transition = '';
				} else {
					this.$slides.addClass( 'sp-animated' );
					transition = this.vendorPrefix + 'transform ' + this.settings.slideAnimationDuration / 1000 + 's';

					this.$slides.on( this.transitionEvent, function( event ) {
						if ( event.target !== event.currentTarget ) {
							return;
						}

						that.$slides.off( that.transitionEvent );
						that.$slides.removeClass( 'sp-animated' );
						
						if ( typeof callback === 'function' ) {
							callback();
						}
					});
				}

				css[ this.vendorPrefix + 'transition' ] = transition;

				this.$slides.css( css );
			} else {
				css[ 'margin-' + this.positionProperty ] = position;

				if ( typeof instant !== 'undefined' && instant === true ) {
					this.$slides.css( css );
				} else {
					this.$slides.addClass( 'sp-animated' );
					this.$slides.animate( css, this.settings.slideAnimationDuration, function() {
						that.$slides.removeClass( 'sp-animated' );

						if ( typeof callback === 'function' ) {
							callback();
						}
					});
				}
			}
		},

		// Stop the movement of the slides
		_stopMovement: function() {
			var css = {};

			if ( ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) && this.isIE === false) {

				// Get the current position of the slides by parsing the 'transform' property
				var	matrixString = this.$slides.css( this.vendorPrefix + 'transform' ),
					matrixType = matrixString.indexOf( 'matrix3d' ) !== -1 ? 'matrix3d' : 'matrix',
					matrixArray = matrixString.replace( matrixType, '' ).match( /-?[0-9\.]+/g ),
					left = matrixType === 'matrix3d' ? parseInt( matrixArray[ 12 ], 10 ) : parseInt( matrixArray[ 4 ], 10 ),
					top = matrixType === 'matrix3d' ? parseInt( matrixArray[ 13 ], 10 ) : parseInt( matrixArray[ 5 ], 10 );
					
				// Set the transform property to the value that the transform had when the function was called
				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				css[ this.vendorPrefix + 'transition' ] = '';

				this.$slides.css( css );
				this.$slides.off( this.transitionEvent );
				this.slidesPosition = this.settings.orientation === 'horizontal' ? left : top;
			} else {
				this.$slides.stop();
				this.slidesPosition = parseInt( this.$slides.css( 'margin-' + this.positionProperty ), 10 );
			}

			this.$slides.removeClass( 'sp-animated' );
		},

		// Resize the height of the slider to the specified value
		_resizeHeightTo: function( height ) {
			var that = this,
				css = { 'height': height };

			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {
				css[ this.vendorPrefix + 'transition' ] = 'height ' + this.settings.heightAnimationDuration / 1000 + 's';

				this.$slidesMask.off( this.transitionEvent );
				this.$slidesMask.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}

					that.$slidesMask.off( that.transitionEvent );

					// Fire the 'resizeHeightComplete' event
					that.trigger({ type: 'resizeHeightComplete' });
					if ( $.isFunction( that.settings.resizeHeightComplete ) ) {
						that.settings.resizeHeightComplete.call( that, { type: 'resizeHeightComplete' } );
					}
				});

				this.$slidesMask.css( css );
			} else {
				this.$slidesMask.stop().animate( css, this.settings.heightAnimationDuration, function( event ) {
					// Fire the 'resizeHeightComplete' event
					that.trigger({ type: 'resizeHeightComplete' });
					if ( $.isFunction( that.settings.resizeHeightComplete ) ) {
						that.settings.resizeHeightComplete.call( that, { type: 'resizeHeightComplete' } );
					}
				});
			}
		},

		// Destroy the slider instance
		destroy: function() {
			// Remove the stored reference to this instance
			this.$slider.removeData( 'sliderPro' );
			
			// Clean the CSS
			this.$slider.removeAttr( 'style' );
			this.$slides.removeAttr( 'style' );

			// Remove event listeners
			this.off( 'update.' + NS );
			$( window ).off( 'resize.' + this.uniqueId + '.' + NS );

			// Destroy modules
			var modules = $.SliderPro.modules;

			if ( typeof modules !== 'undefined' ) {
				for ( var i = 0; i < modules.length; i++ ) {
					if ( typeof this[ 'destroy' + modules[ i ] ] !== 'undefined' ) {
						this[ 'destroy' + modules[ i ] ]();
					}
				}
			}

			// Destroy all slides
			$.each( this.slides, function( index, element ) {
				element.destroy();
			});

			this.slides.length = 0;

			// Move the slides to their initial position in the DOM and 
			// remove the container elements created dynamically.
			this.$slides.prependTo( this.$slider );
			this.$slidesContainer.remove();
		},

		// Set properties on runtime
		_setProperties: function( properties, store ) {
			// Parse the properties passed as an object
			for ( var prop in properties ) {
				this.settings[ prop ] = properties[ prop ];

				// Alter the original settings as well unless 'false' is passed to the 'store' parameter
				if ( store !== false ) {
					this.originalSettings[ prop ] = properties[ prop ];
				}
			}

			this.update();
		},

		// Attach an event handler to the slider
		on: function( type, callback ) {
			return this.$slider.on( type, callback );
		},

		// Detach an event handler
		off: function( type ) {
			return this.$slider.off( type );
		},

		// Trigger an event on the slider
		trigger: function( data ) {
			return this.$slider.triggerHandler( data );
		},

		// Return the slide at the specified index
		getSlideAt: function( index ) {
			return this.slides[ index ];
		},

		// Return the index of the currently opened slide
		getSelectedSlide: function() {
			return this.selectedSlideIndex;
		},

		// Return the total amount of slides
		getTotalSlides: function() {
			return this.slides.length;
		},

		// The default options of the slider
		defaults: {
			// Width of the slide
			width: 500,

			// Height of the slide
			height: 300,

			// Indicates if the slider is responsive
			responsive: true,

			// The aspect ratio of the slider (width/height)
			aspectRatio: -1,

			// The scale mode for images (cover, contain, exact and none)
			imageScaleMode: 'cover',

			// Indicates if the image will be centered
			centerImage: true,

			// Indicates if height of the slider will be adjusted to the
			// height of the selected slide
			autoHeight: false,

			// Indicates the initially selected slide
			startSlide: 0,

			// Indicates if the slides will be shuffled
			shuffle: false,

			// Indicates whether the slides will be arranged horizontally
			// or vertically. Can be set to 'horizontal' or 'vertical'.
			orientation: 'horizontal',

			// Indicates if the size of the slider will be forced to 'fullWidth' or 'fullWindow'
			forceSize: 'none',

			// Indicates if the slider will be loopable
			loop: true,

			// The distance between slides
			slideDistance: 10,

			// The duration of the slide animation
			slideAnimationDuration: 700,

			// The duration of the height animation
			heightAnimationDuration: 700,

			// Sets the size of the visible area, allowing the increase of it in order
			// to make more slides visible.
			// By default, only the selected slide will be visible. 
			visibleSize: 'auto',

			// Breakpoints for allowing the slider's options to be changed
			// based on the size of the window.
			breakpoints: null,

			// Called when the slider is initialized
			init: function() {},

			// Called when the slider is updates
			update: function() {},

			// Called when the slider is resized
			sliderResize: function() {},

			// Called when a new slide is selected
			gotoSlide: function() {},

			// Called when the navigation to the newly selected slide is complete
			gotoSlideComplete: function() {},

			// Called when the height animation of the slider is complete
			resizeHeightComplete: function() {},

			// Called when a breakpoint is reached
			breakpointReach: function() {}
		}
	};

	var SliderProSlide = function( slide, index, settings ) {

		// Reference to the slide jQuery element
		this.$slide = slide;

		// Reference to the main slide image
		this.$mainImage = null;

		// Reference to the container that will hold the main image
		this.$imageContainer = null;

		// Indicates whether the slide has a main image
		this.hasMainImage = false;

		// Indicates whether the main image is loaded
		this.isMainImageLoaded = false;

		// Indicates whether the main image is in the process of being loaded
		this.isMainImageLoading = false;

		// Indicates whether the slide has any image. There could be other images (i.e., in layers)
		// besides the main slide image.
		this.hasImages = false;

		// Indicates if all the images in the slide are loaded
		this.areImagesLoaded = false;

		// The width and height of the slide
		this.width = 0;
		this.height = 0;

		// Reference to the global settings of the slider
		this.settings = settings;

		// Set the index of the slide
		this.setIndex( index );

		// Initialize the slide
		this._init();
	};

	SliderProSlide.prototype = {

		// The starting point for the slide
		_init: function() {
			var that = this;

			// Mark the slide as initialized
			this.$slide.attr( 'data-init', true );

			// Get the main slide image if there is one
			this.$mainImage = this.$slide.find( '.sp-image' ).length !== 0 ? this.$slide.find( '.sp-image' ) : null;

			// If there is a main slide image, create a container for it and add the image to this container.
			// The container will allow the isolation of the image from the rest of the slide's content. This is
			// helpful when you want to show some content below the image and not cover it.
			if ( this.$mainImage !== null ) {
				this.hasMainImage = true;

				this.$imageContainer = $( '<div class="sp-image-container"></div>' ).prependTo( this.$slide );

				if ( this.$mainImage.parent( 'a' ).length !== 0 ) {
					this.$mainImage.parent( 'a' ).appendTo( this.$imageContainer );
				} else {
					this.$mainImage.appendTo( this.$imageContainer );
				}
			}

			this.hasImages = this.$slide.find( 'img' ).length !== 0 ? true : false;
		},

		// Set the size of the slide
		setSize: function( width, height ) {
			var that = this;
			
			this.width = width;
			this.height = this.settings.autoHeight === true ? 'auto' : height;

			this.$slide.css({
				'width': this.width,
				'height': this.height
			});

			if ( this.hasMainImage === true ) {
				this.$imageContainer.css({
					'width': this.width,
					'height': this.height
				});

				// Resize the main image if it's loaded. If the 'data-src' attribute is present it means
				// that the image will be lazy-loaded
				if ( typeof this.$mainImage.attr( 'data-src' ) === 'undefined' ) {
					this.resizeMainImage();
				}
			}
		},

		// Get the size (width and height) of the slide
		getSize: function() {
			var that = this,
				size;

			// Check if all images have loaded, and if they have, return the size, else, return 'loading'
			if ( this.hasImages === true && this.areImagesLoaded === false && typeof this.$slide.attr( 'data-loading' ) === 'undefined' ) {
				this.$slide.attr( 'data-loading', true );

				var status = SliderProUtils.checkImagesComplete( this.$slide, function() {
					that.areImagesLoaded = true;
					that.$slide.removeAttr( 'data-loading' );
					that.trigger({ type: 'imagesLoaded.' + NS, index: that.index });
				});

				if ( status === 'complete' ) {
					size = this.calculateSize();

					return {
						'width': size.width,
						'height': size.height
					};
				} else {
					return 'loading';
				}
			} else {
				size = this.calculateSize();

				return {
					'width': size.width,
					'height': size.height
				};
			}
		},

		// Calculate the width and height of the slide by going
		// through all the child elements and measuring their 'bottom'
		// and 'right' properties. The element with the biggest
		// 'right'/'bottom' property will determine the slide's
		// width/height.
		calculateSize: function() {
			var width = this.$slide.width(),
				height = this.$slide.height();

			this.$slide.children().each(function( index, element ) {
				var child = $( element );

				if ( child.is( ':hidden' ) === true ) {
					return;
				}

				var	rect = element.getBoundingClientRect(),
					bottom = child.position().top + ( rect.bottom - rect.top ),
					right = child.position().left + ( rect.right - rect.left );

				if ( bottom > height ) {
					height = bottom;
				}

				if ( right > width ) {
					width = right;
				}
			});

			return { width: width, height: height };
		},

		// Resize the main image.
		// 
		// Call this when the slide resizes or when the main image has changed to a different image.
		resizeMainImage: function( isNewImage ) {
			var that = this;

			// If the main image has changed, reset the 'flags'
			if ( isNewImage === true ) {
				this.isMainImageLoaded = false;
				this.isMainImageLoading = false;
			}

			// If the image was not loaded yet and it's not in the process of being loaded, load it
			if ( this.isMainImageLoaded === false && this.isMainImageLoading === false ) {
				this.isMainImageLoading = true;

				SliderProUtils.checkImagesComplete( this.$mainImage, function() {
					that.isMainImageLoaded = true;
					that.isMainImageLoading = false;
					that.resizeMainImage();
					that.trigger({ type: 'imagesLoaded.' + NS, index: that.index });
				});

				return;
			}

			// After the main image has loaded, resize it
			if ( this.settings.autoHeight === true ) {
				this.$mainImage.css({ width: '100%', height: 'auto', 'marginLeft': '', 'marginTop': '' });
			} else {
				if ( this.settings.imageScaleMode === 'cover' ) {
					if ( this.$mainImage.width() / this.$mainImage.height() <= this.width / this.height ) {
						this.$mainImage.css({ width: '100%', height: 'auto' });
					} else {
						this.$mainImage.css({ width: 'auto', height: '100%' });
					}
				} else if ( this.settings.imageScaleMode === 'contain' ) {
					if ( this.$mainImage.width() / this.$mainImage.height() >= this.width / this.height ) {
						this.$mainImage.css({ width: '100%', height: 'auto' });
					} else {
						this.$mainImage.css({ width: 'auto', height: '100%' });
					}
				} else if ( this.settings.imageScaleMode === 'exact' ) {
					this.$mainImage.css({ width: '100%', height: '100%' });
				}

				if ( this.settings.centerImage === true ) {
					this.$mainImage.css({ 'marginLeft': ( this.$imageContainer.width() - this.$mainImage.width() ) * 0.5, 'marginTop': ( this.$imageContainer.height() - this.$mainImage.height() ) * 0.5 });
				}
			}
		},

		// Destroy the slide
		destroy: function() {
			// Clean the slide element from attached styles and data
			this.$slide.removeAttr( 'style' );
			this.$slide.removeAttr( 'data-init' );
			this.$slide.removeAttr( 'data-index' );
			this.$slide.removeAttr( 'data-loaded' );

			// If there is a main image, remove its container
			if ( this.hasMainImage === true ) {
				this.$slide.find( '.sp-image' )
					.removeAttr( 'style' )
					.appendTo( this.$slide );

				this.$slide.find( '.sp-image-container' ).remove();
			}
		},

		// Return the index of the slide
		getIndex: function() {
			return this.index;
		},

		// Set the index of the slide
		setIndex: function( index ) {
			this.index = index;
			this.$slide.attr( 'data-index', this.index );
		},

		// Attach an event handler to the slide
		on: function( type, callback ) {
			return this.$slide.on( type, callback );
		},

		// Detach an event handler to the slide
		off: function( type ) {
			return this.$slide.off( type );
		},

		// Trigger an event on the slide
		trigger: function( data ) {
			return this.$slide.triggerHandler( data );
		}
	};

	window.SliderPro = SliderPro;
	window.SliderProSlide = SliderProSlide;

	$.fn.sliderPro = function( options ) {
		var args = Array.prototype.slice.call( arguments, 1 );

		return this.each(function() {
			// Instantiate the slider or alter it
			if ( typeof $( this ).data( 'sliderPro' ) === 'undefined' ) {
				var newInstance = new SliderPro( this, options );

				// Store a reference to the instance created
				$( this ).data( 'sliderPro', newInstance );
			} else if ( typeof options !== 'undefined' ) {
				var	currentInstance = $( this ).data( 'sliderPro' );

				// Check the type of argument passed
				if ( typeof currentInstance[ options ] === 'function' ) {
					currentInstance[ options ].apply( currentInstance, args );
				} else if ( typeof currentInstance.settings[ options ] !== 'undefined' ) {
					var obj = {};
					obj[ options ] = args[ 0 ];
					currentInstance._setProperties( obj );
				} else if ( typeof options === 'object' ) {
					currentInstance._setProperties( options );
				} else {
					$.error( options + ' does not exist in sliderPro.' );
				}
			}
		});
	};

	// Contains useful utility functions
	var SliderProUtils = {

		// Indicates what type of animations are supported in the current browser
		// Can be CSS 3D, CSS 2D or JavaScript
		supportedAnimation: null,

		// Indicates the required vendor prefix for the current browser
		vendorPrefix: null,

		// Indicates the name of the transition's complete event for the current browser
		transitionEvent: null,

		// Indicates if the current browser is Internet Explorer (any version)
		isIE: null,

		// Check whether CSS3 3D or 2D transforms are supported. If they aren't, use JavaScript animations
		getSupportedAnimation: function() {
			if ( this.supportedAnimation !== null ) {
				return this.supportedAnimation;
			}

			var element = document.body || document.documentElement,
				elementStyle = element.style,
				isCSSTransitions = typeof elementStyle.transition !== 'undefined' ||
									typeof elementStyle.WebkitTransition !== 'undefined' ||
									typeof elementStyle.MozTransition !== 'undefined' ||
									typeof elementStyle.OTransition !== 'undefined';

			if ( isCSSTransitions === true ) {
				var div = document.createElement( 'div' );

				// Check if 3D transforms are supported
				if ( typeof div.style.WebkitPerspective !== 'undefined' || typeof div.style.perspective !== 'undefined' ) {
					this.supportedAnimation = 'css-3d';
				}

				// Additional checks for Webkit
				if ( this.supportedAnimation === 'css-3d' && typeof div.styleWebkitPerspective !== 'undefined' ) {
					var style = document.createElement( 'style' );
					style.textContent = '@media (transform-3d),(-webkit-transform-3d){#test-3d{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0;}}';
					document.getElementsByTagName( 'head' )[0].appendChild( style );

					div.id = 'test-3d';
					document.body.appendChild( div );

					if ( ! ( div.offsetLeft === 9 && div.offsetHeight === 5 ) ) {
						this.supportedAnimation = null;
					}

					style.parentNode.removeChild( style );
					div.parentNode.removeChild( div );
				}

				// If CSS 3D transforms are not supported, check if 2D transforms are supported
				if ( this.supportedAnimation === null && ( typeof div.style['-webkit-transform'] !== 'undefined' || typeof div.style.transform !== 'undefined' ) ) {
					this.supportedAnimation = 'css-2d';
				}
			} else {
				this.supportedAnimation = 'javascript';
			}
			
			return this.supportedAnimation;
		},

		// Check what vendor prefix should be used in the current browser
		getVendorPrefix: function() {
			if ( this.vendorPrefix !== null ) {
				return this.vendorPrefix;
			}

			var div = document.createElement( 'div' ),
				prefixes = [ 'Webkit', 'Moz', 'ms', 'O' ];
			
			if ( 'transform' in div.style ) {
				this.vendorPrefix = '';
				return this.vendorPrefix;
			}
			
			for ( var i = 0; i < prefixes.length; i++ ) {
				if ( ( prefixes[ i ] + 'Transform' ) in div.style ) {
					this.vendorPrefix = '-' + prefixes[ i ].toLowerCase() + '-';
					break;
				}
			}
			
			return this.vendorPrefix;
		},

		// Check the name of the transition's complete event in the current browser
		getTransitionEvent: function() {
			if ( this.transitionEvent !== null ) {
				return this.transitionEvent;
			}

			var div = document.createElement( 'div' ),
				transitions = {
					'transition': 'transitionend',
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'OTransition': 'oTransitionEnd'
				};

			for ( var transition in transitions ) {
				if ( transition in div.style ) {
					this.transitionEvent = transitions[ transition ];
					break;
				}
			}

			return this.transitionEvent;
		},

		// If a single image is passed, check if it's loaded.
		// If a different element is passed, check if there are images
		// inside it, and check if these images are loaded.
		checkImagesComplete: function( target, callback ) {
			var that = this,

				// Check the initial status of the image(s)
				status = this.checkImagesStatus( target );

			// If there are loading images, wait for them to load.
			// If the images are loaded, call the callback function directly.
			if ( status === 'loading' ) {
				var checkImages = setInterval(function() {
					status = that.checkImagesStatus( target );

					if ( status === 'complete' ) {
						clearInterval( checkImages );

						if ( typeof callback === 'function' ) {
							callback();
						}
					}
				}, 100 );
			} else if ( typeof callback === 'function' ) {
				callback();
			}

			return status;
		},

		checkImagesStatus: function( target ) {
			var status = 'complete';

			if ( target.is( 'img' ) && target[0].complete === false ) {
				status = 'loading';
			} else {
				target.find( 'img' ).each(function( index ) {
					var image = $( this )[0];

					if ( image.complete === false ) {
						status = 'loading';
					}
				});
			}

			return status;
		},

		checkIE: function() {
			if ( this.isIE !== null ) {
				return this.isIE;
			}

			var userAgent = window.navigator.userAgent,
				msie = userAgent.indexOf( 'MSIE' );

			if ( userAgent.indexOf( 'MSIE' ) !== -1 || userAgent.match( /Trident.*rv\:11\./ ) ) {
				this.isIE = true;
			} else {
				this.isIE = false;
			}

			return this.isIE;
		}
	};

	window.SliderProUtils = SliderProUtils;

})( window, jQuery );

// Thumbnails module for Slider Pro.
// 
// Adds the possibility to create a thumbnail scroller, each thumbnail
// corresponding to a slide.
;(function( window, $ ) {

	"use strict";

	var NS = 'Thumbnails.' + $.SliderPro.namespace;

	var Thumbnails = {

		// Reference to the thumbnail scroller 
		$thumbnails: null,

		// Reference to the container of the thumbnail scroller
		$thumbnailsContainer: null,

		// List of Thumbnail objects
		thumbnails: null,

		// Index of the selected thumbnail
		selectedThumbnailIndex: 0,

		// Total size (width or height, depending on the orientation) of the thumbnails
		thumbnailsSize: 0,

		// Size of the thumbnail's container
		thumbnailsContainerSize: 0,

		// The position of the thumbnail scroller inside its container
		thumbnailsPosition: 0,

		// Orientation of the thumbnails
		thumbnailsOrientation: null,

		// Indicates the 'left' or 'top' position based on the orientation of the thumbnails
		thumbnailsPositionProperty: null,

		// Indicates if there are thumbnails in the slider
		isThumbnailScroller: false,

		initThumbnails: function() {
			var that = this;

			this.thumbnails = [];

			this.on( 'update.' + NS, $.proxy( this._thumbnailsOnUpdate, this ) );
			this.on( 'sliderResize.' + NS, $.proxy( this._thumbnailsOnResize, this ) );
			this.on( 'gotoSlide.' + NS, function( event ) {
				that._gotoThumbnail( event.index );
			});
		},

		// Called when the slider is updated
		_thumbnailsOnUpdate: function() {
			var that = this;

			if ( this.$slider.find( '.sp-thumbnail' ).length === 0 && this.thumbnails.length === 0 ) {
				this.isThumbnailScroller = false;
				return;
			}

			this.isThumbnailScroller = true;

			// Create the container of the thumbnail scroller, if it wasn't created yet
			if ( this.$thumbnailsContainer === null ) {
				this.$thumbnailsContainer = $( '<div class="sp-thumbnails-container"></div>' ).insertAfter( this.$slidesContainer );
			}

			// If the thumbnails' main container doesn't exist, create it, and get a reference to it
			if ( this.$thumbnails === null ) {
				if ( this.$slider.find( '.sp-thumbnails' ).length !== 0 ) {
					this.$thumbnails = this.$slider.find( '.sp-thumbnails' ).appendTo( this.$thumbnailsContainer );

					// Shuffle/randomize the thumbnails
					if ( this.settings.shuffle === true ) {
						var thumbnails = this.$thumbnails.find( '.sp-thumbnail' ),
							shuffledThumbnails = [];

						// Reposition the thumbnails based on the order of the indexes in the
						// 'shuffledIndexes' array
						$.each( this.shuffledIndexes, function( index, element ) {
							var $thumbnail = $( thumbnails[ element ] );

							if ( $thumbnail.parent( 'a' ).length !== 0 ) {
								$thumbnail = $thumbnail.parent( 'a' );
							}

							shuffledThumbnails.push( $thumbnail );
						});
						
						// Append the sorted thumbnails to the thumbnail scroller
						this.$thumbnails.empty().append( shuffledThumbnails ) ;
					}
				} else {
					this.$thumbnails = $( '<div class="sp-thumbnails"></div>' ).appendTo( this.$thumbnailsContainer );
				}
			}

			// Check if there are thumbnails inside the slides and move them in the thumbnails container
			this.$slides.find( '.sp-thumbnail' ).each( function( index ) {
				var $thumbnail = $( this ),
					thumbnailIndex = $thumbnail.parents( '.sp-slide' ).index(),
					lastThumbnailIndex = that.$thumbnails.find( '.sp-thumbnail' ).length - 1;

				if ( $thumbnail.parent( 'a' ).length !== 0 ) {
					$thumbnail = $thumbnail.parent( 'a' );
				}

				// If the index of the slide that contains the thumbnail is greater than the total number
				// of thumbnails from the thumbnails container, position the thumbnail at the end.
				// Otherwise, add the thumbnails at the corresponding position.
				if ( thumbnailIndex > lastThumbnailIndex ) {
					$thumbnail.appendTo( that.$thumbnails );
				} else {
					$thumbnail.insertBefore( that.$thumbnails.find( '.sp-thumbnail' ).eq( thumbnailIndex ) );
				}
			});

			// Loop through the Thumbnail objects and if a corresponding element is not found in the DOM,
			// it means that the thumbnail might have been removed. In this case, destroy that Thumbnail instance.
			for ( var i = this.thumbnails.length - 1; i >= 0; i-- ) {
				if ( this.$thumbnails.find( '.sp-thumbnail[data-index="' + i + '"]' ).length === 0 ) {
					var thumbnail = this.thumbnails[ i ];

					thumbnail.destroy();
					this.thumbnails.splice( i, 1 );
				}
			}

			// Loop through the thumbnails and if there is any uninitialized thumbnail,
			// initialize it, else update the thumbnail's index.
			this.$thumbnails.find( '.sp-thumbnail' ).each(function( index ) {
				var $thumbnail = $( this );

				if ( typeof $thumbnail.attr( 'data-init' ) === 'undefined' ) {
					that._createThumbnail( $thumbnail, index );
				} else {
					that.thumbnails[ index ].setIndex( index );
				}
			});

			// Remove the previous class that corresponds to the position of the thumbnail scroller
			this.$thumbnailsContainer.removeClass( 'sp-top-thumbnails sp-bottom-thumbnails sp-left-thumbnails sp-right-thumbnails' );

			// Check the position of the thumbnail scroller and assign it the appropriate class and styling
			if ( this.settings.thumbnailsPosition === 'top' ) {
				this.$thumbnailsContainer.addClass( 'sp-top-thumbnails' );
				this.thumbnailsOrientation = 'horizontal';
			} else if ( this.settings.thumbnailsPosition === 'bottom' ) {
				this.$thumbnailsContainer.addClass( 'sp-bottom-thumbnails' );
				this.thumbnailsOrientation = 'horizontal';
			} else if ( this.settings.thumbnailsPosition === 'left' ) {
				this.$thumbnailsContainer.addClass( 'sp-left-thumbnails' );
				this.thumbnailsOrientation = 'vertical';
			} else if ( this.settings.thumbnailsPosition === 'right' ) {
				this.$thumbnailsContainer.addClass( 'sp-right-thumbnails' );
				this.thumbnailsOrientation = 'vertical';
			}

			// Check if the pointer needs to be created
			if ( this.settings.thumbnailPointer === true ) {
				this.$thumbnailsContainer.addClass( 'sp-has-pointer' );
			} else {
				this.$thumbnailsContainer.removeClass( 'sp-has-pointer' );
			}

			// Mark the thumbnail that corresponds to the selected slide
			this.selectedThumbnailIndex = this.selectedSlideIndex;
			this.$thumbnails.find( '.sp-thumbnail-container' ).eq( this.selectedThumbnailIndex ).addClass( 'sp-selected-thumbnail' );
			
			// Calculate the total size of the thumbnails
			this.thumbnailsSize = 0;

			$.each( this.thumbnails, function( index, thumbnail ) {
				thumbnail.setSize( that.settings.thumbnailWidth, that.settings.thumbnailHeight );
				that.thumbnailsSize += that.thumbnailsOrientation === 'horizontal' ? thumbnail.getSize().width : thumbnail.getSize().height;
			});

			// Set the size of the thumbnails
			if ( this.thumbnailsOrientation === 'horizontal' ) {
				this.$thumbnails.css({ 'width': this.thumbnailsSize, 'height': this.settings.thumbnailHeight });
				this.$thumbnailsContainer.css( 'height', '' );
				this.thumbnailsPositionProperty = 'left';
			} else {
				this.$thumbnails.css({ 'width': this.settings.thumbnailWidth, 'height': this.thumbnailsSize });
				this.$thumbnailsContainer.css( 'width', '' );
				this.thumbnailsPositionProperty = 'top';
			}

			// Fire the 'thumbnailsUpdate' event
			this.trigger({ type: 'thumbnailsUpdate' });
			if ( $.isFunction( this.settings.thumbnailsUpdate ) ) {
				this.settings.thumbnailsUpdate.call( this, { type: 'thumbnailsUpdate' } );
			}
		},

		// Create an individual thumbnail
		_createThumbnail: function( element, index ) {
			var that = this,
				thumbnail = new Thumbnail( element, this.$thumbnails, index );

			// When the thumbnail is clicked, navigate to the corresponding slide
			thumbnail.on( 'thumbnailClick.' + NS, function( event ) {
				that.gotoSlide( event.index );
			});

			// Add the thumbnail at the specified index
			this.thumbnails.splice( index, 0, thumbnail );
		},

		// Called when the slider is resized.
		// Resets the size and position of the thumbnail scroller container.
		_thumbnailsOnResize: function() {
			if ( this.isThumbnailScroller === false ) {
				return;
			}

			var that = this,
				newThumbnailsPosition;

			if ( this.thumbnailsOrientation === 'horizontal' ) {
				this.thumbnailsContainerSize = Math.min( this.$slidesMask.width(), this.thumbnailsSize );
				this.$thumbnailsContainer.css( 'width', this.thumbnailsContainerSize );

				// Reduce the slide mask's height, to make room for the thumbnails
				if ( this.settings.forceSize === 'fullWindow' ) {
					this.$slidesMask.css( 'height', this.$slidesMask.height() - this.$thumbnailsContainer.outerHeight( true ) );

					// Resize the slide
					this.slideHeight = this.$slidesMask.height();
						
					$.each( this.slides, function( index, element ) {
						element.setSize( that.slideWidth, that.slideHeight );
					});
				}
			} else if ( this.thumbnailsOrientation === 'vertical' ) {

				// Check if the width of the slide mask plus the width of the thumbnail scroller is greater than
				// the width of the slider's container and if that's the case, reduce the slides container width
				// in order to make the entire slider fit inside the slider's container.
				if ( this.$slidesMask.width() + this.$thumbnailsContainer.outerWidth( true ) > this.$slider.parent().width() ) {
					// Reduce the slider's width, to make room for the thumbnails
					if ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) {
						this.$slider.css( 'max-width', $( window ).width() - this.$thumbnailsContainer.outerWidth( true ) );
					} else {
						this.$slider.css( 'max-width', this.$slider.parent().width() - this.$thumbnailsContainer.outerWidth( true ) );
					}
					
					this.$slidesMask.css( 'width', this.$slider.width() );

					// If the slides are horizontally oriented, update the visible size and the offset
					// of the selected slide, since the slider's size was reduced to make room for the thumbnails.
					// 
					// If the slides are vertically oriented, update the width and height (to maintain the aspect ratio)
					// of the slides.
					if ( this.settings.orientation === 'horizontal' ) {
						this.visibleOffset = Math.round( ( this.$slider.width() - this.slideSize ) / 2 );
						this.visibleSlidesSize = this.$slidesMask.width();
					} else if ( this.settings.orientation === 'vertical' ) {
						this.slideWidth = this.$slider.width();

						$.each( this.slides, function( index, element ) {
							element.setSize( that.slideWidth, that.slideHeight );
						});
					}

					// Re-arrange the slides
					this._resetSlidesPosition();
				}

				this.thumbnailsContainerSize = Math.min( this.$slidesMask.height(), this.thumbnailsSize );
				this.$thumbnailsContainer.css( 'height', this.thumbnailsContainerSize );
			}

			// If the total size of the thumbnails is smaller than the thumbnail scroller' container (which has
			// the same size as the slides container), it means that all the thumbnails will be visible, so set
			// the position of the thumbnail scroller to 0.
			// 
			// If that's not the case, the thumbnail scroller will be positioned based on which thumbnail is selected.
			if ( this.thumbnailsSize <= this.thumbnailsContainerSize || this.$thumbnails.find( '.sp-selected-thumbnail' ).length === 0 ) {
				newThumbnailsPosition = 0;
			} else {
				newThumbnailsPosition = Math.max( - this.thumbnails[ this.selectedThumbnailIndex ].getPosition()[ this.thumbnailsPositionProperty ], this.thumbnailsContainerSize - this.thumbnailsSize );
			}

			// Add a padding to the slider, based on the thumbnail scroller's orientation, to make room
			// for the thumbnails.
			if ( this.settings.thumbnailsPosition === 'top' ) {
				this.$slider.css({ 'paddingTop': this.$thumbnailsContainer.outerHeight( true ), 'paddingLeft': '', 'paddingRight': '' });
			} else if ( this.settings.thumbnailsPosition === 'bottom' ) {
				this.$slider.css({ 'paddingTop': '', 'paddingLeft': '', 'paddingRight': '' });
			} else if ( this.settings.thumbnailsPosition === 'left' ) {
				this.$slider.css({ 'paddingTop': '', 'paddingLeft': this.$thumbnailsContainer.outerWidth( true ), 'paddingRight': '' });
			} else if ( this.settings.thumbnailsPosition === 'right' ) {
				this.$slider.css({ 'paddingTop': '', 'paddingLeft': '', 'paddingRight': this.$thumbnailsContainer.outerWidth( true ) });
			}

			this._moveThumbnailsTo( newThumbnailsPosition, true );
		},

		// Selects the thumbnail at the indicated index and moves the thumbnail scroller
		// accordingly.
		_gotoThumbnail: function( index ) {
			if ( this.isThumbnailScroller === false || typeof this.thumbnails[ index ] === 'undefined' ) {
				return;
			}

			var previousIndex = this.selectedThumbnailIndex,
				newThumbnailsPosition = this.thumbnailsPosition;

			this.selectedThumbnailIndex = index;

			// Set the 'selected' class to the appropriate thumbnail
			this.$thumbnails.find( '.sp-selected-thumbnail' ).removeClass( 'sp-selected-thumbnail' );
			this.$thumbnails.find( '.sp-thumbnail-container' ).eq( this.selectedThumbnailIndex ).addClass( 'sp-selected-thumbnail' );

			// Calculate the new position that the thumbnail scroller needs to go to.
			// 
			// If the selected thumbnail has a higher index than the previous one, make sure that the thumbnail
			// that comes after the selected thumbnail will be visible, if the selected thumbnail is not the
			// last thumbnail in the list.
			// 
			// If the selected thumbnail has a lower index than the previous one, make sure that the thumbnail
			// that's before the selected thumbnail will be visible, if the selected thumbnail is not the
			// first thumbnail in the list.
			if ( this.selectedThumbnailIndex >= previousIndex ) {
				var nextThumbnailIndex = this.selectedThumbnailIndex === this.thumbnails.length - 1 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex + 1,
					nextThumbnail = this.thumbnails[ nextThumbnailIndex ],
					nextThumbnailPosition = this.thumbnailsOrientation === 'horizontal' ? nextThumbnail.getPosition().right : nextThumbnail.getPosition().bottom,
					thumbnailsRightPosition = - this.thumbnailsPosition + this.thumbnailsContainerSize;

				if ( nextThumbnailPosition > thumbnailsRightPosition ) {
					newThumbnailsPosition = this.thumbnailsPosition - ( nextThumbnailPosition - thumbnailsRightPosition );
				}
			} else if ( this.selectedThumbnailIndex < previousIndex ) {
				var previousThumbnailIndex = this.selectedThumbnailIndex === 0 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex - 1,
					previousThumbnail = this.thumbnails[ previousThumbnailIndex ],
					previousThumbnailPosition = this.thumbnailsOrientation === 'horizontal' ? previousThumbnail.getPosition().left : previousThumbnail.getPosition().top;

				if ( previousThumbnailPosition < - this.thumbnailsPosition ) {
					newThumbnailsPosition = - previousThumbnailPosition;
				}
			}

			// Move the thumbnail scroller to the calculated position
			this._moveThumbnailsTo( newThumbnailsPosition );

			// Fire the 'gotoThumbnail' event
			this.trigger({ type: 'gotoThumbnail' });
			if ( $.isFunction( this.settings.gotoThumbnail ) ) {
				this.settings.gotoThumbnail.call( this, { type: 'gotoThumbnail' });
			}
		},

		// Move the thumbnail scroller to the indicated position
		_moveThumbnailsTo: function( position, instant, callback ) {
			var that = this,
				css = {};

			// Return if the position hasn't changed
			if ( position === this.thumbnailsPosition ) {
				return;
			}

			this.thumbnailsPosition = position;

			// Use CSS transitions if they are supported. If not, use JavaScript animation
			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {
				var transition,
					left = this.thumbnailsOrientation === 'horizontal' ? position : 0,
					top = this.thumbnailsOrientation === 'horizontal' ? 0 : position;

				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				if ( typeof instant !== 'undefined' && instant === true ) {
					transition = '';
				} else {
					this.$thumbnails.addClass( 'sp-animated' );
					transition = this.vendorPrefix + 'transform ' + 700 / 1000 + 's';

					this.$thumbnails.on( this.transitionEvent, function( event ) {
						if ( event.target !== event.currentTarget ) {
							return;
						}

						that.$thumbnails.off( that.transitionEvent );
						that.$thumbnails.removeClass( 'sp-animated' );

						if ( typeof callback === 'function' ) {
							callback();
						}

						// Fire the 'thumbnailsMoveComplete' event
						that.trigger({ type: 'thumbnailsMoveComplete' });
						if ( $.isFunction( that.settings.thumbnailsMoveComplete ) ) {
							that.settings.thumbnailsMoveComplete.call( that, { type: 'thumbnailsMoveComplete' });
						}
					});
				}

				css[ this.vendorPrefix + 'transition' ] = transition;

				this.$thumbnails.css( css );
			} else {
				css[ 'margin-' + this.thumbnailsPositionProperty ] = position;

				if ( typeof instant !== 'undefined' && instant === true ) {
					this.$thumbnails.css( css );
				} else {
					this.$thumbnails
						.addClass( 'sp-animated' )
						.animate( css, 700, function() {
							that.$thumbnails.removeClass( 'sp-animated' );

							if ( typeof callback === 'function' ) {
								callback();
							}

							// Fire the 'thumbnailsMoveComplete' event
							that.trigger({ type: 'thumbnailsMoveComplete' });
							if ( $.isFunction( that.settings.thumbnailsMoveComplete ) ) {
								that.settings.thumbnailsMoveComplete.call( that, { type: 'thumbnailsMoveComplete' });
							}
						});
				}
			}
		},

		// Stop the movement of the thumbnail scroller
		_stopThumbnailsMovement: function() {
			var css = {};

			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {
				var	matrixString = this.$thumbnails.css( this.vendorPrefix + 'transform' ),
					matrixType = matrixString.indexOf( 'matrix3d' ) !== -1 ? 'matrix3d' : 'matrix',
					matrixArray = matrixString.replace( matrixType, '' ).match( /-?[0-9\.]+/g ),
					left = matrixType === 'matrix3d' ? parseInt( matrixArray[ 12 ], 10 ) : parseInt( matrixArray[ 4 ], 10 ),
					top = matrixType === 'matrix3d' ? parseInt( matrixArray[ 13 ], 10 ) : parseInt( matrixArray[ 5 ], 10 );

				if ( this.supportedAnimation === 'css-3d' ) {
					css[ this.vendorPrefix + 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
				} else {
					css[ this.vendorPrefix + 'transform' ] = 'translate(' + left + 'px, ' + top + 'px)';
				}

				css[ this.vendorPrefix + 'transition' ] = '';

				this.$thumbnails.css( css );
				this.$thumbnails.off( this.transitionEvent );
				this.thumbnailsPosition = this.thumbnailsOrientation === 'horizontal' ? parseInt( matrixArray[ 4 ] , 10 ) : parseInt( matrixArray[ 5 ] , 10 );
			} else {
				this.$thumbnails.stop();
				this.thumbnailsPosition = parseInt( this.$thumbnails.css( 'margin-' + this.thumbnailsPositionProperty ), 10 );
			}

			this.$thumbnails.removeClass( 'sp-animated' );
		},

		// Destroy the module
		destroyThumbnails: function() {
			var that = this;

			// Remove event listeners
			this.off( 'update.' + NS );

			if ( this.isThumbnailScroller === false ) {
				return;
			}
			
			this.off( 'sliderResize.' + NS );
			this.off( 'gotoSlide.' + NS );
			$( window ).off( 'resize.' + this.uniqueId + '.' + NS );

			// Destroy the individual thumbnails
			this.$thumbnails.find( '.sp-thumbnail' ).each( function() {
				var $thumbnail = $( this ),
					index = parseInt( $thumbnail.attr( 'data-index' ), 10 ),
					thumbnail = that.thumbnails[ index ];

				thumbnail.off( 'thumbnailClick.' + NS );
				thumbnail.destroy();
			});

			this.thumbnails.length = 0;

			// Add the thumbnail scroller directly in the slider and
			// remove the thumbnail scroller container
			this.$thumbnails.appendTo( this.$slider );
			this.$thumbnailsContainer.remove();
			
			// Remove any created padding
			this.$slider.css({ 'paddingTop': '', 'paddingLeft': '', 'paddingRight': '' });
		},

		thumbnailsDefaults: {

			// Sets the width of the thumbnail
			thumbnailWidth: 100,

			// Sets the height of the thumbnail
			thumbnailHeight: 80,

			// Sets the position of the thumbnail scroller (top, bottom, right, left)
			thumbnailsPosition: 'bottom',

			// Indicates if a pointer will be displayed for the selected thumbnail
			thumbnailPointer: false,

			// Called when the thumbnails are updated
			thumbnailsUpdate: function() {},

			// Called when a new thumbnail is selected
			gotoThumbnail: function() {},

			// Called when the thumbnail scroller has moved
			thumbnailsMoveComplete: function() {}
		}
	};

	var Thumbnail = function( thumbnail, thumbnails, index ) {

		// Reference to the thumbnail jQuery element
		this.$thumbnail = thumbnail;

		// Reference to the thumbnail scroller
		this.$thumbnails = thumbnails;

		// Reference to the thumbnail's container, which will be 
		// created dynamically.
		this.$thumbnailContainer = null;

		// The width and height of the thumbnail
		this.width = 0;
		this.height = 0;

		// Indicates whether the thumbnail's image is loaded
		this.isImageLoaded = false;

		// Set the index of the slide
		this.setIndex( index );

		// Initialize the thumbnail
		this._init();
	};

	Thumbnail.prototype = {

		_init: function() {
			var that = this;

			// Mark the thumbnail as initialized
			this.$thumbnail.attr( 'data-init', true );

			// Create a container for the thumbnail and add the original thumbnail to this container.
			// Having a container will help crop the thumbnail image if it's too large.
			this.$thumbnailContainer = $( '<div class="sp-thumbnail-container"></div>' ).appendTo( this.$thumbnails );

			if ( this.$thumbnail.parent( 'a' ).length !== 0 ) {
				this.$thumbnail.parent( 'a' ).appendTo( this.$thumbnailContainer );
			} else {
				this.$thumbnail.appendTo( this.$thumbnailContainer );
			}

			// When the thumbnail container is clicked, fire an event
			this.$thumbnailContainer.on( 'click.' + NS, function() {
				that.trigger({ type: 'thumbnailClick.' + NS, index: that.index });
			});
		},

		// Set the width and height of the thumbnail
		setSize: function( width, height ) {
			this.width = width;
			this.height = height;

			// Apply the width and height to the thumbnail's container
			this.$thumbnailContainer.css({ 'width': this.width, 'height': this.height });

			// If there is an image, resize it to fit the thumbnail container
			if ( this.$thumbnail.is( 'img' ) && typeof this.$thumbnail.attr( 'data-src' ) === 'undefined' ) {
				this.resizeImage();
			}
		},

		// Return the width and height of the thumbnail
		getSize: function() {
			return {
				width: this.$thumbnailContainer.outerWidth( true ),
				height: this.$thumbnailContainer.outerHeight( true )
			};
		},

		// Return the top, bottom, left and right position of the thumbnail
		getPosition: function() {
			return {
				left: this.$thumbnailContainer.position().left + parseInt( this.$thumbnailContainer.css( 'marginLeft' ) , 10 ),
				right: this.$thumbnailContainer.position().left + parseInt( this.$thumbnailContainer.css( 'marginLeft' ) , 10 ) + this.$thumbnailContainer.outerWidth(),
				top: this.$thumbnailContainer.position().top + parseInt( this.$thumbnailContainer.css( 'marginTop' ) , 10 ),
				bottom: this.$thumbnailContainer.position().top + parseInt( this.$thumbnailContainer.css( 'marginTop' ) , 10 ) + this.$thumbnailContainer.outerHeight()
			};
		},

		// Set the index of the thumbnail
		setIndex: function( index ) {
			this.index = index;
			this.$thumbnail.attr( 'data-index', this.index );
		},

		// Resize the thumbnail's image
		resizeImage: function() {
			var that = this;

			// If the image is not loaded yet, load it
			if ( this.isImageLoaded === false ) {
				SliderProUtils.checkImagesComplete( this.$thumbnailContainer , function() {
					that.isImageLoaded = true;
					that.resizeImage();
				});

				return;
			}

			// Get the reference to the thumbnail image again because it was replaced by
			// another img element during the loading process
			this.$thumbnail = this.$thumbnailContainer.find( '.sp-thumbnail' );

			// Calculate whether the image should stretch horizontally or vertically
			var imageWidth = this.$thumbnail.width(),
				imageHeight = this.$thumbnail.height();

			if ( imageWidth / imageHeight <= this.width / this.height ) {
				this.$thumbnail.css({ width: '100%', height: 'auto' });
			} else {
				this.$thumbnail.css({ width: 'auto', height: '100%' });
			}

			this.$thumbnail.css({ 'marginLeft': ( this.$thumbnailContainer.width() - this.$thumbnail.width() ) * 0.5, 'marginTop': ( this.$thumbnailContainer.height() - this.$thumbnail.height() ) * 0.5 });
		},

		// Destroy the thumbnail
		destroy: function() {
			this.$thumbnailContainer.off( 'click.' + NS );

			// Remove added attributes
			this.$thumbnail.removeAttr( 'data-init' );
			this.$thumbnail.removeAttr( 'data-index' );

			// Remove the thumbnail's container and add the thumbnail
			// back to the thumbnail scroller container
			if ( this.$thumbnail.parent( 'a' ).length !== 0 ) {
				this.$thumbnail.parent( 'a' ).insertBefore( this.$thumbnailContainer );
			} else {
				this.$thumbnail.insertBefore( this.$thumbnailContainer );
			}
			
			this.$thumbnailContainer.remove();
		},

		// Attach an event handler to the slide
		on: function( type, callback ) {
			return this.$thumbnailContainer.on( type, callback );
		},

		// Detach an event handler to the slide
		off: function( type ) {
			return this.$thumbnailContainer.off( type );
		},

		// Trigger an event on the slide
		trigger: function( data ) {
			return this.$thumbnailContainer.triggerHandler( data );
		}
	};

	$.SliderPro.addModule( 'Thumbnails', Thumbnails );

})( window, jQuery );

// ConditionalImages module for Slider Pro.
// 
// Adds the possibility to specify multiple sources for each image and
// load the image that's the most appropriate for the size of the slider.
// For example, instead of loading a large image even if the slider will be small
// you can specify a smaller image that will be loaded instead.
;(function( window, $ ) {

	"use strict";

	var NS = 'ConditionalImages.' + $.SliderPro.namespace;

	var ConditionalImages = {

		// Reference to the previous size
		previousImageSize: null,

		// Reference to the current size
		currentImageSize: null,

		// Indicates if the current display supports high PPI
		isRetinaScreen: false,

		initConditionalImages: function() {
			this.currentImageSize = this.previousImageSize = 'default';
			this.isRetinaScreen = ( typeof this._isRetina !== 'undefined' ) && ( this._isRetina() === true );

			this.on( 'update.' + NS, $.proxy( this._conditionalImagesOnUpdate, this ) );
			this.on( 'sliderResize.' + NS, $.proxy( this._conditionalImagesOnResize, this ) );
		},

		// Loop through all the existing images and specify the original path of the image
		// inside the 'data-default' attribute.
		_conditionalImagesOnUpdate: function() {
			$.each( this.slides, function( index, element ) {
				var $slide = element.$slide;

				$slide.find( 'img:not([ data-default ])' ).each(function() {
					var $image = $( this );

					if ( typeof $image.attr( 'data-src' ) !== 'undefined' ) {
						$image.attr( 'data-default', $image.attr( 'data-src' ) );
					} else {
						$image.attr( 'data-default', $image.attr( 'src' ) );
					}
				});
			});
		},

		// When the window resizes, identify the applyable image size based on the current size of the slider
		// and apply it to all images that have a version of the image specified for this size.
		_conditionalImagesOnResize: function() {
			if ( this.slideWidth <= this.settings.smallSize ) {
				this.currentImageSize = 'small';
			} else if ( this.slideWidth <= this.settings.mediumSize ) {
				this.currentImageSize = 'medium';
			} else if ( this.slideWidth <= this.settings.largeSize ) {
				this.currentImageSize = 'large';
			} else {
				this.currentImageSize = 'default';
			}

			if ( this.previousImageSize !== this.currentImageSize ) {
				var that = this;

				$.each( this.slides, function( index, element ) {
					var $slide = element.$slide;

					$slide.find( 'img' ).each(function() {
						var $image = $( this ),
							imageSource = '';

						// Check if the current display supports high PPI and if a retina version of the current size was specified
						if ( that.isRetinaScreen === true && typeof $image.attr( 'data-retina' + that.currentImageSize ) !== 'undefined' ) {
							imageSource = $image.attr( 'data-retina' + that.currentImageSize );

							// If the retina image was not loaded yet, replace the default image source with the one
							// that corresponds to the current slider size
							if ( typeof $image.attr( 'data-retina' ) !== 'undefined' && $image.attr( 'data-retina' ) !== imageSource ) {
								$image.attr( 'data-retina', imageSource );
							}
						} else if ( ( that.isRetinaScreen === false || that.isRetinaScreen === true && typeof $image.attr( 'data-retina' ) === 'undefined' ) && typeof $image.attr( 'data-' + that.currentImageSize ) !== 'undefined' ) {
							imageSource = $image.attr( 'data-' + that.currentImageSize );

							// If the image is set to lazy load, replace the image source with the one
							// that corresponds to the current slider size
							if ( typeof $image.attr( 'data-src' ) !== 'undefined' && $image.attr( 'data-src' ) !== imageSource ) {
								$image.attr( 'data-src', imageSource );
							}
						}

						// If a new image was found
						if ( imageSource !== '' ) {

							// The existence of the 'data-src' attribute indicates that the image
							// will be lazy loaded, so don't load the new image yet
							if ( typeof $image.attr( 'data-src' ) === 'undefined' && $image.attr( 'src' ) !== imageSource  ) {
								that._loadConditionalImage( $image, imageSource, function( newImage ) {
									if ( newImage.hasClass( 'sp-image' ) ) {
										element.$mainImage = newImage;
										element.resizeMainImage( true );
									}
								});
							}
						}
					});
				});

				this.previousImageSize = this.currentImageSize;
			}
		},

		// Replace the target image with a new image
		_loadConditionalImage: function( image, source, callback ) {

			// Create a new image element
			var newImage = $( new Image() );

			// Copy the class(es) and inline style
			newImage.attr( 'class', image.attr( 'class' ) );
			newImage.attr( 'style', image.attr( 'style' ) );

			// Copy the data attributes
			$.each( image.data(), function( name, value ) {
				newImage.attr( 'data-' + name, value );
			});

			// Copy the width and height attributes if they exist
			if ( typeof image.attr( 'width' ) !== 'undefined') {
				newImage.attr( 'width', image.attr( 'width' ) );
			}

			if ( typeof image.attr( 'height' ) !== 'undefined') {
				newImage.attr( 'height', image.attr( 'height' ) );
			}

			if ( typeof image.attr( 'alt' ) !== 'undefined' ) {
				newImage.attr( 'alt', image.attr( 'alt' ) );
			}

			if ( typeof image.attr( 'title' ) !== 'undefined' ) {
				newImage.attr( 'title', image.attr( 'title' ) );
			}

			newImage.attr( 'src', source );

			// Add the new image in the same container and remove the older image
			newImage.insertAfter( image );
			image.remove();
			image = null;
				
			if ( typeof callback === 'function' ) {
				callback( newImage );
			}
		},

		// Destroy the module
		destroyConditionalImages: function() {
			this.off( 'update.' + NS );
			this.off( 'sliderResize.' + NS );
		},

		conditionalImagesDefaults: {

			// If the slider size is below this size, the small version of the images will be used
			smallSize: 480,

			// If the slider size is below this size, the small version of the images will be used
			mediumSize: 768,

			// If the slider size is below this size, the small version of the images will be used
			largeSize: 1024
		}
	};

	$.SliderPro.addModule( 'ConditionalImages', ConditionalImages );

})( window, jQuery );

// Retina module for Slider Pro.
// 
// Adds the possibility to load a different image when the slider is
// viewed on a retina screen.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Retina.' + $.SliderPro.namespace;

	var Retina = {

		initRetina: function() {
			var that = this;

			// Return if it's not a retina screen
			if ( this._isRetina() === false ) {
				return;
			}
			
			this.on( 'update.' + NS, $.proxy( this._checkRetinaImages, this ) );

			if ( this.$slider.find( '.sp-thumbnail' ).length !== 0 ) {
				this.on( 'update.Thumbnails.' + NS, $.proxy( this._checkRetinaThumbnailImages, this ) );
			}
		},

		// Checks if the current display supports high PPI
		_isRetina: function() {
			if ( window.devicePixelRatio >= 2 ) {
				return true;
			}

			if ( window.matchMedia && ( window.matchMedia( "(-webkit-min-device-pixel-ratio: 2),(min-resolution: 2dppx)" ).matches ) ) {
				return true;
			}

			return false;
		},

		// Loop through the slides and replace the images with their retina version
		_checkRetinaImages: function() {
			var that = this;

			$.each( this.slides, function( index, element ) {
				var $slide = element.$slide;

				if ( typeof $slide.attr( 'data-retina-loaded' ) === 'undefined' ) {
					$slide.attr( 'data-retina-loaded', true );

					$slide.find( 'img[data-retina]' ).each(function() {
						var $image = $( this );

						if ( typeof $image.attr( 'data-src' ) !== 'undefined' ) {
							$image.attr( 'data-src', $image.attr( 'data-retina' ) );
						} else {
							that._loadRetinaImage( $image, function( newImage ) {
								if ( newImage.hasClass( 'sp-image' ) ) {
									element.$mainImage = newImage;
									element.resizeMainImage( true );
								}
							});
						}
					});
				}
			});
		},

		// Loop through the thumbnails and replace the images with their retina version
		_checkRetinaThumbnailImages: function() {
			var that = this;

			$.each( this.thumbnails, function( index, element ) {
				var $thumbnail = element.$thumbnailContainer;

				if ( typeof $thumbnail.attr( 'data-retina-loaded' ) === 'undefined' ) {
					$thumbnail.attr( 'data-retina-loaded', true );

					$thumbnail.find( 'img[data-retina]' ).each(function() {
						var $image = $( this );

						if ( typeof $image.attr( 'data-src' ) !== 'undefined' ) {
							$image.attr( 'data-src', $image.attr( 'data-retina' ) );
						} else {
							that._loadRetinaImage( $image, function( newImage ) {
								if ( newImage.hasClass( 'sp-thumbnail' ) ) {
									element.resizeImage();
								}
							});
						}
					});
				}
			});
		},

		// Load the retina image
		_loadRetinaImage: function( image, callback ) {
			var retinaFound = false,
				newImagePath = '';

			// Check if there is a retina image specified
			if ( typeof image.attr( 'data-retina' ) !== 'undefined' ) {
				retinaFound = true;

				newImagePath = image.attr( 'data-retina' );
			}

			// Check if there is a lazy loaded, non-retina, image specified
			if ( typeof image.attr( 'data-src' ) !== 'undefined' ) {
				if ( retinaFound === false ) {
					newImagePath = image.attr( 'data-src') ;
				}

				image.removeAttr('data-src');
			}

			// Return if there isn't a retina or lazy loaded image
			if ( newImagePath === '' ) {
				return;
			}

			// Create a new image element
			var newImage = $( new Image() );

			// Copy the class(es) and inline style
			newImage.attr( 'class', image.attr('class') );
			newImage.attr( 'style', image.attr('style') );

			// Copy the data attributes
			$.each( image.data(), function( name, value ) {
				newImage.attr( 'data-' + name, value );
			});

			// Copy the width and height attributes if they exist
			if ( typeof image.attr( 'width' ) !== 'undefined' ) {
				newImage.attr( 'width', image.attr( 'width' ) );
			}

			if ( typeof image.attr( 'height' ) !== 'undefined' ) {
				newImage.attr( 'height', image.attr( 'height' ) );
			}

			if ( typeof image.attr( 'alt' ) !== 'undefined' ) {
				newImage.attr( 'alt', image.attr( 'alt' ) );
			}

			if ( typeof image.attr( 'title' ) !== 'undefined' ) {
				newImage.attr( 'title', image.attr( 'title' ) );
			}

			// Add the new image in the same container and remove the older image
			newImage.insertAfter( image );
			image.remove();
			image = null;

			// Assign the source of the image
			newImage.attr( 'src', newImagePath );

			if ( typeof callback === 'function' ) {
				callback( newImage );
			}
		},

		// Destroy the module
		destroyRetina: function() {
			this.off( 'update.' + NS );
			this.off( 'update.Thumbnails.' + NS );
		}
	};

	$.SliderPro.addModule( 'Retina', Retina );
	
})( window, jQuery );

// Lazy Loading module for Slider Pro.
// 
// Adds the possibility to delay the loading of the images until the slides/thumbnails
// that contain them become visible. This technique improves the initial loading
// performance.
;(function( window, $ ) {

	"use strict";

	var NS = 'LazyLoading.' + $.SliderPro.namespace;

	var LazyLoading = {

		allowLazyLoadingCheck: true,

		initLazyLoading: function() {
			var that = this;

			// The 'resize' event is fired after every update, so it's possible to use it for checking
			// if the update made new slides become visible
			// 
			// Also, resizing the slider might make new slides or thumbnails visible
			this.on( 'sliderResize.' + NS, $.proxy( this._lazyLoadingOnResize, this ) );

			// Check visible images when a new slide is selected
			this.on( 'gotoSlide.' + NS, $.proxy( this._checkAndLoadVisibleImages, this ) );

			// Check visible thumbnail images when the thumbnails are updated because new thumbnail
			// might have been added or the settings might have been changed so that more thumbnail
			// images become visible
			// 
			// Also, check visible thumbnail images after the thumbnails have moved because new thumbnails might
			// have become visible
			this.on( 'thumbnailsUpdate.' + NS + ' ' + 'thumbnailsMoveComplete.' + NS, $.proxy( this._checkAndLoadVisibleThumbnailImages, this ) );
		},

		_lazyLoadingOnResize: function() {
			var that = this;

			if ( this.allowLazyLoadingCheck === false ) {
				return;
			}

			this.allowLazyLoadingCheck = false;
			
			this._checkAndLoadVisibleImages();

			if ( this.$slider.find( '.sp-thumbnail' ).length !== 0 ) {
				this._checkAndLoadVisibleThumbnailImages();
			}

			// Use a timer to deffer the loading of images in order to prevent too many
			// checking attempts
			setTimeout(function() {
				that.allowLazyLoadingCheck = true;
			}, 500 );
		},

		// Check visible slides and load their images
		_checkAndLoadVisibleImages: function() {
			if ( this.$slider.find( '.sp-slide:not([ data-loaded ])' ).length === 0 ) {
				return;
			}

			var that = this,

				// Use either the middle position or the index of the selected slide as a reference, depending on
				// whether the slider is loopable
				referencePosition = this.settings.loop === true ? this.middleSlidePosition : this.selectedSlideIndex,

				// Calculate how many slides are visible at the sides of the selected slide
				visibleOnSides = Math.ceil( ( this.visibleSlidesSize - this.slideSize ) / 2 / this.slideSize ),

				// Calculate the indexes of the first and last slide that will be checked
				from = referencePosition - visibleOnSides - 1 > 0 ? referencePosition - visibleOnSides - 1 : 0,
				to = referencePosition + visibleOnSides + 1 < this.getTotalSlides() - 1 ? referencePosition + visibleOnSides + 1 : this.getTotalSlides() - 1,
				
				// Get all the slides that need to be checked
				slidesToCheck = this.slidesOrder.slice( from, to + 1 );

			// Loop through the selected slides and if the slide is not marked as having
			// been loaded yet, loop through its images and load them.
			$.each( slidesToCheck, function( index, element ) {
				var slide = that.slides[ element ],
					$slide = slide.$slide;

				if ( typeof $slide.attr( 'data-loaded' ) === 'undefined' ) {
					$slide.attr( 'data-loaded', true );

					$slide.find( 'img[ data-src ]' ).each(function() {
						var image = $( this );
						that._loadImage( image, function( newImage ) {
							if ( newImage.hasClass( 'sp-image' ) ) {
								slide.$mainImage = newImage;
								slide.resizeMainImage( true );
							}
						});
					});
				}
			});
		},

		// Check visible thumbnails and load their images
		_checkAndLoadVisibleThumbnailImages: function() {
			if ( this.$slider.find( '.sp-thumbnail-container:not([ data-loaded ])' ).length === 0 ) {
				return;
			}

			var that = this,
				thumbnailSize = this.thumbnailsSize / this.thumbnails.length,

				// Calculate the indexes of the first and last thumbnail that will be checked
				from = Math.floor( Math.abs( this.thumbnailsPosition / thumbnailSize ) ),
				to = Math.floor( ( - this.thumbnailsPosition + this.thumbnailsContainerSize ) / thumbnailSize ),

				// Get all the thumbnails that need to be checked
				thumbnailsToCheck = this.thumbnails.slice( from, to + 1 );

			// Loop through the selected thumbnails and if the thumbnail is not marked as having
			// been loaded yet, load its image.
			$.each( thumbnailsToCheck, function( index, element ) {
				var $thumbnailContainer = element.$thumbnailContainer;

				if ( typeof $thumbnailContainer.attr( 'data-loaded' ) === 'undefined' ) {
					$thumbnailContainer.attr( 'data-loaded', true );

					$thumbnailContainer.find( 'img[ data-src ]' ).each(function() {
						var image = $( this );

						that._loadImage( image, function() {
							element.resizeImage();
						});
					});
				}
			});
		},

		// Load an image
		_loadImage: function( image, callback ) {
			// Create a new image element
			var newImage = $( new Image() );

			// Copy the class(es) and inline style
			newImage.attr( 'class', image.attr( 'class' ) );
			newImage.attr( 'style', image.attr( 'style' ) );

			// Copy the data attributes
			$.each( image.data(), function( name, value ) {
				newImage.attr( 'data-' + name, value );
			});

			// Copy the width and height attributes if they exist
			if ( typeof image.attr( 'width' ) !== 'undefined') {
				newImage.attr( 'width', image.attr( 'width' ) );
			}

			if ( typeof image.attr( 'height' ) !== 'undefined') {
				newImage.attr( 'height', image.attr( 'height' ) );
			}

			if ( typeof image.attr( 'alt' ) !== 'undefined' ) {
				newImage.attr( 'alt', image.attr( 'alt' ) );
			}

			if ( typeof image.attr( 'title' ) !== 'undefined' ) {
				newImage.attr( 'title', image.attr( 'title' ) );
			}

			// Assign the source of the image
			newImage.attr( 'src', image.attr( 'data-src' ) );
			newImage.removeAttr( 'data-src' );

			// Add the new image in the same container and remove the older image
			newImage.insertAfter( image );
			image.remove();
			image = null;
			
			if ( typeof callback === 'function' ) {
				callback( newImage );
			}
		},

		// Destroy the module
		destroyLazyLoading: function() {
			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );
			this.off( 'sliderResize.' + NS );
			this.off( 'thumbnailsUpdate.' + NS );
			this.off( 'thumbnailsMoveComplete.' + NS );
		}
	};

	$.SliderPro.addModule( 'LazyLoading', LazyLoading );

})( window, jQuery );

// Layers module for Slider Pro.
// 
// Adds support for animated and static layers. The layers can contain any content,
// from simple text for video elements.
;(function( window, $ ) {

	"use strict";

	var NS = 'Layers.' +  $.SliderPro.namespace;

	var Layers = {

		// Reference to the original 'gotoSlide' method
		layersGotoSlideReference: null,

		// Reference to the timer that will delay the overriding
		// of the 'gotoSlide' method
		waitForLayersTimer: null,

		initLayers: function() {
			this.on( 'update.' + NS, $.proxy( this._layersOnUpdate, this ) );
			this.on( 'sliderResize.' + NS, $.proxy( this._layersOnResize, this ) );
			this.on( 'gotoSlide.' + NS, $.proxy( this._layersOnGotoSlide, this ) );
		},

		// Loop through the slides and initialize all layers
		_layersOnUpdate: function( event ) {
			var that = this;

			$.each( this.slides, function( index, element ) {
				var $slide = element.$slide;

				// Initialize the layers
				this.$slide.find( '.sp-layer:not([ data-layer-init ])' ).each(function() {
					var layer = new Layer( $( this ) );

					// Add the 'layers' array to the slide objects (instance of SliderProSlide)
					if ( typeof element.layers === 'undefined' ) {
						element.layers = [];
					}

					element.layers.push( layer );

					if ( $( this ).hasClass( 'sp-static' ) === false ) {

						// Add the 'animatedLayers' array to the slide objects (instance of SliderProSlide)
						if ( typeof element.animatedLayers === 'undefined' ) {
							element.animatedLayers = [];
						}

						element.animatedLayers.push( layer );
					}
				});
			});

			// If the 'waitForLayers' option is enabled, the slider will not move to another slide
			// until all the layers from the previous slide will be hidden. To achieve this,
			// replace the current 'gotoSlide' function with another function that will include the 
			// required functionality.
			// 
			// Since the 'gotoSlide' method might be overridden by other modules as well, delay this
			// override to make sure it's the last override.
			if ( this.settings.waitForLayers === true ) {
				clearTimeout( this.waitForLayersTimer );

				this.waitForLayersTimer = setTimeout(function() {
					that.layersGotoSlideReference = that.gotoSlide;
					that.gotoSlide = that._layersGotoSlide;
				}, 1 );
			}
		},

		// When the slider resizes, try to scale down the layers proportionally. The automatic scaling
		// will make use of an option, 'autoScaleReference', by comparing the current width of the slider
		// with the reference width. So, if the reference width is 1000 pixels and the current width is
		// 500 pixels, it means that the layers will be scaled down to 50% of their size.
		_layersOnResize: function() {
			var that = this,
				autoScaleReference,
				useAutoScale = this.settings.autoScaleLayers,
				scaleRatio;

			if ( this.settings.autoScaleLayers === false ) {
				// Show the layers for the initial slide
				this.showLayers( this.selectedSlideIndex );
				
				return;
			}

			// If there isn't a reference for how the layers should scale down automatically, use the 'width'
			// option as a reference, unless the width was set to a percentage. If there isn't a set reference and
			// the width was set to a percentage, auto scaling will not be used because it's not possible to
			// calculate how much should the layers scale.
			if ( this.settings.autoScaleReference === -1 ) {
				if ( typeof this.settings.width === 'string' && this.settings.width.indexOf( '%' ) !== -1 ) {
					useAutoScale = false;
				} else {
					autoScaleReference = parseInt( this.settings.width, 10 );
				}
			} else {
				autoScaleReference = this.settings.autoScaleReference;
			}

			if ( useAutoScale === true && this.slideWidth < autoScaleReference ) {
				scaleRatio = that.slideWidth / autoScaleReference;
			} else {
				scaleRatio = 1;
			}

			$.each( this.slides, function( index, slide ) {
				if ( typeof slide.layers !== 'undefined' ) {
					$.each( slide.layers, function( index, layer ) {
						layer.scale( scaleRatio );
					});
				}
			});

			// Show the layers for the initial slide
			this.showLayers( this.selectedSlideIndex );
		},

		// Replace the 'gotoSlide' method with this one, which makes it possible to 
		// change the slide only after the layers from the previous slide are hidden.
		_layersGotoSlide: function( index ) {
			var that = this,
				animatedLayers = this.slides[ this.selectedSlideIndex ].animatedLayers;

			// If the slider is dragged, don't wait for the layer to hide
			if ( this.$slider.hasClass( 'sp-swiping' ) || typeof animatedLayers === 'undefined' || animatedLayers.length === 0  ) {
				this.layersGotoSlideReference( index );
			} else {
				this.on( 'hideLayersComplete.' + NS, function() {
					that.off( 'hideLayersComplete.' + NS );
					that.layersGotoSlideReference( index );
				});

				this.hideLayers( this.selectedSlideIndex );
			}
		},

		// When a new slide is selected, hide the layers from the previous slide
		// and show the layers from the current slide.
		_layersOnGotoSlide: function( event ) {
			if ( this.previousSlideIndex !== this.selectedSlideIndex &&  this.settings.waitForLayers === false ) {
				this.hideLayers( this.previousSlideIndex );
			}

			this.showLayers( this.selectedSlideIndex );
		},

		// Show the animated layers from the slide at the specified index,
		// and fire an event when all the layers from the slide become visible.
		showLayers: function( index ) {
			var that = this,
				animatedLayers = this.slides[ index ].animatedLayers,
				layerCounter = 0;

			if ( typeof animatedLayers === 'undefined' ) {
				return;
			}

			$.each( animatedLayers, function( index, element ) {

				// If the layer is already visible, increment the counter directly, else wait 
				// for the layer's showing animation to complete.
				if ( element.isVisible() === true ) {
					layerCounter++;

					if ( layerCounter === animatedLayers.length ) {
						that.trigger({ type: 'showLayersComplete', index: index });
						if ( $.isFunction( that.settings.showLayersComplete ) ) {
							that.settings.showLayersComplete.call( that, { type: 'showLayersComplete', index: index });
						}
					}
				} else {
					element.show(function() {
						layerCounter++;

						if ( layerCounter === animatedLayers.length ) {
							that.trigger({ type: 'showLayersComplete', index: index });
							if ( $.isFunction( that.settings.showLayersComplete ) ) {
								that.settings.showLayersComplete.call( that, { type: 'showLayersComplete', index: index });
							}
						}
					});
				}
			});
		},

		// Hide the animated layers from the slide at the specified index,
		// and fire an event when all the layers from the slide become invisible.
		hideLayers: function( index ) {
			var that = this,
				animatedLayers = this.slides[ index ].animatedLayers,
				layerCounter = 0;

			if ( typeof animatedLayers === 'undefined' ) {
				return;
			}

			$.each( animatedLayers, function( index, element ) {

				// If the layer is already invisible, increment the counter directly, else wait 
				// for the layer's hiding animation to complete.
				if ( element.isVisible() === false ) {
					layerCounter++;

					if ( layerCounter === animatedLayers.length ) {
						that.trigger({ type: 'hideLayersComplete', index: index });
						if ( $.isFunction( that.settings.hideLayersComplete ) ) {
							that.settings.hideLayersComplete.call( that, { type: 'hideLayersComplete', index: index });
						}
					}
				} else {
					element.hide(function() {
						layerCounter++;

						if ( layerCounter === animatedLayers.length ) {
							that.trigger({ type: 'hideLayersComplete', index: index });
							if ( $.isFunction( that.settings.hideLayersComplete ) ) {
								that.settings.hideLayersComplete.call( that, { type: 'hideLayersComplete', index: index });
							}
						}
					});
				}
			});
		},

		// Destroy the module
		destroyLayers: function() {
			this.off( 'update.' + NS );
			this.off( 'resize.' + NS );
			this.off( 'gotoSlide.' + NS );
			this.off( 'hideLayersComplete.' + NS );
		},

		layersDefaults: {

			// Indicates whether the slider will wait for the layers to disappear before
			// going to a new slide
			waitForLayers: false,

			// Indicates whether the layers will be scaled automatically
			autoScaleLayers: true,

			// Sets a reference width which will be compared to the current slider width
			// in order to determine how much the layers need to scale down. By default,
			// the reference width will be equal to the slide width. However, if the slide width
			// is set to a percentage value, then it's necessary to set a specific value for 'autoScaleReference'.
			autoScaleReference: -1,

			// Called when all animated layers become visible
			showLayersComplete: function() {},

			// Called when all animated layers become invisible
			hideLayersComplete: function() {}
		}
	};

	// Override the slide's 'destroy' method in order to destroy the 
	// layers that where added to the slide as well.
	var slideDestroy = window.SliderProSlide.prototype.destroy;

	window.SliderProSlide.prototype.destroy = function() {
		if ( typeof this.layers !== 'undefined' ) {
			$.each( this.layers, function( index, element ) {
				element.destroy();
			});

			this.layers.length = 0;
		}

		if ( typeof this.animatedLayers !== 'undefined' ) {
			this.animatedLayers.length = 0;
		}

		slideDestroy.apply( this );
	};

	var Layer = function( layer ) {

		// Reference to the layer jQuery element
		this.$layer = layer;

		// Indicates whether a layer is currently visible or hidden
		this.visible = false;

		// Indicates whether the layer was styled
		this.styled = false;

		// Holds the data attributes added to the layer
		this.data = null;

		// Indicates the layer's reference point (topLeft, bottomLeft, topRight or bottomRight)
		this.position = null;
		
		// Indicates which CSS property (left or right) will be used for positioning the layer 
		this.horizontalProperty = null;
		
		// Indicates which CSS property (top or bottom) will be used for positioning the layer 
		this.verticalProperty = null;

		// Indicates the value of the horizontal position
		this.horizontalPosition = null;
		
		// Indicates the value of the vertical position
		this.verticalPosition = null;

		// Indicates how much the layers needs to be scaled
		this.scaleRatio = 1;

		// Indicates the type of supported transition (CSS3 2D, CSS3 3D or JavaScript)
		this.supportedAnimation = SliderProUtils.getSupportedAnimation();

		// Indicates the required vendor prefix for CSS (i.e., -webkit, -moz, etc.)
		this.vendorPrefix = SliderProUtils.getVendorPrefix();

		// Indicates the name of the CSS transition's complete event (i.e., transitionend, webkitTransitionEnd, etc.)
		this.transitionEvent = SliderProUtils.getTransitionEvent();

		// Reference to the timer that will be used to hide the layers automatically after a given time interval
		this.stayTimer = null;

		this._init();
	};

	Layer.prototype = {

		// Initialize the layers
		_init: function() {
			this.$layer.attr( 'data-layer-init', true );

			if ( this.$layer.hasClass( 'sp-static' ) ) {
				this._setStyle();
			} else {
				this.$layer.css({ 'visibility': 'hidden', 'display': 'none' });
			}
		},

		// Set the size and position of the layer
		_setStyle: function() {
			this.styled = true;

			this.$layer.css( 'display', '' );

			// Get the data attributes specified in HTML
			this.data = this.$layer.data();
			
			if ( typeof this.data.width !== 'undefined' ) {
				this.$layer.css( 'width', this.data.width );
			}

			if ( typeof this.data.height !== 'undefined' ) {
				this.$layer.css( 'height', this.data.height );
			}

			if ( typeof this.data.depth !== 'undefined' ) {
				this.$layer.css( 'z-index', this.data.depth );
			}

			this.position = this.data.position ? ( this.data.position ).toLowerCase() : 'topleft';

			if ( this.position.indexOf( 'right' ) !== -1 ) {
				this.horizontalProperty = 'right';
			} else if ( this.position.indexOf( 'left' ) !== -1 ) {
				this.horizontalProperty = 'left';
			} else {
				this.horizontalProperty = 'center';
			}

			if ( this.position.indexOf( 'bottom' ) !== -1 ) {
				this.verticalProperty = 'bottom';
			} else if ( this.position.indexOf( 'top' ) !== -1 ) {
				this.verticalProperty = 'top';
			} else {
				this.verticalProperty = 'center';
			}

			this._setPosition();

			this.scale( this.scaleRatio );
		},

		// Set the position of the layer
		_setPosition: function() {
			var inlineStyle = this.$layer.attr( 'style' );

			this.horizontalPosition = typeof this.data.horizontal !== 'undefined' ? this.data.horizontal : 0;
			this.verticalPosition = typeof this.data.vertical !== 'undefined' ? this.data.vertical : 0;

			// Set the horizontal position of the layer based on the data set
			if ( this.horizontalProperty === 'center' ) {
				
				// prevent content wrapping while setting the width
				if ( this.$layer.is( 'img' ) === false && ( typeof inlineStyle === 'undefined' || ( typeof inlineStyle !== 'undefined' && inlineStyle.indexOf( 'width' ) === -1 ) ) ) {
					this.$layer.css( 'white-space', 'nowrap' );
					this.$layer.css( 'width', this.$layer.outerWidth( true ) );
				}

				this.$layer.css({ 'marginLeft': 'auto', 'marginRight': 'auto', 'left': this.horizontalPosition, 'right': 0 });
			} else {
				this.$layer.css( this.horizontalProperty, this.horizontalPosition );
			}

			// Set the vertical position of the layer based on the data set
			if ( this.verticalProperty === 'center' ) {

				// prevent content wrapping while setting the height
				if ( this.$layer.is( 'img' ) === false && ( typeof inlineStyle === 'undefined' || ( typeof inlineStyle !== 'undefined' && inlineStyle.indexOf( 'height' ) === -1 ) ) ) {
					this.$layer.css( 'white-space', 'nowrap' );
					this.$layer.css( 'height', this.$layer.outerHeight( true ) );
				}

				this.$layer.css({ 'marginTop': 'auto', 'marginBottom': 'auto', 'top': this.verticalPosition, 'bottom': 0 });
			} else {
				this.$layer.css( this.verticalProperty, this.verticalPosition );
			}
		},

		// Scale the layer
		scale: function( ratio ) {

			// Return if the layer is set to be unscalable
			if ( this.$layer.hasClass( 'sp-no-scale' ) ) {
				return;
			}

			// Store the ratio (even if the layer is not ready to be scaled yet)
			this.scaleRatio = ratio;

			// Return if the layer is not styled yet
			if ( this.styled === false ) {
				return;
			}

			var horizontalProperty = this.horizontalProperty === 'center' ? 'left' : this.horizontalProperty,
				verticalProperty = this.verticalProperty === 'center' ? 'top' : this.verticalProperty,
				css = {};

			// Apply the scaling
			css[ this.vendorPrefix + 'transform-origin' ] = this.horizontalProperty + ' ' + this.verticalProperty;
			css[ this.vendorPrefix + 'transform' ] = 'scale(' + this.scaleRatio + ')';

			// If the position is not set to a percentage value, apply the scaling to the position
			if ( typeof this.horizontalPosition !== 'string' ) {
				css[ horizontalProperty ] = this.horizontalPosition * this.scaleRatio;
			}

			// If the position is not set to a percentage value, apply the scaling to the position
			if ( typeof this.verticalPosition !== 'string' ) {
				css[ verticalProperty ] = this.verticalPosition * this.scaleRatio;
			}

			// If the width or height is set to a percentage value, increase the percentage in order to
			// maintain the same layer to slide proportions. This is necessary because otherwise the scaling
			// transform would minimize the layers more than intended.
			if ( typeof this.data.width === 'string' && this.data.width.indexOf( '%' ) !== -1 ) {
				css.width = ( parseInt( this.data.width, 10 ) / this.scaleRatio ).toString() + '%';
			}

			if ( typeof this.data.height === 'string' && this.data.height.indexOf( '%' ) !== -1 ) {
				css.height = ( parseInt( this.data.height, 10 ) / this.scaleRatio ).toString() + '%';
			}

			this.$layer.css( css );
		},

		// Show the layer
		show: function( callback ) {
			if ( this.visible === true ) {
				return;
			}

			this.visible = true;

			// First, style the layer if it's not already styled
			if ( this.styled === false ) {
				this._setStyle();
			}

			var that = this,
				offset = typeof this.data.showOffset !== 'undefined' ? this.data.showOffset : 50,
				duration = typeof this.data.showDuration !== 'undefined' ? this.data.showDuration / 1000 : 0.4,
				delay = typeof this.data.showDelay !== 'undefined' ? this.data.showDelay : 10,
				stayDuration = typeof that.data.stayDuration !== 'undefined' ? parseInt( that.data.stayDuration, 10 ) : -1;

			// Animate the layers with CSS3 or with JavaScript
			if ( this.supportedAnimation === 'javascript' ) {
				this.$layer
					.stop()
					.delay( delay )
					.css({ 'opacity': 0, 'visibility': 'visible' })
					.animate( { 'opacity': 1 }, duration * 1000, function() {

						// Hide the layer after a given time interval
						if ( stayDuration !== -1 ) {
							that.stayTimer = setTimeout(function() {
								that.hide();
								that.stayTimer = null;
							}, stayDuration );
						}

						if ( typeof callback !== 'undefined' ) {
							callback();
						}
					});
			} else {
				var start = { 'opacity': 0, 'visibility': 'visible' },
					target = { 'opacity': 1 },
					transformValues = '';

				start[ this.vendorPrefix + 'transform' ] = 'scale(' + this.scaleRatio + ')';
				target[ this.vendorPrefix + 'transform' ] = 'scale(' + this.scaleRatio + ')';
				target[ this.vendorPrefix + 'transition' ] = 'opacity ' + duration + 's';

				if ( typeof this.data.showTransition !== 'undefined' ) {
					if ( this.data.showTransition === 'left' ) {
						transformValues = offset + 'px, 0';
					} else if ( this.data.showTransition === 'right' ) {
						transformValues = '-' + offset + 'px, 0';
					} else if ( this.data.showTransition === 'up' ) {
						transformValues = '0, ' + offset + 'px';
					} else if ( this.data.showTransition === 'down') {
						transformValues = '0, -' + offset + 'px';
					}

					start[ this.vendorPrefix + 'transform' ] += this.supportedAnimation === 'css-3d' ? ' translate3d(' + transformValues + ', 0)' : ' translate(' + transformValues + ')';
					target[ this.vendorPrefix + 'transform' ] += this.supportedAnimation === 'css-3d' ? ' translate3d(0, 0, 0)' : ' translate(0, 0)';
					target[ this.vendorPrefix + 'transition' ] += ', ' + this.vendorPrefix + 'transform ' + duration + 's';
				}

				// Listen when the layer animation is complete
				this.$layer.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}

					that.$layer
						.off( that.transitionEvent )
						.css( that.vendorPrefix + 'transition', '' );

					// Hide the layer after a given time interval
					if ( stayDuration !== -1 ) {
						that.stayTimer = setTimeout(function() {
							that.hide();
							that.stayTimer = null;
						}, stayDuration );
					}

					if ( typeof callback !== 'undefined' ) {
						callback();
					}
				});

				this.$layer.css( start );

				setTimeout( function() {
					that.$layer.css( target );
				}, delay );
			}
		},

		// Hide the layer
		hide: function( callback ) {
			if ( this.visible === false ) {
				return;
			}

			var that = this,
				offset = typeof this.data.hideOffset !== 'undefined' ? this.data.hideOffset : 50,
				duration = typeof this.data.hideDuration !== 'undefined' ? this.data.hideDuration / 1000 : 0.4,
				delay = typeof this.data.hideDelay !== 'undefined' ? this.data.hideDelay : 10;

			this.visible = false;

			// If the layer is hidden before it hides automatically, clear the timer
			if ( this.stayTimer !== null ) {
				clearTimeout( this.stayTimer );
			}

			// Animate the layers with CSS3 or with JavaScript
			if ( this.supportedAnimation === 'javascript' ) {
				this.$layer
					.stop()
					.delay( delay )
					.animate({ 'opacity': 0 }, duration * 1000, function() {
						$( this ).css( 'visibility', 'hidden' );

						if ( typeof callback !== 'undefined' ) {
							callback();
						}
					});
			} else {
				var transformValues = '',
					target = { 'opacity': 0 };

				target[ this.vendorPrefix + 'transform' ] = 'scale(' + this.scaleRatio + ')';
				target[ this.vendorPrefix + 'transition' ] = 'opacity ' + duration + 's';

				if ( typeof this.data.hideTransition !== 'undefined' ) {
					if ( this.data.hideTransition === 'left' ) {
						transformValues = '-' + offset + 'px, 0';
					} else if ( this.data.hideTransition === 'right' ) {
						transformValues = offset + 'px, 0';
					} else if ( this.data.hideTransition === 'up' ) {
						transformValues = '0, -' + offset + 'px';
					} else if ( this.data.hideTransition === 'down' ) {
						transformValues = '0, ' + offset + 'px';
					}

					target[ this.vendorPrefix + 'transform' ] += this.supportedAnimation === 'css-3d' ? ' translate3d(' + transformValues + ', 0)' : ' translate(' + transformValues + ')';
					target[ this.vendorPrefix + 'transition' ] += ', ' + this.vendorPrefix + 'transform ' + duration + 's';
				}

				// Listen when the layer animation is complete
				this.$layer.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}

					that.$layer
						.off( that.transitionEvent )
						.css( that.vendorPrefix + 'transition', '' );

					// Hide the layer after transition
					if ( that.visible === false ) {
						that.$layer.css( 'visibility', 'hidden' );
					}

					if ( typeof callback !== 'undefined' ) {
						callback();
					}
				});

				setTimeout( function() {
					that.$layer.css( target );
				}, delay );
			}
		},

		isVisible: function() {
			if ( this.visible === false || this.$layer.is( ':hidden' ) ) {
				return false;
			}

			return true;
		},

		// Destroy the layer
		destroy: function() {
			this.$layer.removeAttr( 'style' );
			this.$layer.removeAttr( 'data-layer-init' );
		}
	};

	$.SliderPro.addModule( 'Layers', Layers );
	
})( window, jQuery );

// Fade module for Slider Pro.
// 
// Adds the possibility to navigate through slides using a cross-fade effect.
;(function( window, $ ) {

	"use strict";

	var NS = 'Fade.' + $.SliderPro.namespace;

	var Fade = {

		// Reference to the original 'gotoSlide' method
		fadeGotoSlideReference: null,

		initFade: function() {
			this.on( 'update.' + NS, $.proxy( this._fadeOnUpdate, this ) );
		},

		// If fade is enabled, store a reference to the original 'gotoSlide' method
		// and then assign a new function to 'gotoSlide'.
		_fadeOnUpdate: function() {
			if ( this.settings.fade === true ) {
				this.fadeGotoSlideReference = this.gotoSlide;
				this.gotoSlide = this._fadeGotoSlide;
			}
		},

		// Will replace the original 'gotoSlide' function by adding a cross-fade effect
		// between the previous and the next slide.
		_fadeGotoSlide: function( index ) {
			if ( index === this.selectedSlideIndex ) {
				return;
			}
			
			// If the slides are being swiped/dragged, don't use fade, but call the original method instead.
			// If not, which means that a new slide was selected through a button, arrows or direct call, then
			// use fade.
			if ( this.$slider.hasClass( 'sp-swiping' ) ) {
				this.fadeGotoSlideReference( index );
			} else {
				var that = this,
					$nextSlide,
					$previousSlide,
					newIndex = index;

				// Loop through all the slides and overlap the the previous and next slide,
				// and hide the other slides.
				$.each( this.slides, function( index, element ) {
					var slideIndex = element.getIndex(),
						$slide = element.$slide;

					if ( slideIndex === newIndex ) {
						$slide.css({ 'opacity': 0, 'left': 0, 'top': 0, 'z-index': 20 });
						$nextSlide = $slide;
					} else if ( slideIndex === that.selectedSlideIndex ) {
						$slide.css({ 'opacity': 1, 'left': 0, 'top': 0, 'z-index': 10 });
						$previousSlide = $slide;
					} else {
						$slide.css( 'visibility', 'hidden' );
					}
				});

				// Set the new indexes for the previous and selected slides
				this.previousSlideIndex = this.selectedSlideIndex;
				this.selectedSlideIndex = index;

				// Re-assign the 'sp-selected' class to the currently selected slide
				this.$slides.find( '.sp-selected' ).removeClass( 'sp-selected' );
				this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected' );
			
				// Rearrange the slides if the slider is loopable
				if ( that.settings.loop === true ) {
					that._updateSlidesOrder();
				}

				// Move the slides container so that the cross-fading slides (which now have the top and left
				// position set to 0) become visible and in the center of the slider.
				this._moveTo( this.visibleOffset, true );

				// Fade out the previous slide, if indicated, in addition to fading in the next slide
				if ( this.settings.fadeOutPreviousSlide === true ) {
					this._fadeSlideTo( $previousSlide, 0 );
				}

				// Fade in the selected slide
				this._fadeSlideTo( $nextSlide, 1, function() {

					// After the animation is over, make all the slides visible again
					$.each( that.slides, function( index, element ) {
						var $slide = element.$slide;
						$slide.css({ 'visibility': '', 'opacity': '', 'z-index': '' });
					});
					
					// Reset the position of the slides and slides container
					that._resetSlidesPosition();

					// Fire the 'gotoSlideComplete' event
					that.trigger({ type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex });
					if ( $.isFunction( that.settings.gotoSlideComplete ) ) {
						that.settings.gotoSlideComplete.call( that, { type: 'gotoSlideComplete', index: index, previousIndex: that.previousSlideIndex } );
					}
				});

				if ( this.settings.autoHeight === true ) {
					this._resizeHeight();
				}

				// Fire the 'gotoSlide' event
				this.trigger({ type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex });
				if ( $.isFunction( this.settings.gotoSlide ) ) {
					this.settings.gotoSlide.call( this, { type: 'gotoSlide', index: index, previousIndex: this.previousSlideIndex });
				}
			}
		},

		// Fade the target slide to the specified opacity (0 or 1)
		_fadeSlideTo: function( target, opacity, callback ) {
			var that = this;

			// Use CSS transitions if they are supported. If not, use JavaScript animation.
			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {

				// There needs to be a delay between the moment the opacity is set
				// and the moment the transitions starts.
				setTimeout(function(){
					var css = { 'opacity': opacity };
					css[ that.vendorPrefix + 'transition' ] = 'opacity ' + that.settings.fadeDuration / 1000 + 's';
					target.css( css );
				}, 100 );

				target.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}
					
					target.off( that.transitionEvent );
					target.css( that.vendorPrefix + 'transition', '' );

					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			} else {
				target.stop().animate({ 'opacity': opacity }, this.settings.fadeDuration, function() {
					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			}
		},

		// Destroy the module
		destroyFade: function() {
			this.off( 'update.' + NS );

			if ( this.fadeGotoSlideReference !== null ) {
				this.gotoSlide = this.fadeGotoSlideReference;
			}
		},

		fadeDefaults: {

			// Indicates if fade will be used
			fade: false,

			// Indicates if the previous slide will be faded out (in addition to the next slide being faded in)
			fadeOutPreviousSlide: true,

			// Sets the duration of the fade effect
			fadeDuration: 500
		}
	};

	$.SliderPro.addModule( 'Fade', Fade );

})( window, jQuery );

// Touch Swipe module for Slider Pro.
// 
// Adds touch-swipe functionality for slides.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'TouchSwipe.' + $.SliderPro.namespace;

	var TouchSwipe = {

		// The x and y coordinates of the pointer/finger's starting position
		touchStartPoint: {x: 0, y: 0},

		// The x and y coordinates of the pointer/finger's end position
		touchEndPoint: {x: 0, y: 0},

		// The distance from the starting to the end position on the x and y axis
		touchDistance: {x: 0, y: 0},

		// The position of the slides when the touch swipe starts
		touchStartPosition: 0,

		// Indicates if the slides are being swiped
		isTouchMoving: false,

		// Stores the names of the events
		touchSwipeEvents: { startEvent: '', moveEvent: '', endEvent: '' },

		initTouchSwipe: function() {
			var that = this;

			// check if touch swipe is enabled
			if ( this.settings.touchSwipe === false ) {
				return;
			}

			this.touchSwipeEvents.startEvent = 'touchstart' + '.' + NS + ' mousedown' + '.' + NS;
			this.touchSwipeEvents.moveEvent = 'touchmove' + '.' + NS + ' mousemove' + '.' + NS;
			this.touchSwipeEvents.endEvent = 'touchend' + '.' + this.uniqueId + '.' + NS + ' mouseup' + '.' + this.uniqueId + '.' + NS;

			// Listen for touch swipe/mouse move events
			this.$slidesMask.on( this.touchSwipeEvents.startEvent, $.proxy( this._onTouchStart, this ) );
			this.$slidesMask.on( 'dragstart.' + NS, function( event ) {
				event.preventDefault();
			});

			// Add the grabbing icon
			this.$slidesMask.addClass( 'sp-grab' );
		},

		// Called when the slides starts being dragged
		_onTouchStart: function( event ) {
		
			// Disable dragging if the element is set to allow selections
			if ( $( event.target ).closest( '.sp-selectable' ).length >= 1 ) {
				return;
			}

			var that = this,
				eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Prevent default behavior only for mouse events
			if ( typeof event.originalEvent.touches === 'undefined' ) {
				event.preventDefault();
			}

			// Disable click events on links
			$( event.target ).parents( '.sp-slide' ).find( 'a' ).one( 'click.' + NS, function( event ) {
				event.preventDefault();
			});

			// Get the initial position of the mouse pointer and the initial position
			// of the slides' container
			this.touchStartPoint.x = eventObject.pageX || eventObject.clientX;
			this.touchStartPoint.y = eventObject.pageY || eventObject.clientY;
			this.touchStartPosition = this.slidesPosition;

			// Clear the previous distance values
			this.touchDistance.x = this.touchDistance.y = 0;

			// If the slides are being grabbed while they're still animating, stop the
			// current movement
			if ( this.$slides.hasClass( 'sp-animated' ) ) {
				this.isTouchMoving = true;
				this._stopMovement();
				this.touchStartPosition = this.slidesPosition;
			}

			// Listen for move and end events
			this.$slidesMask.on( this.touchSwipeEvents.moveEvent, $.proxy( this._onTouchMove, this ) );
			$( document ).on( this.touchSwipeEvents.endEvent, $.proxy( this._onTouchEnd, this ) );

			// Swap grabbing icons
			this.$slidesMask.removeClass( 'sp-grab' ).addClass( 'sp-grabbing' );

			// Add 'sp-swiping' class to indicate that the slides are being swiped
			this.$slider.addClass( 'sp-swiping' );
		},

		// Called during the slides' dragging
		_onTouchMove: function( event ) {
			var eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Indicate that the move event is being fired
			this.isTouchMoving = true;

			// Get the current position of the mouse pointer
			this.touchEndPoint.x = eventObject.pageX || eventObject.clientX;
			this.touchEndPoint.y = eventObject.pageY || eventObject.clientY;

			// Calculate the distance of the movement on both axis
			this.touchDistance.x = this.touchEndPoint.x - this.touchStartPoint.x;
			this.touchDistance.y = this.touchEndPoint.y - this.touchStartPoint.y;
			
			// Calculate the distance of the swipe that takes place in the same direction as the orientation of the slides
			// and calculate the distance from the opposite direction.
			// 
			// For a swipe to be valid there should more distance in the same direction as the orientation of the slides.
			var distance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y,
				oppositeDistance = this.settings.orientation === 'horizontal' ? this.touchDistance.y : this.touchDistance.x;

			// If the movement is in the same direction as the orientation of the slides, the swipe is valid
			if ( Math.abs( distance ) > Math.abs( oppositeDistance ) ) {
				event.preventDefault();
			} else {
				return;
			}

			if ( this.settings.loop === false ) {
				// Make the slides move slower if they're dragged outside its bounds
				if ( ( this.slidesPosition > this.touchStartPosition && this.selectedSlideIndex === 0 ) ||
					( this.slidesPosition < this.touchStartPosition && this.selectedSlideIndex === this.getTotalSlides() - 1 )
				) {
					distance = distance * 0.2;
				}
			}

			this._moveTo( this.touchStartPosition + distance, true );
		},

		// Called when the slides are released
		_onTouchEnd: function( event ) {
			var that = this,
				touchDistance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y;

			// Remove the move and end listeners
			this.$slidesMask.off( this.touchSwipeEvents.moveEvent );
			$( document ).off( this.touchSwipeEvents.endEvent );

			// Swap grabbing icons
			this.$slidesMask.removeClass( 'sp-grabbing' ).addClass( 'sp-grab' );

			// Check if there is intention for a tap
			if ( this.isTouchMoving === false || this.isTouchMoving === true && Math.abs( this.touchDistance.x ) < 10 && Math.abs( this.touchDistance.y ) < 10 ) {
				// Re-enable click events on links
				$( event.target ).parents( '.sp-slide' ).find( 'a' ).off( 'click.' + NS );
				this.$slider.removeClass( 'sp-swiping' );
			}

			// Remove the 'sp-swiping' class but with a delay
			// because there might be other event listeners that check
			// the existence of this class, and this class should still be 
			// applied for those listeners, since there was a swipe event
			setTimeout(function() {
				that.$slider.removeClass( 'sp-swiping' );
			}, 1 );

			// Return if the slides didn't move
			if ( this.isTouchMoving === false ) {
				return;
			}

			this.isTouchMoving = false;

			$( event.target ).parents( '.sp-slide' ).one( 'click', function( event ) {
				event.preventDefault();
			});

			// Calculate the old position of the slides in order to return to it if the swipe
			// is below the threshold
			var oldSlidesPosition = - parseInt( this.$slides.find( '.sp-slide' ).eq( this.selectedSlideIndex ).css( this.positionProperty ), 10 ) + this.visibleOffset;

			if ( Math.abs( touchDistance ) < this.settings.touchSwipeThreshold ) {
				this._moveTo( oldSlidesPosition );
			} else {

				// Calculate by how many slides the slides container has moved
				var slideArrayDistance = touchDistance / ( this.slideSize + this.settings.slideDistance );

				// Floor the obtained value and add or subtract 1, depending on the direction of the swipe
				slideArrayDistance = parseInt( slideArrayDistance, 10 ) + ( slideArrayDistance > 0 ? 1 : - 1 );

				// Get the index of the currently selected slide and subtract the position index in order to obtain
				// the new index of the selected slide. 
				var nextSlideIndex = this.slidesOrder[ $.inArray( this.selectedSlideIndex, this.slidesOrder ) - slideArrayDistance ];

				if ( this.settings.loop === true ) {
					this.gotoSlide( nextSlideIndex );
				} else {
					if ( typeof nextSlideIndex !== 'undefined' ) {
						this.gotoSlide( nextSlideIndex );
					} else {
						this._moveTo( oldSlidesPosition );
					}
				}
			}
		},

		// Destroy the module
		destroyTouchSwipe: function() {
			this.$slidesMask.off( this.touchSwipeEvents.startEvent );
			this.$slidesMask.off( this.touchSwipeEvents.moveEvent );
			this.$slidesMask.off( 'dragstart.' + NS );
			$( document ).off( this.touchSwipeEvents.endEvent );
			this.$slidesMask.removeClass( 'sp-grab' );
		},

		touchSwipeDefaults: {
			
			// Indicates whether the touch swipe will be enabled
			touchSwipe: true,

			// Sets the minimum amount that the slides should move
			touchSwipeThreshold: 50
		}
	};

	$.SliderPro.addModule( 'TouchSwipe', TouchSwipe );
	
})( window, jQuery );

// Caption module for Slider Pro.
// 
// Adds a corresponding caption for each slide. The caption
// will appear and disappear with the slide.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Caption.' + $.SliderPro.namespace;

	var Caption = {

		// Reference to the container element that will hold the caption
		$captionContainer: null,

		// The caption content/text
		captionContent: '',

		initCaption: function() {
			this.on( 'update.' + NS, $.proxy( this._captionOnUpdate, this ) );
			this.on( 'gotoSlide.' + NS, $.proxy( this._updateCaptionContent, this ) );
		},

		// Create the caption container and hide the captions inside the slides
		_captionOnUpdate: function() {
			this.$captionContainer = this.$slider.find( '.sp-caption-container' );

			if ( this.$slider.find( '.sp-caption' ).length && this.$captionContainer.length === 0 ) {
				this.$captionContainer = $( '<div class="sp-caption-container"></div>' ).appendTo( this.$slider );

				// Show the caption for the selected slide
				this._updateCaptionContent();
			}

			// Hide the captions inside the slides
			this.$slides.find( '.sp-caption' ).each(function() {
				$( this ).css( 'display', 'none' );
			});
		},

		// Show the caption content for the selected slide
		_updateCaptionContent: function() {
			var that = this,
				newCaptionField = this.$slider.find( '.sp-slide' ).eq( this.selectedSlideIndex ).find( '.sp-caption' ),
				newCaptionContent = newCaptionField.length !== 0 ? newCaptionField.html() : '';

			// Either use a fade effect for swapping the captions or use an instant change
			if ( this.settings.fadeCaption === true ) {
				
				// If the previous slide had a caption, fade out that caption first and when the animation is over
				// fade in the current caption.
				// If the previous slide didn't have a caption, fade in the current caption directly.
				if ( this.captionContent !== '' ) {

					// If the caption container has 0 opacity when the fade out transition starts, set it
					// to 1 because the transition wouldn't work if the initial and final values are the same,
					// and the callback functions wouldn't fire in this case.
					if ( parseFloat( this.$captionContainer.css( 'opacity' ), 10 ) === 0 ) {
						this.$captionContainer.css( this.vendorPrefix + 'transition', '' );
						this.$captionContainer.css( 'opacity', 1 );
					}

					this._fadeCaptionTo( 0, function() {
						that.captionContent = newCaptionContent;

						if ( newCaptionContent !== '' ) {
							that.$captionContainer.html( that.captionContent );
							that._fadeCaptionTo( 1 );
						} else {
							that.$captionContainer.empty();
						}
					});
				} else {
					this.captionContent = newCaptionContent;
					this.$captionContainer.html( this.captionContent );
					this.$captionContainer.css( 'opacity', 0 );
					this._fadeCaptionTo( 1 );
				}
			} else {
				this.captionContent = newCaptionContent;
				this.$captionContainer.html( this.captionContent );
			}
		},

		// Fade the caption container to the specified opacity
		_fadeCaptionTo: function( opacity, callback ) {
			var that = this;

			// Use CSS transitions if they are supported. If not, use JavaScript animation.
			if ( this.supportedAnimation === 'css-3d' || this.supportedAnimation === 'css-2d' ) {
				
				// There needs to be a delay between the moment the opacity is set
				// and the moment the transitions starts.
				setTimeout(function(){
					var css = { 'opacity': opacity };
					css[ that.vendorPrefix + 'transition' ] = 'opacity ' + that.settings.captionFadeDuration / 1000 + 's';
					that.$captionContainer.css( css );
				}, 1 );

				this.$captionContainer.on( this.transitionEvent, function( event ) {
					if ( event.target !== event.currentTarget ) {
						return;
					}

					that.$captionContainer.off( that.transitionEvent );
					that.$captionContainer.css( that.vendorPrefix + 'transition', '' );

					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			} else {
				this.$captionContainer.stop().animate({ 'opacity': opacity }, this.settings.captionFadeDuration, function() {
					if ( typeof callback === 'function' ) {
						callback();
					}
				});
			}
		},

		// Destroy the module
		destroyCaption: function() {
			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );

			this.$captionContainer.remove();

			this.$slider.find( '.sp-caption' ).each(function() {
				$( this ).css( 'display', '' );
			});
		},

		captionDefaults: {

			// Indicates whether or not the captions will be faded
			fadeCaption: true,

			// Sets the duration of the fade animation
			captionFadeDuration: 500
		}
	};

	$.SliderPro.addModule( 'Caption', Caption );
	
})( window, jQuery );

// Deep Linking module for Slider Pro.
// 
// Updates the hash of the URL as the user navigates through the slides.
// Also, allows navigating to a specific slide by indicating it in the hash.
;(function( window, $ ) {

	"use strict";

	var NS = 'DeepLinking.' + $.SliderPro.namespace;

	var DeepLinking = {

		initDeepLinking: function() {
			var that = this;

			// Parse the initial hash
			this.on( 'init.' + NS, function() {
				that._gotoHash( window.location.hash );
			});

			// Update the hash when a new slide is selected
			this.on( 'gotoSlide.' + NS, function( event ) {
				if ( that.settings.updateHash === true ) {

					// get the 'id' attribute of the slide
					var slideId = that.$slider.find( '.sp-slide' ).eq( event.index ).attr( 'id' );

					// if the slide doesn't have an 'id' attribute, use the slide index
					if ( typeof slideId === 'undefined' ) {
						slideId = event.index;
					}

					window.location.hash = that.$slider.attr( 'id' ) + '/' + slideId;
				}
			});

			// Check when the hash changes and navigate to the indicated slide
			$( window ).on( 'hashchange.' + this.uniqueId + '.' + NS, function() {
				that._gotoHash( window.location.hash );
			});
		},

		// Parse the hash and return the slider id and the slide id
		_parseHash: function( hash ) {
			if ( hash !== '' ) {
				// Eliminate the # symbol
				hash = hash.substring(1);

				// Get the specified slider id and slide id
				var values = hash.split( '/' ),
					slideId = values.pop(),
					sliderId = hash.slice( 0, - slideId.toString().length - 1 );

				if ( this.$slider.attr( 'id' ) === sliderId ) {
					return { 'sliderID': sliderId, 'slideId': slideId };
				}
			}

			return false;
		},

		// Navigate to the appropriate slide, based on the specified hash
		_gotoHash: function( hash ) {
			var result = this._parseHash( hash );

			if ( result === false ) {
				return;
			}

			var slideId = result.slideId,
				slideIdNumber = parseInt( slideId, 10 );

			// check if the specified slide id is a number or string
			if ( isNaN( slideIdNumber ) ) {
				// get the index of the slide based on the specified id
				var slideIndex = this.$slider.find( '.sp-slide#' + slideId ).index();

				if ( slideIndex !== -1 && slideIndex !== this.selectedSlideIndex ) {
					this.gotoSlide( slideIndex );
				}
			} else if ( slideIdNumber !== this.selectedSlideIndex ) {
				this.gotoSlide( slideIdNumber );
			}
		},

		// Destroy the module
		destroyDeepLinking: function() {
			this.off( 'init.' + NS );
			this.off( 'gotoSlide.' + NS );
			$( window ).off( 'hashchange.' + this.uniqueId + '.' + NS );
		},

		deepLinkingDefaults: {

			// Indicates whether the hash will be updated when a new slide is selected
			updateHash: false
		}
	};

	$.SliderPro.addModule( 'DeepLinking', DeepLinking );
	
})( window, jQuery );

// Autoplay module for Slider Pro.
// 
// Adds automatic navigation through the slides by calling the
// 'nextSlide' or 'previousSlide' methods at certain time intervals.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Autoplay.' + $.SliderPro.namespace;

	var Autoplay = {

		autoplayTimer: null,

		isTimerRunning: false,

		isTimerPaused: false,

		initAutoplay: function() {
			this.on( 'update.' + NS, $.proxy( this._autoplayOnUpdate, this ) );
		},

		// Start the autoplay if it's enabled, or stop it if it's disabled but running 
		_autoplayOnUpdate: function( event ) {
			if ( this.settings.autoplay === true ) {
				this.on( 'gotoSlide.' + NS, $.proxy( this._autoplayOnGotoSlide, this ) );
				this.on( 'mouseenter.' + NS, $.proxy( this._autoplayOnMouseEnter, this ) );
				this.on( 'mouseleave.' + NS, $.proxy( this._autoplayOnMouseLeave, this ) );

				this.startAutoplay();
			} else {
				this.off( 'gotoSlide.' + NS );
				this.off( 'mouseenter.' + NS );
				this.off( 'mouseleave.' + NS );

				this.stopAutoplay();
			}
		},

		// Restart the autoplay timer when a new slide is selected
		_autoplayOnGotoSlide: function( event ) {
			// stop previous timers before starting a new one
			if ( this.isTimerRunning === true ) {
				this.stopAutoplay();
			}
			
			if ( this.isTimerPaused === false ) {
				this.startAutoplay();
			}
		},

		// Pause the autoplay when the slider is hovered
		_autoplayOnMouseEnter: function( event ) {
			if ( this.isTimerRunning && ( this.settings.autoplayOnHover === 'pause' || this.settings.autoplayOnHover === 'stop' ) ) {
				this.stopAutoplay();
				this.isTimerPaused = true;
			}
		},

		// Start the autoplay when the mouse moves away from the slider
		_autoplayOnMouseLeave: function( event ) {
			if ( this.settings.autoplay === true && this.isTimerRunning === false && this.settings.autoplayOnHover !== 'stop' ) {
				this.startAutoplay();
				this.isTimerPaused = false;
			}
		},

		// Starts the autoplay
		startAutoplay: function() {
			var that = this;
			
			this.isTimerRunning = true;

			this.autoplayTimer = setTimeout(function() {
				if ( that.settings.autoplayDirection === 'normal' ) {
					that.nextSlide();
				} else if ( that.settings.autoplayDirection === 'backwards' ) {
					that.previousSlide();
				}
			}, this.settings.autoplayDelay );
		},

		// Stops the autoplay
		stopAutoplay: function() {
			this.isTimerRunning = false;
			this.isTimerPaused = false;

			clearTimeout( this.autoplayTimer );
		},

		// Destroy the module
		destroyAutoplay: function() {
			clearTimeout( this.autoplayTimer );

			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );
			this.off( 'mouseenter.' + NS );
			this.off( 'mouseleave.' + NS );
		},

		autoplayDefaults: {
			// Indicates whether or not autoplay will be enabled
			autoplay: true,

			// Sets the delay/interval at which the autoplay will run
			autoplayDelay: 5000,

			// Indicates whether autoplay will navigate to the next slide or previous slide
			autoplayDirection: 'normal',

			// Indicates if the autoplay will be paused or stopped when the slider is hovered.
			// Possible values are 'pause', 'stop' or 'none'.
			autoplayOnHover: 'pause'
		}
	};

	$.SliderPro.addModule( 'Autoplay', Autoplay );
	
})(window, jQuery);

// Keyboard module for Slider Pro.
// 
// Adds the possibility to navigate through slides using the keyboard arrow keys, or
// open the link attached to the main slide image by using the Enter key.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Keyboard.' + $.SliderPro.namespace;

	var Keyboard = {

		initKeyboard: function() {
			var that = this,
				hasFocus = false;

			if ( this.settings.keyboard === false ) {
				return;
			}

			// Detect when the slide is in focus and when it's not, and, optionally, make it
			// responsive to keyboard input only when it's in focus
			this.$slider.on( 'focus.' + NS, function() {
				hasFocus = true;
			});

			this.$slider.on( 'blur.' + NS, function() {
				hasFocus = false;
			});

			$( document ).on( 'keydown.' + this.uniqueId + '.' + NS, function( event ) {
				if ( that.settings.keyboardOnlyOnFocus === true && hasFocus === false ) {
					return;
				}

				// If the left arrow key is pressed, go to the previous slide.
				// If the right arrow key is pressed, go to the next slide.
				// If the Enter key is pressed, open the link attached to the main slide image.
				if ( event.which === 37 ) {
					that.previousSlide();
				} else if ( event.which === 39 ) {
					that.nextSlide();
				} else if ( event.which === 13 ) {
					that.$slider.find( '.sp-slide' ).eq( that.selectedSlideIndex ).find( '.sp-image-container a' )[0].click();
				}
			});
		},

		// Destroy the module
		destroyKeyboard: function() {
			this.$slider.off( 'focus.' + NS );
			this.$slider.off( 'blur.' + NS );
			$( document ).off( 'keydown.' + this.uniqueId + '.' + NS );
		},

		keyboardDefaults: {

			// Indicates whether keyboard navigation will be enabled
			keyboard: true,

			// Indicates whether the slider will respond to keyboard input only when
			// the slider is in focus.
			keyboardOnlyOnFocus: false
		}
	};

	$.SliderPro.addModule( 'Keyboard', Keyboard );
	
})( window, jQuery );

// Full Screen module for Slider Pro.
// 
// Adds the possibility to open the slider full-screen, using the HMTL5 FullScreen API.
;(function( window, $ ) {

	"use strict";

	var NS = 'FullScreen.' + $.SliderPro.namespace;

	var FullScreen = {

		// Indicates whether the slider is currently in full-screen mode
		isFullScreen: false,

		// Reference to the full-screen button
		$fullScreenButton: null,

		// Reference to a set of settings that influence the slider's size
		// before it goes full-screen
		sizeBeforeFullScreen: {},

		initFullScreen: function() {
			if ( ! ( document.fullscreenEnabled ||
				document.webkitFullscreenEnabled ||
				document.mozFullScreenEnabled ||
				document.msFullscreenEnabled ) ) {
				return;
			}
		
			this.on( 'update.' + NS, $.proxy( this._fullScreenOnUpdate, this ) );
		},

		// Create or remove the full-screen button depending on the value of the 'fullScreen' option
		_fullScreenOnUpdate: function() {
			if ( this.settings.fullScreen === true && this.$fullScreenButton === null ) {
				this._addFullScreen();
			} else if ( this.settings.fullScreen === false && this.$fullScreenButton !== null ) {
				this._removeFullScreen();
			}

			if ( this.settings.fullScreen === true ) {
				if ( this.settings.fadeFullScreen === true ) {
					this.$fullScreenButton.addClass( 'sp-fade-full-screen' );
				} else if ( this.settings.fadeFullScreen === false ) {
					this.$fullScreenButton.removeClass( 'sp-fade-full-screen' );
				}
			}
		},

		// Create the full-screen button
		_addFullScreen: function() {
			this.$fullScreenButton = $('<div class="sp-full-screen-button"></div>').appendTo( this.$slider );
			this.$fullScreenButton.on( 'click.' + NS, $.proxy( this._onFullScreenButtonClick, this ) );

			document.addEventListener( 'fullscreenchange', $.proxy( this._onFullScreenChange, this ) );
			document.addEventListener( 'mozfullscreenchange', $.proxy( this._onFullScreenChange, this ) );
			document.addEventListener( 'webkitfullscreenchange', $.proxy( this._onFullScreenChange, this ) );
			document.addEventListener( 'MSFullscreenChange', $.proxy( this._onFullScreenChange, this ) );
		},

		// Remove the full-screen button
		_removeFullScreen: function() {
			if ( this.$fullScreenButton !== null ) {
				this.$fullScreenButton.off( 'click.' + NS );
				this.$fullScreenButton.remove();
				this.$fullScreenButton = null;
				document.removeEventListener( 'fullscreenchange', this._onFullScreenChange );
				document.removeEventListener( 'mozfullscreenchange', this._onFullScreenChange );
				document.removeEventListener( 'webkitfullscreenchange', this._onFullScreenChange );
				document.removeEventListener( 'MSFullscreenChange', this._onFullScreenChange );
			}
		},

		// When the full-screen button is clicked, put the slider into full-screen mode, and
		// take it out of the full-screen mode when it's clicked again.
		_onFullScreenButtonClick: function() {
			if ( this.isFullScreen === false ) {
				if ( this.instance.requestFullScreen ) {
					this.instance.requestFullScreen();
				} else if ( this.instance.mozRequestFullScreen ) {
					this.instance.mozRequestFullScreen();
				} else if ( this.instance.webkitRequestFullScreen ) {
					this.instance.webkitRequestFullScreen();
				} else if ( this.instance.msRequestFullscreen ) {
					this.instance.msRequestFullscreen();
				}
			} else {
				if ( document.exitFullScreen ) {
					document.exitFullScreen();
				} else if ( document.mozCancelFullScreen ) {
					document.mozCancelFullScreen();
				} else if ( document.webkitCancelFullScreen ) {
					document.webkitCancelFullScreen();
				} else if ( document.msExitFullscreen ) {
					document.msExitFullscreen();
				}
			}
		},

		// This will be called whenever the full-screen mode changes.
		// If the slider is in full-screen mode, set it to 'full window', and if it's
		// not in full-screen mode anymore, set it back to the original size.
		_onFullScreenChange: function() {
			this.isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement ? true : false;

			if ( this.isFullScreen === true ) {
				this.sizeBeforeFullScreen = { forceSize: this.settings.forceSize, autoHeight: this.settings.autoHeight };
				this.$slider.addClass( 'sp-full-screen' );
				this.settings.forceSize = 'fullWindow';
				this.settings.autoHeight = false;
			} else {
				this.$slider.css( 'margin', '' );
				this.$slider.removeClass( 'sp-full-screen' );
				this.settings.forceSize = this.sizeBeforeFullScreen.forceSize;
				this.settings.autoHeight = this.sizeBeforeFullScreen.autoHeight;
			}

			this.resize();
		},

		// Destroy the module
		destroyFullScreen: function() {
			this.off( 'update.' + NS );
			this._removeFullScreen();
		},

		fullScreenDefaults: {

			// Indicates whether the full-screen button is enabled
			fullScreen: false,

			// Indicates whether the button will fade in only on hover
			fadeFullScreen: true
		}
	};

	$.SliderPro.addModule( 'FullScreen', FullScreen );

})( window, jQuery );

// Buttons module for Slider Pro.
// 
// Adds navigation buttons at the bottom of the slider.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Buttons.' + $.SliderPro.namespace;

	var Buttons = {

		// Reference to the buttons container
		$buttons: null,

		initButtons: function() {
			this.on( 'update.' + NS, $.proxy( this._buttonsOnUpdate, this ) );
		},

		_buttonsOnUpdate: function() {
			this.$buttons = this.$slider.find('.sp-buttons');
			
			// If there is more that one slide but the buttons weren't created yet, create the buttons.
			// If the buttons were created but their number differs from the total number of slides, re-create the buttons.
			// If the buttons were created but there are less than one slide, remove the buttons.s
			if ( this.settings.buttons === true && this.getTotalSlides() > 1 && this.$buttons.length === 0 ) {
				this._createButtons();
			} else if ( this.settings.buttons === true && this.getTotalSlides() !== this.$buttons.find( '.sp-button' ).length && this.$buttons.length !== 0 ) {
				this._adjustButtons();
			} else if ( this.settings.buttons === false || ( this.getTotalSlides() <= 1 && this.$buttons.length !== 0 ) ) {
				this._removeButtons();
			}
		},

		// Create the buttons
		_createButtons: function() {
			var that = this;

			// Create the buttons' container
			this.$buttons = $( '<div class="sp-buttons"></div>' ).appendTo( this.$slider );

			// Create the buttons
			for ( var i = 0; i < this.getTotalSlides(); i++ ) {
				$( '<div class="sp-button"></div>' ).appendTo( this.$buttons );
			}

			// Listen for button clicks 
			this.$buttons.on( 'click.' + NS, '.sp-button', function() {
				that.gotoSlide( $( this ).index() );
			});

			// Set the initially selected button
			this.$buttons.find( '.sp-button' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected-button' );

			// Select the corresponding button when the slide changes
			this.on( 'gotoSlide.' + NS, function( event ) {
				that.$buttons.find( '.sp-selected-button' ).removeClass( 'sp-selected-button' );
				that.$buttons.find( '.sp-button' ).eq( event.index ).addClass( 'sp-selected-button' );
			});

			// Indicate that the slider has buttons 
			this.$slider.addClass( 'sp-has-buttons' );
		},

		// Re-create the buttons. This is calles when the number of slides changes.
		_adjustButtons: function() {
			this.$buttons.empty();

			// Create the buttons
			for ( var i = 0; i < this.getTotalSlides(); i++ ) {
				$( '<div class="sp-button"></div>' ).appendTo( this.$buttons );
			}

			// Change the selected the buttons
			this.$buttons.find( '.sp-selected-button' ).removeClass( 'sp-selected-button' );
			this.$buttons.find( '.sp-button' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected-button' );
		},

		// Remove the buttons
		_removeButtons: function() {
			this.$buttons.off( 'click.' + NS, '.sp-button' );
			this.off( 'gotoSlide.' + NS );
			this.$buttons.remove();
			this.$slider.removeClass( 'sp-has-buttons' );
		},

		destroyButtons: function() {
			this._removeButtons();
			this.off( 'update.' + NS );
		},

		buttonsDefaults: {
			
			// Indicates whether the buttons will be created
			buttons: true
		}
	};

	$.SliderPro.addModule( 'Buttons', Buttons );

})( window, jQuery );

// Arrows module for Slider Pro.
// 
// Adds arrows for navigating to the next or previous slide.
;(function( window, $ ) {

	"use strict";

	var NS = 'Arrows.' + $.SliderPro.namespace;

	var Arrows = {

		// Reference to the arrows container
		$arrows: null,

		// Reference to the previous arrow
		$previousArrow: null,

		// Reference to the next arrow
		$nextArrow: null,

		initArrows: function() {
			this.on( 'update.' + NS, $.proxy( this._arrowsOnUpdate, this ) );
			this.on( 'gotoSlide.' + NS, $.proxy( this._checkArrowsVisibility, this ) );
		},

		_arrowsOnUpdate: function() {
			var that = this;

			// Create the arrows if the 'arrows' option is set to true
			if ( this.settings.arrows === true && this.$arrows === null ) {
				this.$arrows = $( '<div class="sp-arrows"></div>' ).appendTo( this.$slidesContainer );
				
				this.$previousArrow = $( '<div class="sp-arrow sp-previous-arrow"></div>' ).appendTo( this.$arrows );
				this.$nextArrow = $( '<div class="sp-arrow sp-next-arrow"></div>' ).appendTo( this.$arrows );

				this.$previousArrow.on( 'click.' + NS, function() {
					that.previousSlide();
				});

				this.$nextArrow.on( 'click.' + NS, function() {
					that.nextSlide();
				});

				this._checkArrowsVisibility();
			} else if ( this.settings.arrows === false && this.$arrows !== null ) {
				this._removeArrows();
			}

			if ( this.settings.arrows === true ) {
				if ( this.settings.fadeArrows === true ) {
					this.$arrows.addClass( 'sp-fade-arrows' );
				} else if ( this.settings.fadeArrows === false ) {
					this.$arrows.removeClass( 'sp-fade-arrows' );
				}
			}
		},

		// Show or hide the arrows depending on the position of the selected slide
		_checkArrowsVisibility: function() {
			if ( this.settings.arrows === false || this.settings.loop === true ) {
				return;
			}

			if ( this.selectedSlideIndex === 0 ) {
				this.$previousArrow.css( 'display', 'none' );
			} else {
				this.$previousArrow.css( 'display', 'block' );
			}

			if ( this.selectedSlideIndex === this.getTotalSlides() - 1 ) {
				this.$nextArrow.css( 'display', 'none' );
			} else {
				this.$nextArrow.css( 'display', 'block' );
			}
		},
		
		_removeArrows: function() {
			if ( this.$arrows !== null ) {
				this.$previousArrow.off( 'click.' + NS );
				this.$nextArrow.off( 'click.' + NS );
				this.$arrows.remove();
				this.$arrows = null;
			}
		},

		destroyArrows: function() {
			this._removeArrows();
			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );
		},

		arrowsDefaults: {

			// Indicates whether the arrow buttons will be created
			arrows: false,

			// Indicates whether the arrows will fade in only on hover
			fadeArrows: true
		}
	};

	$.SliderPro.addModule( 'Arrows', Arrows );

})( window, jQuery );

// Thumbnail Touch Swipe module for Slider Pro.
// 
// Adds touch-swipe functionality for thumbnails.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'ThumbnailTouchSwipe.' + $.SliderPro.namespace;

	var ThumbnailTouchSwipe = {

		// The x and y coordinates of the pointer/finger's starting position
		thumbnailTouchStartPoint: { x: 0, y: 0 },

		// The x and y coordinates of the pointer/finger's end position
		thumbnailTouchEndPoint: { x: 0, y: 0 },

		// The distance from the starting to the end position on the x and y axis
		thumbnailTouchDistance: { x: 0, y: 0 },

		// The position of the thumbnail scroller when the touch swipe starts
		thumbnailTouchStartPosition: 0,

		// Indicates if the thumbnail scroller is being swiped
		isThumbnailTouchMoving: false,

		// Indicates if the touch swipe was initialized
		isThumbnailTouchSwipe: false,

		// Stores the names of the events
		thumbnailTouchSwipeEvents: { startEvent: '', moveEvent: '', endEvent: '' },

		initThumbnailTouchSwipe: function() {
			this.on( 'update.' + NS, $.proxy( this._thumbnailTouchSwipeOnUpdate, this ) );
		},

		_thumbnailTouchSwipeOnUpdate: function() {

			// Return if there are no thumbnails
			if ( this.isThumbnailScroller === false ) {
				return;
			}

			// Initialize the touch swipe functionality if it wasn't initialized yet
			if ( this.settings.thumbnailTouchSwipe === true && this.isThumbnailTouchSwipe === false ) {
				this.isThumbnailTouchSwipe = true;

				this.thumbnailTouchSwipeEvents.startEvent = 'touchstart' + '.' + NS + ' mousedown' + '.' + NS;
				this.thumbnailTouchSwipeEvents.moveEvent = 'touchmove' + '.' + NS + ' mousemove' + '.' + NS;
				this.thumbnailTouchSwipeEvents.endEvent = 'touchend' + '.' + this.uniqueId + '.' + NS + ' mouseup' + '.' + this.uniqueId + '.' + NS;
				
				// Listen for touch swipe/mouse move events
				this.$thumbnails.on( this.thumbnailTouchSwipeEvents.startEvent, $.proxy( this._onThumbnailTouchStart, this ) );
				this.$thumbnails.on( 'dragstart.' + NS, function( event ) {
					event.preventDefault();
				});
			
				// Add the grabbing icon
				this.$thumbnails.addClass( 'sp-grab' );
			}

			// Remove the default thumbnailClick
			$.each( this.thumbnails, function( index, thumbnail ) {
				thumbnail.off( 'thumbnailClick' );
			});
		},

		// Called when the thumbnail scroller starts being dragged
		_onThumbnailTouchStart: function( event ) {
			// Disable dragging if the element is set to allow selections
			if ( $( event.target ).closest( '.sp-selectable' ).length >= 1 ) {
				return;
			}

			var that = this,
				eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Prevent default behavior for mouse events
			if ( typeof event.originalEvent.touches === 'undefined' ) {
				event.preventDefault();
			}

			// Disable click events on links
			$( event.target ).parents( '.sp-thumbnail-container' ).find( 'a' ).one( 'click.' + NS, function( event ) {
				event.preventDefault();
			});

			// Get the initial position of the mouse pointer and the initial position
			// of the thumbnail scroller
			this.thumbnailTouchStartPoint.x = eventObject.pageX || eventObject.clientX;
			this.thumbnailTouchStartPoint.y = eventObject.pageY || eventObject.clientY;
			this.thumbnailTouchStartPosition = this.thumbnailsPosition;

			// Clear the previous distance values
			this.thumbnailTouchDistance.x = this.thumbnailTouchDistance.y = 0;

			// If the thumbnail scroller is being grabbed while it's still animating, stop the
			// current movement
			if ( this.$thumbnails.hasClass( 'sp-animated' ) ) {
				this.isThumbnailTouchMoving = true;
				this._stopThumbnailsMovement();
				this.thumbnailTouchStartPosition = this.thumbnailsPosition;
			}

			// Listen for move and end events
			this.$thumbnails.on( this.thumbnailTouchSwipeEvents.moveEvent, $.proxy( this._onThumbnailTouchMove, this ) );
			$( document ).on( this.thumbnailTouchSwipeEvents.endEvent, $.proxy( this._onThumbnailTouchEnd, this ) );

			// Swap grabbing icons
			this.$thumbnails.removeClass( 'sp-grab' ).addClass( 'sp-grabbing' );

			// Add 'sp-swiping' class to indicate that the thumbnail scroller is being swiped
			this.$thumbnailsContainer.addClass( 'sp-swiping' );
		},

		// Called during the thumbnail scroller's dragging
		_onThumbnailTouchMove: function( event ) {
			var eventObject = typeof event.originalEvent.touches !== 'undefined' ? event.originalEvent.touches[0] : event.originalEvent;

			// Indicate that the move event is being fired
			this.isThumbnailTouchMoving = true;

			// Get the current position of the mouse pointer
			this.thumbnailTouchEndPoint.x = eventObject.pageX || eventObject.clientX;
			this.thumbnailTouchEndPoint.y = eventObject.pageY || eventObject.clientY;

			// Calculate the distance of the movement on both axis
			this.thumbnailTouchDistance.x = this.thumbnailTouchEndPoint.x - this.thumbnailTouchStartPoint.x;
			this.thumbnailTouchDistance.y = this.thumbnailTouchEndPoint.y - this.thumbnailTouchStartPoint.y;
			
			// Calculate the distance of the swipe that takes place in the same direction as the orientation of the thumbnails
			// and calculate the distance from the opposite direction.
			// 
			// For a swipe to be valid there should more distance in the same direction as the orientation of the thumbnails.
			var distance = this.thumbnailsOrientation === 'horizontal' ? this.thumbnailTouchDistance.x : this.thumbnailTouchDistance.y,
				oppositeDistance = this.thumbnailsOrientation === 'horizontal' ? this.thumbnailTouchDistance.y : this.thumbnailTouchDistance.x;

			// If the movement is in the same direction as the orientation of the thumbnails, the swipe is valid
			if ( Math.abs( distance ) > Math.abs( oppositeDistance ) ) {
				event.preventDefault();
			} else {
				return;
			}

			// Make the thumbnail scroller move slower if it's dragged outside its bounds
			if ( this.thumbnailsPosition >= 0 ) {
				var infOffset = - this.thumbnailTouchStartPosition;
				distance = infOffset + ( distance - infOffset ) * 0.2;
			} else if ( this.thumbnailsPosition <= - this.thumbnailsSize + this.thumbnailsContainerSize ) {
				var supOffset = this.thumbnailsSize - this.thumbnailsContainerSize + this.thumbnailTouchStartPosition;
				distance = - supOffset + ( distance + supOffset ) * 0.2;
			}
			
			this._moveThumbnailsTo( this.thumbnailTouchStartPosition + distance, true );
		},

		// Called when the thumbnail scroller is released
		_onThumbnailTouchEnd: function( event ) {
			var that = this,
				thumbnailTouchDistance = this.thumbnailsOrientation === 'horizontal' ? this.thumbnailTouchDistance.x : this.thumbnailTouchDistance.y;

			// Remove the move and end listeners
			this.$thumbnails.off( this.thumbnailTouchSwipeEvents.moveEvent );
			$( document ).off( this.thumbnailTouchSwipeEvents.endEvent );

			// Swap grabbing icons
			this.$thumbnails.removeClass( 'sp-grabbing' ).addClass( 'sp-grab' );

			// Check if there is intention for a tap/click
			if ( this.isThumbnailTouchMoving === false ||
				this.isThumbnailTouchMoving === true &&
				Math.abs( this.thumbnailTouchDistance.x ) < 10 &&
				Math.abs( this.thumbnailTouchDistance.y ) < 10
			) {
				var targetThumbnail = $( event.target ).hasClass( 'sp-thumbnail-container' ) ? $( event.target ) : $( event.target ).parents( '.sp-thumbnail-container' ),
					index = targetThumbnail.index();

				// If a link is cliked, navigate to that link, else navigate to the slide that corresponds to the thumbnail
				if ( $( event.target ).parents( 'a' ).length !== 0 ) {
					$( event.target ).parents( 'a' ).off( 'click.' + NS );
					this.$thumbnailsContainer.removeClass( 'sp-swiping' );
				} else if ( index !== this.selectedThumbnailIndex && index !== -1 ) {
					this.gotoSlide( index );
				}

				return;
			}

			this.isThumbnailTouchMoving = false;

			$( event.target ).parents( '.sp-thumbnail' ).one( 'click', function( event ) {
				event.preventDefault();
			});

			// Remove the 'sp-swiping' class but with a delay
			// because there might be other event listeners that check
			// the existence of this class, and this class should still be 
			// applied for those listeners, since there was a swipe event
			setTimeout(function() {
				that.$thumbnailsContainer.removeClass( 'sp-swiping' );
			}, 1 );

			// Keep the thumbnail scroller inside the bounds
			if ( this.thumbnailsPosition > 0 ) {
				this._moveThumbnailsTo( 0 );
			} else if ( this.thumbnailsPosition < this.thumbnailsContainerSize - this.thumbnailsSize ) {
				this._moveThumbnailsTo( this.thumbnailsContainerSize - this.thumbnailsSize );
			}

			// Fire the 'thumbnailsMoveComplete' event
			this.trigger({ type: 'thumbnailsMoveComplete' });
			if ( $.isFunction( this.settings.thumbnailsMoveComplete ) ) {
				this.settings.thumbnailsMoveComplete.call( this, { type: 'thumbnailsMoveComplete' });
			}
		},

		// Destroy the module
		destroyThumbnailTouchSwipe: function() {
			this.off( 'update.' + NS );

			if ( this.isThumbnailScroller === false ) {
				return;
			}

			this.$thumbnails.off( this.thumbnailTouchSwipeEvents.startEvent );
			this.$thumbnails.off( this.thumbnailTouchSwipeEvents.moveEvent );
			this.$thumbnails.off( 'dragstart.' + NS );
			$( document ).off( this.thumbnailTouchSwipeEvents.endEvent );
			this.$thumbnails.removeClass( 'sp-grab' );
		},

		thumbnailTouchSwipeDefaults: {

			// Indicates whether the touch swipe will be enabled for thumbnails
			thumbnailTouchSwipe: true
		}
	};

	$.SliderPro.addModule( 'ThumbnailTouchSwipe', ThumbnailTouchSwipe );

})( window, jQuery );

// Thumbnail Arrows module for Slider Pro.
// 
// Adds thumbnail arrows for moving the thumbnail scroller.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'ThumbnailArrows.' + $.SliderPro.namespace;

	var ThumbnailArrows = {

		// Reference to the arrows container
		$thumbnailArrows: null,

		// Reference to the 'previous' thumbnail arrow
		$previousThumbnailArrow: null,

		// Reference to the 'next' thumbnail arrow
		$nextThumbnailArrow: null,

		initThumbnailArrows: function() {
			var that = this;

			this.on( 'update.' + NS, $.proxy( this._thumbnailArrowsOnUpdate, this ) );
			
			// Check if the arrows need to be visible or invisible when the thumbnail scroller
			// resizes and when the thumbnail scroller moves.
			this.on( 'sliderResize.' + NS + ' ' + 'thumbnailsMoveComplete.' + NS, function() {
				if ( that.isThumbnailScroller === true && that.settings.thumbnailArrows === true ) {
					that._checkThumbnailArrowsVisibility();
				}
			});
		},
		
		// Called when the slider is updated
		_thumbnailArrowsOnUpdate: function() {
			var that = this;
			
			if ( this.isThumbnailScroller === false ) {
				return;
			}

			// Create or remove the thumbnail scroller arrows
			if ( this.settings.thumbnailArrows === true && this.$thumbnailArrows === null ) {
				this.$thumbnailArrows = $( '<div class="sp-thumbnail-arrows"></div>' ).appendTo( this.$thumbnailsContainer );
				
				this.$previousThumbnailArrow = $( '<div class="sp-thumbnail-arrow sp-previous-thumbnail-arrow"></div>' ).appendTo( this.$thumbnailArrows );
				this.$nextThumbnailArrow = $( '<div class="sp-thumbnail-arrow sp-next-thumbnail-arrow"></div>' ).appendTo( this.$thumbnailArrows );

				this.$previousThumbnailArrow.on( 'click.' + NS, function() {
					var previousPosition = Math.min( 0, that.thumbnailsPosition + that.thumbnailsContainerSize );
					that._moveThumbnailsTo( previousPosition );
				});

				this.$nextThumbnailArrow.on( 'click.' + NS, function() {
					var nextPosition = Math.max( that.thumbnailsContainerSize - that.thumbnailsSize, that.thumbnailsPosition - that.thumbnailsContainerSize );
					that._moveThumbnailsTo( nextPosition );
				});
			} else if ( this.settings.thumbnailArrows === false && this.$thumbnailArrows !== null ) {
				this._removeThumbnailArrows();
			}

			// Add fading functionality and check if the arrows need to be visible or not
			if ( this.settings.thumbnailArrows === true ) {
				if ( this.settings.fadeThumbnailArrows === true ) {
					this.$thumbnailArrows.addClass( 'sp-fade-thumbnail-arrows' );
				} else if ( this.settings.fadeThumbnailArrows === false ) {
					this.$thumbnailArrows.removeClass( 'sp-fade-thumbnail-arrows' );
				}

				this._checkThumbnailArrowsVisibility();
			}
		},

		// Checks if the 'next' or 'previous' arrows need to be visible or hidden,
		// based on the position of the thumbnail scroller
		_checkThumbnailArrowsVisibility: function() {
			if ( this.thumbnailsPosition === 0 ) {
				this.$previousThumbnailArrow.css( 'display', 'none' );
			} else {
				this.$previousThumbnailArrow.css( 'display', 'block' );
			}

			if ( this.thumbnailsPosition === this.thumbnailsContainerSize - this.thumbnailsSize ) {
				this.$nextThumbnailArrow.css( 'display', 'none' );
			} else {
				this.$nextThumbnailArrow.css( 'display', 'block' );
			}
		},

		// Remove the thumbnail arrows
		_removeThumbnailArrows: function() {
			if ( this.$thumbnailArrows !== null ) {
				this.$previousThumbnailArrow.off( 'click.' + NS );
				this.$nextThumbnailArrow.off( 'click.' + NS );
				this.$thumbnailArrows.remove();
				this.$thumbnailArrows = null;
			}
		},

		// Destroy the module
		destroyThumbnailArrows: function() {
			this._removeThumbnailArrows();
			this.off( 'update.' + NS );
			this.off( 'sliderResize.' + NS );
			this.off( 'thumbnailsMoveComplete.' + NS );
		},

		thumbnailArrowsDefaults: {

			// Indicates whether the thumbnail arrows will be enabled
			thumbnailArrows: false,

			// Indicates whether the thumbnail arrows will be faded
			fadeThumbnailArrows: true
		}
	};

	$.SliderPro.addModule( 'ThumbnailArrows', ThumbnailArrows );

})( window, jQuery );

// Video module for Slider Pro
//
// Adds automatic control for several video players and providers
;(function( window, $ ) {

	"use strict";

	var NS = 'Video.' + $.SliderPro.namespace;
	
	var Video = {

		initVideo: function() {
			this.on( 'update.' + NS, $.proxy( this._videoOnUpdate, this ) );
			this.on( 'gotoSlideComplete.' + NS, $.proxy( this._videoOnGotoSlideComplete, this ) );
		},

		_videoOnUpdate: function() {
			var that = this;

			// Find all the inline videos and initialize them
			this.$slider.find( '.sp-video' ).not( 'a, [data-video-init]' ).each(function() {
				var video = $( this );
				that._initVideo( video );
			});

			// Find all the lazy-loaded videos and preinitialize them. They will be initialized
			// only when their play button is clicked.
			this.$slider.find( 'a.sp-video' ).not( '[data-video-preinit]' ).each(function() {
				var video = $( this );
				that._preinitVideo( video );
			});
		},

		// Initialize the target video
		_initVideo: function( video ) {
			var that = this;

			video.attr( 'data-video-init', true )
				.videoController();

			// When the video starts playing, pause the autoplay if it's running
			video.on( 'videoPlay.' + NS, function() {
				if ( that.settings.playVideoAction === 'stopAutoplay' && typeof that.stopAutoplay !== 'undefined' ) {
					that.stopAutoplay();
					that.settings.autoplay = false;
				}

				// Fire the 'videoPlay' event
				var eventObject = { type: 'videoPlay', video: video };
				that.trigger( eventObject );
				if ( $.isFunction( that.settings.videoPlay ) ) {
					that.settings.videoPlay.call( that, eventObject );
				}
			});

			// When the video is paused, restart the autoplay
			video.on( 'videoPause.' + NS, function() {
				if ( that.settings.pauseVideoAction === 'startAutoplay' && typeof that.startAutoplay !== 'undefined' ) {
					that.startAutoplay();
					that.settings.autoplay = true;
				}

				// Fire the 'videoPause' event
				var eventObject = { type: 'videoPause', video: video };
				that.trigger( eventObject );
				if ( $.isFunction( that.settings.videoPause ) ) {
					that.settings.videoPause.call( that, eventObject );
				}
			});

			// When the video ends, restart the autoplay (which was paused during the playback), or
			// go to the next slide, or replay the video
			video.on( 'videoEnded.' + NS, function() {
				if ( that.settings.endVideoAction === 'startAutoplay' && typeof that.startAutoplay !== 'undefined' ) {
					that.startAutoplay();
					that.settings.autoplay = true;
				} else if ( that.settings.endVideoAction === 'nextSlide' ) {
					that.nextSlide();
				} else if ( that.settings.endVideoAction === 'replayVideo' ) {
					video.videoController( 'replay' );
				}

				// Fire the 'videoEnd' event
				var eventObject = { type: 'videoEnd', video: video };
				that.trigger( eventObject );
				if ( $.isFunction(that.settings.videoEnd ) ) {
					that.settings.videoEnd.call( that, eventObject );
				}
			});
		},

		// Pre-initialize the video. This is for lazy loaded videos.
		_preinitVideo: function( video ) {
			var that = this;

			video.attr( 'data-video-preinit', true );

			// When the video poster is clicked, remove the poster and create
			// the inline video
			video.on( 'click.' + NS, function( event ) {

				// If the video is being dragged, don't start the video
				if ( that.$slider.hasClass( 'sp-swiping' ) ) {
					return;
				}

				event.preventDefault();

				var href = video.attr( 'href' ),
					iframe,
					provider,
					regExp,
					match,
					id,
					src,
					videoAttributes,
					videoWidth = video.children( 'img' ).attr( 'width' ),
					videoHeight = video.children( 'img' ).attr( 'height');

				// Check if it's a youtube or vimeo video
				if ( href.indexOf( 'youtube' ) !== -1 || href.indexOf( 'youtu.be' ) !== -1 ) {
					provider = 'youtube';
				} else if ( href.indexOf( 'vimeo' ) !== -1 ) {
					provider = 'vimeo';
				}

				// Get the id of the video
				regExp = provider === 'youtube' ? /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/ : /http:\/\/(www\.)?vimeo.com\/(\d+)/;
				match = href.match( regExp );
				id = match[2];

				// Get the source of the iframe that will be created
				src = provider === 'youtube' ? 'http://www.youtube.com/embed/' + id + '?enablejsapi=1&wmode=opaque' : 'http://player.vimeo.com/video/'+ id +'?api=1';
				
				// Get the attributes passed to the video link and then pass them to the iframe's src
				videoAttributes = href.split( '?' )[ 1 ];

				if ( typeof videoAttributes !== 'undefined' ) {
					videoAttributes = videoAttributes.split( '&' );

					$.each( videoAttributes, function( index, value ) {
						if ( value.indexOf( id ) === -1 ) {
							src += '&' + value;
						}
					});
				}

				// Create the iframe
				iframe = $( '<iframe></iframe>' )
					.attr({
						'src': src,
						'width': videoWidth,
						'height': videoHeight,
						'class': video.attr( 'class' ),
						'frameborder': 0
					}).insertBefore( video );

				// Initialize the video and play it
				that._initVideo( iframe );
				iframe.videoController( 'play' );

				// Hide the video poster
				video.css( 'display', 'none' );
			});
		},

		// Called when a new slide is selected
		_videoOnGotoSlideComplete: function( event ) {

			// Get the video from the previous slide
			var previousVideo = this.$slides.find( '.sp-slide' ).eq( event.previousIndex ).find( '.sp-video[data-video-init]' );

			// Handle the video from the previous slide by stopping it, or pausing it,
			// or remove it, depending on the value of the 'leaveVideoAction' option.
			if ( event.previousIndex !== -1 && previousVideo.length !== 0 ) {
				if ( this.settings.leaveVideoAction === 'stopVideo' ) {
					previousVideo.videoController( 'stop' );
				} else if ( this.settings.leaveVideoAction === 'pauseVideo' ) {
					previousVideo.videoController( 'pause' );
				} else if ( this.settings.leaveVideoAction === 'removeVideo'  ) {
					// If the video was lazy-loaded, remove it and show the poster again. If the video
					// was not lazy-loaded, but inline, stop the video.
					if ( previousVideo.siblings( 'a.sp-video' ).length !== 0 ) {
						previousVideo.siblings( 'a.sp-video' ).css( 'display', '' );
						previousVideo.videoController( 'destroy' );
						previousVideo.remove();
					} else {
						previousVideo.videoController( 'stop' );
					}
				}
			}

			// Handle the video from the selected slide
			if ( this.settings.reachVideoAction === 'playVideo' ) {
				var loadedVideo = this.$slides.find( '.sp-slide' ).eq( event.index ).find( '.sp-video[data-video-init]' ),
					unloadedVideo = this.$slides.find( '.sp-slide' ).eq( event.index ).find( '.sp-video[data-video-preinit]' );

				// If the video was already initialized, play it. If it's not initialized (because
				// it's lazy loaded) initialize it and play it.
				if ( loadedVideo.length !== 0 ) {
					loadedVideo.videoController( 'play' );
				} else if ( unloadedVideo.length !== 0 ) {
					unloadedVideo.trigger( 'click.' + NS );
				}
			}
		},

		// Destroy the module
		destroyVideo: function() {
			this.$slider.find( '.sp-video[ data-video-preinit ]' ).each(function() {
				var video = $( this );
				video.removeAttr( 'data-video-preinit' );
				video.off( 'click.' + NS );
			});

			// Loop through the all the videos and destroy them
			this.$slider.find( '.sp-video[ data-video-init ]' ).each(function() {
				var video = $( this );
				video.removeAttr( 'data-video-init' );
				video.off( 'Video' );
				video.videoController( 'destroy' );
			});

			this.off( 'update.' + NS );
			this.off( 'gotoSlideComplete.' + NS );
		},

		videoDefaults: {

			// Sets the action that the video will perform when its slide container is selected
			// ( 'playVideo' and 'none' )
			reachVideoAction: 'none',

			// Sets the action that the video will perform when another slide is selected
			// ( 'stopVideo', 'pauseVideo', 'removeVideo' and 'none' )
			leaveVideoAction: 'pauseVideo',

			// Sets the action that the slider will perform when the video starts playing
			// ( 'stopAutoplay' and 'none' )
			playVideoAction: 'stopAutoplay',

			// Sets the action that the slider will perform when the video is paused
			// ( 'startAutoplay' and 'none' )
			pauseVideoAction: 'none',

			// Sets the action that the slider will perform when the video ends
			// ( 'startAutoplay', 'nextSlide', 'replayVideo' and 'none' )
			endVideoAction: 'none',

			// Called when the video starts playing
			videoPlay: function() {},

			// Called when the video is paused
			videoPause: function() {},

			// Called when the video ends
			videoEnd: function() {}
		}
	};

	$.SliderPro.addModule( 'Video', Video );
	
})( window, jQuery );

// Video Controller jQuery plugin
// Creates a universal controller for multiple video types and providers
;(function( $ ) {

	"use strict";

// Check if an iOS device is used.
// This information is important because a video can not be
// controlled programmatically unless the user has started the video manually.
var	isIOS = window.navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ? true : false;

var VideoController = function( instance, options ) {
	this.$video = $( instance );
	this.options = options;
	this.settings = {};
	this.player = null;

	this._init();
};

VideoController.prototype = {

	_init: function() {
		this.settings = $.extend( {}, this.defaults, this.options );

		var that = this,
			players = $.VideoController.players,
			videoID = this.$video.attr( 'id' );

		// Loop through the available video players
		// and check if the targeted video element is supported by one of the players.
		// If a compatible type is found, store the video type.
		for ( var name in players ) {
			if ( typeof players[ name ] !== 'undefined' && players[ name ].isType( this.$video ) ) {
				this.player = new players[ name ]( this.$video );
				break;
			}
		}

		// Return if the player could not be instantiated
		if ( this.player === null ) {
			return;
		}

		// Add event listeners
		var events = [ 'ready', 'start', 'play', 'pause', 'ended' ];
		
		$.each( events, function( index, element ) {
			var event = 'video' + element.charAt( 0 ).toUpperCase() + element.slice( 1 );

			that.player.on( element, function() {
				that.trigger({ type: event, video: videoID });
				if ( $.isFunction( that.settings[ event ] ) ) {
					that.settings[ event ].call( that, { type: event, video: videoID } );
				}
			});
		});
	},
	
	play: function() {
		if ( isIOS === true && this.player.isStarted() === false || this.player.getState() === 'playing' ) {
			return;
		}

		this.player.play();
	},
	
	stop: function() {
		if ( isIOS === true && this.player.isStarted() === false || this.player.getState() === 'stopped' ) {
			return;
		}

		this.player.stop();
	},
	
	pause: function() {
		if ( isIOS === true && this.player.isStarted() === false || this.player.getState() === 'paused' ) {
			return;
		}

		this.player.pause();
	},

	replay: function() {
		if ( isIOS === true && this.player.isStarted() === false ) {
			return;
		}
		
		this.player.replay();
	},

	on: function( type, callback ) {
		return this.$video.on( type, callback );
	},
	
	off: function( type ) {
		return this.$video.off( type );
	},

	trigger: function( data ) {
		return this.$video.triggerHandler( data );
	},

	destroy: function() {
		if ( this.player.isStarted() === true ) {
			this.stop();
		}

		this.player.off( 'ready' );
		this.player.off( 'start' );
		this.player.off( 'play' );
		this.player.off( 'pause' );
		this.player.off( 'ended' );

		this.$video.removeData( 'videoController' );
	},

	defaults: {
		videoReady: function() {},
		videoStart: function() {},
		videoPlay: function() {},
		videoPause: function() {},
		videoEnded: function() {}
	}
};

$.VideoController = {
	players: {},

	addPlayer: function( name, player ) {
		this.players[ name ] = player;
	}
};

$.fn.videoController = function( options ) {
	var args = Array.prototype.slice.call( arguments, 1 );

	return this.each(function() {
		// Instantiate the video controller or call a function on the current instance
		if ( typeof $( this ).data( 'videoController' ) === 'undefined' ) {
			var newInstance = new VideoController( this, options );

			// Store a reference to the instance created
			$( this ).data( 'videoController', newInstance );
		} else if ( typeof options !== 'undefined' ) {
			var	currentInstance = $( this ).data( 'videoController' );

			// Check the type of argument passed
			if ( typeof currentInstance[ options ] === 'function' ) {
				currentInstance[ options ].apply( currentInstance, args );
			} else {
				$.error( options + ' does not exist in videoController.' );
			}
		}
	});
};

// Base object for the video players
var Video = function( video ) {
	this.$video = video;
	this.player = null;
	this.ready = false;
	this.started = false;
	this.state = '';
	this.events = $({});

	this._init();
};

Video.prototype = {
	_init: function() {},

	play: function() {},

	pause: function() {},

	stop: function() {},

	replay: function() {},

	isType: function() {},

	isReady: function() {
		return this.ready;
	},

	isStarted: function() {
		return this.started;
	},

	getState: function() {
		return this.state;
	},

	on: function( type, callback ) {
		return this.events.on( type, callback );
	},
	
	off: function( type ) {
		return this.events.off( type );
	},

	trigger: function( data ) {
		return this.events.triggerHandler( data );
	}
};

// YouTube video
var YoutubeVideoHelper = {
	youtubeAPIAdded: false,
	youtubeVideos: []
};

var YoutubeVideo = function( video ) {
	this.init = false;
	var youtubeAPILoaded = window.YT && window.YT.Player;

	if ( typeof youtubeAPILoaded !== 'undefined' ) {
		Video.call( this, video );
	} else {
		YoutubeVideoHelper.youtubeVideos.push({ 'video': video, 'scope': this });
		
		if ( YoutubeVideoHelper.youtubeAPIAdded === false ) {
			YoutubeVideoHelper.youtubeAPIAdded = true;

			var tag = document.createElement( 'script' );
			tag.src = "http://www.youtube.com/player_api";
			var firstScriptTag = document.getElementsByTagName( 'script' )[0];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

			window.onYouTubePlayerAPIReady = function() {
				$.each( YoutubeVideoHelper.youtubeVideos, function( index, element ) {
					Video.call( element.scope, element.video );
				});
			};
		}
	}
};

YoutubeVideo.prototype = new Video();
YoutubeVideo.prototype.constructor = YoutubeVideo;
$.VideoController.addPlayer( 'YoutubeVideo', YoutubeVideo );

YoutubeVideo.isType = function( video ) {
	if ( video.is( 'iframe' ) ) {
		var src = video.attr( 'src' );

		if ( src.indexOf( 'youtube.com' ) !== -1 || src.indexOf( 'youtu.be' ) !== -1 ) {
			return true;
		}
	}

	return false;
};

YoutubeVideo.prototype._init = function() {
	this.init = true;
	this._setup();
};
	
YoutubeVideo.prototype._setup = function() {
	var that = this;

	// Get a reference to the player
	this.player = new YT.Player( this.$video[0], {
		events: {
			'onReady': function() {
				that.trigger({ type: 'ready' });
				that.ready = true;
			},
			
			'onStateChange': function( event ) {
				switch ( event.data ) {
					case YT.PlayerState.PLAYING:
						if (that.started === false) {
							that.started = true;
							that.trigger({ type: 'start' });
						}

						that.state = 'playing';
						that.trigger({ type: 'play' });
						break;
					
					case YT.PlayerState.PAUSED:
						that.state = 'paused';
						that.trigger({ type: 'pause' });
						break;
					
					case YT.PlayerState.ENDED:
						that.state = 'ended';
						that.trigger({ type: 'ended' });
						break;
				}
			}
		}
	});
};

YoutubeVideo.prototype.play = function() {
	var that = this;

	if ( this.ready === true ) {
		this.player.playVideo();
	} else {
		var timer = setInterval(function() {
			if ( that.ready === true ) {
				clearInterval( timer );
				that.player.playVideo();
			}
		}, 100 );
	}
};

YoutubeVideo.prototype.pause = function() {
	// On iOS, simply pausing the video can make other videos unresponsive
	// so we stop the video instead.
	if ( isIOS === true ) {
		this.stop();
	} else {
		this.player.pauseVideo();
	}
};

YoutubeVideo.prototype.stop = function() {
	this.player.seekTo( 1 );
	this.player.stopVideo();
	this.state = 'stopped';
};

YoutubeVideo.prototype.replay = function() {
	this.player.seekTo( 1 );
	this.player.playVideo();
};

YoutubeVideo.prototype.on = function( type, callback ) {
	var that = this;

	if ( this.init === true ) {
		Video.prototype.on.call( this, type, callback );
	} else {
		var timer = setInterval(function() {
			if ( that.init === true ) {
				clearInterval( timer );
				Video.prototype.on.call( that, type, callback );
			}
		}, 100 );
	}
};

// Vimeo video
var VimeoVideoHelper = {
	vimeoAPIAdded: false,
	vimeoVideos: []
};

var VimeoVideo = function( video ) {
	this.init = false;

	if ( typeof window.Froogaloop !== 'undefined' ) {
		Video.call( this, video );
	} else {
		VimeoVideoHelper.vimeoVideos.push({ 'video': video, 'scope': this });

		if ( VimeoVideoHelper.vimeoAPIAdded === false ) {
			VimeoVideoHelper.vimeoAPIAdded = true;

			var tag = document.createElement('script');
			tag.src = "http://a.vimeocdn.com/js/froogaloop2.min.js";
			var firstScriptTag = document.getElementsByTagName( 'script' )[0];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
		
			var checkVimeoAPITimer = setInterval(function() {
				if ( typeof window.Froogaloop !== 'undefined' ) {
					clearInterval( checkVimeoAPITimer );
					
					$.each( VimeoVideoHelper.vimeoVideos, function( index, element ) {
						Video.call( element.scope, element.video );
					});
				}
			}, 100 );
		}
	}
};

VimeoVideo.prototype = new Video();
VimeoVideo.prototype.constructor = VimeoVideo;
$.VideoController.addPlayer( 'VimeoVideo', VimeoVideo );

VimeoVideo.isType = function( video ) {
	if ( video.is( 'iframe' ) ) {
		var src = video.attr('src');

		if ( src.indexOf( 'vimeo.com' ) !== -1 ) {
			return true;
		}
	}

	return false;
};

VimeoVideo.prototype._init = function() {
	this.init = true;
	this._setup();
};

VimeoVideo.prototype._setup = function() {
	var that = this;

	// Get a reference to the player
	this.player = $f( this.$video[0] );
	
	this.player.addEvent( 'ready', function() {
		that.ready = true;
		that.trigger({ type: 'ready' });
		
		that.player.addEvent( 'play', function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});
		
		that.player.addEvent( 'pause', function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});
		
		that.player.addEvent( 'finish', function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

VimeoVideo.prototype.play = function() {
	var that = this;

	if ( this.ready === true ) {
		this.player.api( 'play' );
	} else {
		var timer = setInterval(function() {
			if ( that.ready === true ) {
				clearInterval( timer );
				that.player.api( 'play' );
			}
		}, 100 );
	}
};

VimeoVideo.prototype.pause = function() {
	this.player.api( 'pause' );
};

VimeoVideo.prototype.stop = function() {
	this.player.api( 'seekTo', 0 );
	this.player.api( 'pause' );
	this.state = 'stopped';
};

VimeoVideo.prototype.replay = function() {
	this.player.api( 'seekTo', 0 );
	this.player.api( 'play' );
};

VimeoVideo.prototype.on = function( type, callback ) {
	var that = this;

	if ( this.init === true ) {
		Video.prototype.on.call( this, type, callback );
	} else {
		var timer = setInterval(function() {
			if ( that.init === true ) {
				clearInterval( timer );
				Video.prototype.on.call( that, type, callback );
			}
		}, 100 );
	}
};

// HTML5 video
var HTML5Video = function( video ) {
	Video.call( this, video );
};

HTML5Video.prototype = new Video();
HTML5Video.prototype.constructor = HTML5Video;
$.VideoController.addPlayer( 'HTML5Video', HTML5Video );

HTML5Video.isType = function( video ) {
	if ( video.is( 'video' ) && video.hasClass( 'video-js' ) === false && video.hasClass( 'sublime' ) === false ) {
		return true;
	}

	return false;
};

HTML5Video.prototype._init = function() {
	var that = this;

	// Get a reference to the player
	this.player = this.$video[0];
	this.ready = true;

	this.player.addEventListener( 'play', function() {
		if ( that.started === false ) {
			that.started = true;
			that.trigger({ type: 'start' });
		}

		that.state = 'playing';
		that.trigger({ type: 'play' });
	});
	
	this.player.addEventListener( 'pause', function() {
		that.state = 'paused';
		that.trigger({ type: 'pause' });
	});
	
	this.player.addEventListener( 'ended', function() {
		that.state = 'ended';
		that.trigger({ type: 'ended' });
	});
};

HTML5Video.prototype.play = function() {
	this.player.play();
};

HTML5Video.prototype.pause = function() {
	this.player.pause();
};

HTML5Video.prototype.stop = function() {
	this.player.currentTime = 0;
	this.player.pause();
	this.state = 'stopped';
};

HTML5Video.prototype.replay = function() {
	this.player.currentTime = 0;
	this.player.play();
};

// VideoJS video
var VideoJSVideo = function( video ) {
	Video.call( this, video );
};

VideoJSVideo.prototype = new Video();
VideoJSVideo.prototype.constructor = VideoJSVideo;
$.VideoController.addPlayer( 'VideoJSVideo', VideoJSVideo );

VideoJSVideo.isType = function( video ) {
	if ( ( typeof video.attr( 'data-videojs-id' ) !== 'undefined' || video.hasClass( 'video-js' ) ) && typeof videojs !== 'undefined' ) {
		return true;
	}

	return false;
};

VideoJSVideo.prototype._init = function() {
	var that = this,
		videoID = this.$video.hasClass( 'video-js' ) ? this.$video.attr( 'id' ) : this.$video.attr( 'data-videojs-id' );
	
	this.player = videojs( videoID );

	this.player.ready(function() {
		that.ready = true;
		that.trigger({ type: 'ready' });

		that.player.on( 'play', function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});
		
		that.player.on( 'pause', function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});
		
		that.player.on( 'ended', function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

VideoJSVideo.prototype.play = function() {
	this.player.play();
};

VideoJSVideo.prototype.pause = function() {
	this.player.pause();
};

VideoJSVideo.prototype.stop = function() {
	this.player.currentTime( 0 );
	this.player.pause();
	this.state = 'stopped';
};

VideoJSVideo.prototype.replay = function() {
	this.player.currentTime( 0 );
	this.player.play();
};

// Sublime video
var SublimeVideo = function( video ) {
	Video.call( this, video );
};

SublimeVideo.prototype = new Video();
SublimeVideo.prototype.constructor = SublimeVideo;
$.VideoController.addPlayer( 'SublimeVideo', SublimeVideo );

SublimeVideo.isType = function( video ) {
	if ( video.hasClass( 'sublime' ) && typeof sublime !== 'undefined' ) {
		return true;
	}

	return false;
};

SublimeVideo.prototype._init = function() {
	var that = this;

	sublime.ready(function() {
		// Get a reference to the player
		that.player = sublime.player( that.$video.attr( 'id' ) );

		that.ready = true;
		that.trigger({ type: 'ready' });

		that.player.on( 'play', function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});

		that.player.on( 'pause', function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});

		that.player.on( 'stop', function() {
			that.state = 'stopped';
			that.trigger({ type: 'stop' });
		});

		that.player.on( 'end', function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

SublimeVideo.prototype.play = function() {
	this.player.play();
};

SublimeVideo.prototype.pause = function() {
	this.player.pause();
};

SublimeVideo.prototype.stop = function() {
	this.player.stop();
};

SublimeVideo.prototype.replay = function() {
	this.player.stop();
	this.player.play();
};

// JWPlayer video
var JWPlayerVideo = function( video ) {
	Video.call( this, video );
};

JWPlayerVideo.prototype = new Video();
JWPlayerVideo.prototype.constructor = JWPlayerVideo;
$.VideoController.addPlayer( 'JWPlayerVideo', JWPlayerVideo );

JWPlayerVideo.isType = function( video ) {
	if ( ( typeof video.attr( 'data-jwplayer-id' ) !== 'undefined' || video.hasClass( 'jwplayer' ) || video.find( "object[data*='jwplayer']" ).length !== 0 ) &&
		typeof jwplayer !== 'undefined') {
		return true;
	}

	return false;
};

JWPlayerVideo.prototype._init = function() {
	var that = this,
		videoID;

	if ( this.$video.hasClass( 'jwplayer' ) ) {
		videoID = this.$video.attr( 'id' );
	} else if ( typeof this.$video.attr( 'data-jwplayer-id' ) !== 'undefined' ) {
		videoID = this.$video.attr( 'data-jwplayer-id');
	} else if ( this.$video.find( "object[data*='jwplayer']" ).length !== 0 ) {
		videoID = this.$video.find( 'object' ).attr( 'id' );
	}

	// Get a reference to the player
	this.player = jwplayer( videoID );

	this.player.onReady(function() {
		that.ready = true;
		that.trigger({ type: 'ready' });
	
		that.player.onPlay(function() {
			if ( that.started === false ) {
				that.started = true;
				that.trigger({ type: 'start' });
			}

			that.state = 'playing';
			that.trigger({ type: 'play' });
		});

		that.player.onPause(function() {
			that.state = 'paused';
			that.trigger({ type: 'pause' });
		});
		
		that.player.onComplete(function() {
			that.state = 'ended';
			that.trigger({ type: 'ended' });
		});
	});
};

JWPlayerVideo.prototype.play = function() {
	this.player.play( true );
};

JWPlayerVideo.prototype.pause = function() {
	this.player.pause( true );
};

JWPlayerVideo.prototype.stop = function() {
	this.player.stop();
	this.state = 'stopped';
};

JWPlayerVideo.prototype.replay = function() {
	this.player.seek( 0 );
	this.player.play( true );
};

})( jQuery );


// Activación
(function()
{
	$( '#my-slider' ).sliderPro({
		width: 1500,
		height: 700,
		arrows: true,
		buttons: false,
		waitForLayers: true,
		fade: true,
		autoplay: true,
		autoScaleLayers: false
	});
}());


/*El menú*/
(function()
{
	$(document).on("ready", inicio);
	function inicio()
	{   
		$('#menu').on("click", transicion_abrir);
	};
	function transicion_abrir(ev)
	{   
		ev.preventDefault();
		$('#header_nav').addClass('navegacion__barra--abrir');
		$('#header_nav').removeClass('navegacion__barra--cerrar');
		$('#menu').addClass('boton__menu--rotar');
		$('#menu').off("click", transicion_abrir);
		
		/*cerrando el menú*/
		$('#menu').on("click", transicion_cerrar);
		
		function transicion_cerrar(ev)
		{
			ev.preventDefault();
			$('#header_nav').addClass('navegacion__barra--cerrar');
			$('#header_nav').removeClass('navegacion__barra--abrir');
			$('#menu').removeClass('boton__menu--rotar');
			
			//Para asegurarse el menú abierto o cerrado cuando se redimensione la pantalla
			$(window).resize(redimensionador);
			function redimensionador()
			{
				var ancho = $(window).width();
				if (ancho >= 700)
				{
					$('#header_nav').addClass('navegacion__barra--abrir');
					$('#header_nav').removeClass('cerrar');
				} else {
					$('#header_nav').addClass('navegacion__barra--cerrar');
					$('#header_nav').removeClass('navegacion__barra--abrir')
				};
			};
			$('#menu').off("click", transicion_cerrar);
			$('#menu').on("click", transicion_abrir);
		};
	};
}());


// ir arriba
(function()
{
	$(document).on("ready", ir_arriba);
	//primero escondemos la flecha
	function ir_arriba()
	{
		var ocultar =
		{ 
			opacity : 0
			// visibility : 'hidden'
		};
		
		var mostrar =
		{
			opacity : 1
			// visibility : 'visible'
		};
		
		$( "#ir_arriba" ).css( ocultar );
		//la mostramos cuando bajamos y la esconemos cuando subimos
		$(window).scroll(esconder_mostrar);
		function esconder_mostrar ()
		{
			if( $( this ).scrollTop() > 400 )
			{
				$( "#ir_arriba" ).css( mostrar );
			}
			else
			{
				$( "#ir_arriba" ).css( ocultar );
			};
		};
		$( "#ir_arriba" ).on( "click", subir );
		function subir()
		{
			$( "body, html, header" ).animate( { scrollTop : 0 }, 800 );
			return false;
		};
	};
}());


/*El buscador*/
(function()
{
	$(document).on("ready", buscar);
	function buscar()
	{
		$('#boton_buscar').on("click", abriendo);
	};
	function abriendo(ev)
	{
		ev.preventDefault();
		$('#boton_buscar').addClass('boton__buscar--abierto');
		$('#barra_busqueda').addClass('busqueda--abierta');
		$('#boton_buscar').off("click", abriendo);
		$('#boton_buscar').on("click", cerrando);
		function cerrando(ev)
		{
			ev.preventDefault();
			$('#boton_buscar').removeClass('boton__buscar--abierto');
			$('#barra_busqueda').removeClass('busqueda--abierta');
			$('#boton_buscar').off("click", cerrando);
			$('#boton_buscar').on("click", abriendo);
		};
	};
}());



// Acordeon
(function()
{
	$('.acordeon__contenido').not('.acordeon__header__titulo').hide();
	$('.acordeon__header__titulo').click(function()
	{
		if ($(this).hasClass('acordeon__header__titulo--abierto'))
		{
			$(this).removeClass('acordeon__header__titulo--abierto');
			$(this).next().slideUp();
		}
		else
		{
			$('.acordeon__header__titulo').removeClass('acordeon__header__titulo--abierto');
			$(this).addClass('acordeon__header__titulo--abierto');
			$('.acordeon__contenido').slideUp();
			$(this).next().slideDown();
		}
	});
}());




// El buscador
/*(function()
{
	$(document).on("ready", buscar);
	function buscar()
	{
		$('#boton_buscar').on("click", abriendo);
	};
	function abriendo(ev)
	{
		ev.preventDefault();
		$('#boton_buscar').addClass('boton__buscar--abierto');
		$('#barra_busqueda').addClass('busqueda--abierta');
		$('#boton_buscar').off("click", abriendo);
		$('#boton_buscar').on("click", cerrando);
		function cerrando(ev)
		{
			ev.preventDefault();
			$('#boton_buscar').removeClass('boton__buscar--abierto');
			$('#barra_busqueda').removeClass('busqueda--abierta');
			$('#boton_buscar').off("click", cerrando);
			$('#boton_buscar').on("click", abriendo);
		};
	};
}());*/


// Los cuadros de información. Se debería mejorar el script
/*(function()
{
	$(document).on("ready", cerrar_cuadro);
	function cerrar_cuadro()
	{
		$('.alerta-rojo .alerta--close a').on("click", borrando);
		function borrando(ev)
		{
			ev.preventDefault();
			$('.alerta-rojo').remove();
		}

		$('.alerta-verde .alerta--close a').on("click", borrando2);
		function borrando2(ev)
		{
			ev.preventDefault();
			$('.alerta-verde').remove();
		}

		$('.alerta-azul .alerta--close a').on("click", borrando3);
		function borrando3(ev)
		{
			ev.preventDefault();
			$('.alerta-azul').remove();
		}

		$('.alerta-amarillo .alerta--close a').on("click", borrando4);
		function borrando4(ev)
		{
			ev.preventDefault();
			$('.alerta-amarillo').remove();
		}

		$('.alerta-gris .alerta--close a').on("click", borrando5);
		function borrando5(ev)
		{
			ev.preventDefault();
			$('.alerta-gris').remove();
		}
	}
}());*/

/*
// Redimensionador del slider
(function()
{
	$(document).on("ready", medidor);

	function medidor()
	{
		var alto_imagen_slide = $('.slide .activo').height();
		// console.log(alto_imagen_slide);
		
		var altura_Slider = $('#slideshow').height();
		// console.log(altura_Slider);

		$('#slideshow').css(
		{
			'height':alto_imagen_slide
		});
		$('#slideshow .slide').css(
		{
			'height':alto_imagen_slide
		});


		$(window).resize(redimensionando);
		function redimensionando()
		{
			var alto = $(window).width();
			// console.log(alto);
			nuevo_alto_imagen_slide = $('.slide img').height();
			// console.log(nuevo_alto_imagen_slide);
			$('#slideshow').css(
			{
				'height':nuevo_alto_imagen_slide 
			});
			$('#slideshow .slide').css(
			{
				'height':alto_imagen_slide
			});
		};
		return redimensionando();
	}
}());
*/