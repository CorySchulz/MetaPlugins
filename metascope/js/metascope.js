


//! metascope.js
//! version : 0.0.1
//! authors : Cory Schulz
//! license : none
//! xxxxxxx.com

(function (undefined) {

	// Define our constructor
	this.Metascope = function() {

		////////////////////////////////////////////////////////
		//				CONSTRUCTOR DECLARATIONS
		////////////////////////////////////////////////////////

			// Set defaults
			var _ = this;
			_.data = [];
			_.idkey = "id";
			_.rowkey = "row";
			_.colkey = "col";

			// Read in and save arguments
			var property, properties = arguments[0];
			for (property in properties) {
				if (properties.hasOwnProperty(property)) {
					// Set the new value
					_[property] = properties[property];
				}
			}

			// Sort data by row
			_.data.sort(sortByRow)

			// Sort by row compare funcion
			function sortByRow(a, b) {
				if (a[_.rowkey] < b[_.rowkey]) {
					return -1;
				}else if (a[_.rowkey] > b[_.rowkey]) {
					return 1;
				}
				return 0; // must be equal - this isn't possible if the data is correct
			}

	} // END Metascope constructor


	////////////////////////////////////////////////////////
	//					META METHODS
	////////////////////////////////////////////////////////

		// **************** ROOT FUNCTIONS ****************
			Metascope.prototype = {
				getRoots: function(){	// Get the root nodes

					if (this.data.length == 0){ return []; }
			    	var res = [];

			    	// for each item in the data array
			    	for (var i = 0; i < this.data.length; ++i){
			    		// if the column value is 0, it's a root
			    		if (this.data[i][this.colkey] == 0){
			    			res.push(this.data[i]);
			    		}
			    	}
			    	return res;
		    	},
		    	getRootIndex: function(node){		// Get the indes of this root node

		    		if (node == null){ return -1; }
			    	var roots = this.getRoots().sort(this.sortByRow);
			    	var res = -1;

			    	// If it's an object just get the index and return it
			    	if (typeof node === 'object'){
						res = roots.indexOf(node);

					}else if (typeof node === 'string'){ // String, we gotta search
						
						for (var i = 0; i < roots.length; ++i){
							// if we found the one with the matchine id, save in res and break
							if (roots[i][this.idkey] == node){
								res = i;
								break;
							}
						}
					}
			    	return res;
			    },


		// **************** PARENT FUNCTIONS ****************
				getParent: function(node){
					if (node == null){ return []; }
					if (node == 0){ return -1; }


					// If string id, we gotta search for the object
		    		if (typeof node === 'string'){ 
		    			node = this.getNodeWithId(node);
					}

					var res = {};
					var colkey = this.colkey;
					var data = this.data;
					var nodeIndex = data.indexOf(node);
					var colPos = node[colkey];

					// If we're a root node, we don't have any parents :(
					if (node[colkey] == 0){ return 0; }

					for (var i=(nodeIndex-1); i > -1; --i){
						if (data[i][colkey] <  colPos){
							return data[i];
						}
					}

					return res;
				},
				getRootParent: function(node){		// Get the root of this branch
					if (node == null){ return []; }
			    	var roots = this.getRoots().sort(this.sortByRow);

			    	// If there's only one root, then that's gotta be it
			    	if (roots.length == 1){
			    		return roots[0];
			    	}

			    	// If string id, we gotta search for the object
		    		if (typeof node === 'string'){ 
		    			node = this.getNodeWithId(node);
					}

					// Check to see if this is a root node, if so return it
					if (node[this.colkey] == 0){
						return node;
					}

					// Get the index of the node we're starting with
					var data = this.data;
					var nodeIndex = data.indexOf(node);
					var colkey = this.colkey;

					// Start where the node is and go up
					for (var i=(nodeIndex-1); i > -1; --i){
						if (data[i][colkey] == 0){	// We found a root node, return it
							return data[i];
						}
					}

			    	return null;
			    },
			    getAllParents: function(node){		// Get all parents of this node
			    	if (node == null){ return []; }
			    	var res = [];

			    	// If string id, we gotta search for the object
		    		if (typeof node === 'string'){ 
		    			node = this.getNodeWithId(node);
					}

					// Check to see if this is a root node, if so return nothing
					if (node[this.colkey] == 0){
						return [];
					}

					var data = this.data;
					var nodeIndex = data.indexOf(node);
					var colkey = this.colkey;
					var colPos = node[colkey];

					// Start where the node is and go up
					for (var i=(nodeIndex-1); i > -1; --i){
						if (data[i][colkey] < colPos){
							res.unshift(data[i]);
							colPos = data[i][colkey];
						}
						if (data[i][colkey] == 0){	// We found a root node, return it
							break;
						}
					}

			    	return res;
			    },
		

		// **************** CHILD FUNCTIONS ****************
				getDescendants: function(node){  		// Get all decendants - Children and grand childre, etc.
					if (node == null){ return []; }

			    	var res = [];

			    	// If string id, we gotta search for the object
		    		if (typeof node === 'string'){ 
		    			node = this.getNodeWithId(node);
					}

					var data = this.data;
					var nodeIndex = data.indexOf(node);
					var colkey = this.colkey;
					var startColPos = node[colkey];

					// This is the last node, return empty array
					if (nodeIndex == (data.length-1) ){ 
						return [];
					}

					// If we're already at the end of a branch, return empty
					if (data[nodeIndex+1][colkey] <= node[colkey]){
						return [];
					}

					// Search starting at the next node index
					for (var i=(nodeIndex+1); i < data.length; ++i ){
						// If it's deeper than where we started, push it on
						if (data[i][colkey] > startColPos){
							res.push(data[i]);

						// If we're back to the level that we started, break
						}else if (data[i][colkey] == startColPos){
							break;
						} 
					}
					
					return res;
			    },
			    getChildren: function(node){		// Get the children - no grandchildren
			    	if (node == null){ return []; }
			    	if (node == 0) { return this.getRoots(); }

			    	var res = [];

			    	// If string id, we gotta search for the object
		    		if (typeof node === 'string'){ 
		    			node = this.getNodeWithId(node);
					}

					var data = this.data;
					var nodeIndex = data.indexOf(node);
					var colkey = this.colkey;
					var startColPos = node[colkey];

					// This is the last node, return empty array
					if (nodeIndex == (data.length-1) ){ 
						return [];
					}

					// If we're already at the end of a branch, return empty
					if (data[nodeIndex+1][colkey] <= node[colkey]){
						return [];
					}

					// Increment the column position we want (children)
					++startColPos;

					// Search adding children at the next node index
					for (var i=(nodeIndex+1); i < data.length; ++i ){
						// If it's deeper than where we started, push it on
						if (data[i][colkey] == startColPos){
							res.push(data[i]);

						// If we're on any other level, break
						}else if (data[i][colkey] == (startColPos-1)){
							break;
						} 
					}

			    	return res;
			    },
			    getDeepestDescendantColumnValue: function(node){	// Get deepest descendant col val

			    	var res = -1;
			    	var colkey = this.colkey;
			    	var desc;

			    	if (node == 0){  // If 0 then start with all data
			    		desc = this.data;

			    	}else if (node == null){
			    		return -1;

			    	}else{
			    		// If string id, we gotta search for the object
			    		if (typeof node === 'string'){ 
			    			node = this.getNodeWithId(node);
						}

			    		desc = this.getDescendants(node);
			    		res = node[colkey];
			    	}

			    	// If no descendants, return empty object
			    	if (desc.length == 0){ return res; }

			    	// Find the descendant with the largest column value
			    	for (var i=0; i < desc.length; ++i){
			    		// If it's deeper, save it
			    		if (desc[i][colkey] > res){
			    			res = desc[i][colkey];
			    		}
			    	}
			    	return res;
			    },


		// **************** SIBLING FUNCTIONS ****************
				/*
				getSiblingsAbove: function(node){		// Get siblings above
			    	console.log('sib above');
			    	// Get all siblings
			    	// Remove siblings below, including node

			    	// Just splice the array at the indexOf(node) ?

			    	return 1;
			    },
			    getSiblingsBelow: function(node){		// Get siblings below
			    	console.log('sib below');

			    	// get all siblings
			    	// Remove siblings above, including node
			    	return 1;
			    },
			    */

			    getAllSiblings: function(node){		// Get all siblings
			    	
			    	// If string id, we gotta search for the object
		    		if (typeof node === 'string'){ 
		    			node = this.getNodeWithId(node);
					}

			    	if (node == null || node == 0 ){  // Can't get siblings of origin or null
			    		return -1;
			    	}

			    	// If we're a root, just get the roots
					if (node[this.colkey] == 0){
						return this.getRoots();
					}

					// Get the parent, then get all children
			    	var res = this.getChildren( this.getParent(node) );

			    	// Remove node from the children list ??  <- Decoded to leave original node in there
			    	// res.splice(res.indexOf(node), 1);

			    	return res;
			    },


		// **************** HELPER FUNCTIONS ****************
				setData: function (d){
					this.data = d.sort(this.sortByRow);
				},
				setIdKey: function (k){
					this.idkey = k;
				},
				setRowKey: function (k){
					this.rowkey = k;
				},
				setColKey: function (k){
					this.colkey = k;
				},
				sortDataByRow: function(){
					this.data = this.data.sort(this.sortByRow);
				},
				shiftNode: function(node, sCol, eCol, sRow, eRow){ 					//    <--------     SHIFT
					console.log('shift node');
				},
				shiftNodeWithChildren: function(node, sCol, eCol, sRow, eRow){		//    <--------     SHIFT
					console.log('shift node with kids');

					// Splice out node and its children from data
					// Inject into new position
					// Update row for all items in the data 
					//    - later make this more efficient to only update affected nodes
					// Shift col of node and all child nodes (if sCol == eCol, no change)
					// return new data set

				},
				getNodeWithId: function (id){
					var data = this.data;
					var idkey = this.idkey;
					// Find node with id and return it
					for (var i=0; i < data.length; ++i){
						if (data[i][idkey] == id){
							return data[i];
						}
					}
					return null;
				},
				getIndexofNodeWithId: function (id){
					var data = this.data;
					var idkey = this.idkey;
					// Find node with id and return it
					for (var i=0; i < data.length; ++i){
						if (data[i][idkey] == id){
							return i;
						}
					}
					return null;
				},
				toString: function(){
					var res = "\n";
					var data = this.data;
					var colkey = this.colkey;
					var idkey = this.idkey;

					this.sortDataByRow();	// Make sure the data is sorted by row
					
					// Go through each row
					for (var i=0; i < data.length; ++i){
						// Indent once for every column
						for (var k=0; k < data[i][colkey]; ++k){
							res += "|   ";
						}
						res += data[i][idkey] + "\n";
					}

					return res + "\n";
				},
				log: function(){
					console.log(this.toString());
				}
			} // END Metascope Prototype functions
		

}()); // END Metascope 







