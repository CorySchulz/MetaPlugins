


//! metastudio.js
//! version : 0.0.1
//! authors : Cory Schulz
//! license : private
//! xxxxxxx.com


(function (undefined) {

    this.MetaStudio = function(){

        ////////////////////////////////////////////////////////
        //              CONSTRUCTOR DECLARATIONS
        ////////////////////////////////////////////////////////

        // Set defaults
        var _ = this;

        // Read arguments passed in
            var property, properties = arguments[0];
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    // Set the new value
                    this[property] = properties[property];
                }
            }

    }

}()); // END Meta-Studio Plugin



MetaStudio.prototype.bindModelStudio = function (ul){
    
    // If an object, get the id
    if (typeof ul === 'object'){ 
        ul = "#"+ul.id;
    }

    $(ul).sortable({  
        grid: [50, 1],
        opacity: 0.7,
        cursor: "move",
        scroll: true,
        scrollSpeed: 100,
    
        start: function(event, ui) {
            
        	// Save start position
            var item = ui.item;
          	item.attr('startpos', item.find( "a" ).css('margin-left'));

            // Get child div and add dragging class
        	item.find( "a" ).addClass("dragging");
        },

        beforeStop : function(event, ui) {

        	var newPos = "";

            // Get new position
         
            // If it's a new item from the add bar
            if (ui.helper[0].style.left){ 
            	// Subtract 50 for the left difference
                newPos = parseInt(ui.helper[0].style.left);

            // We're moving an object that's already in the list
            }else{
                newPos = ui.position.left + parseInt(ui.item.attr('startpos') ) ;
            }

        

        	// Get rid of any extra pixels and make sure everything snaps back to the 50 px grid
        	newPos = (50 * Math.floor(newPos / 50));
        	
            // Keep position non-negative
        	if (newPos < 0) newPos = 0;
        	
            // Set column position of dragged bar
            ui.item.find( "a" ).css('margin-left', newPos);
            
            // If it doesn't have an id it's a new object.
            // Give it a temporary one and create a new object
    		if (ui.item.find( "a" ).attr("id") == null){
                var tempId = guidGenerator();
                ui.item.find( "a" ).attr("id", tempId );
                //createNewBlock(tempId, (newPos/50), $('#sortable-studio li').index(ui.item) );
    		}
        }, // Before Stop
        
        stop: function(e, ui) {
            // Remove drag class
            ui.item.find( "a" ).removeClass("dragging");
            // Update html
            $(ul + ' .new-studio-item a').html("Untitled");
            $(ul + ' .new-studio-item').removeClass('ui-draggable-handle');
            $(ul + ' .new-studio-item').removeClass('ui-draggable');
             
            $(ul + ' .new-studio-item').removeClass('new-studio-item');
            
            //updateStudioItems();
        }
        
    }); // END Sortable
         
   
    // Make top toolbar draggable into the studio
    $('#studio-add-bar > li').draggable({
        grid: [50, 1],
        cursor: 'move',
        connectToSortable: ul,
        opacity: 0.7,

    	helper: function(e, ui) {
            // Return helper element
            return $( '<li class="new-item-helper"><div></div></li>' );
        }
    });

        
} // END MetaStudio.prototype.bindModelStudio 
  
  
  
function guidGenerator() {
        return 'temp' + 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}


