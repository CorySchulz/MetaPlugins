
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

        // If we got an argument passed in
        var properties = arguments[0];
        if (properties){
            // Bind to 
            this.bindModelStudio(properties);
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
          	item.attr('data-startpos', item.css('margin-left'));

            // Get child div and add dragging class
        	item.addClass("dragging");
        },

        beforeStop : function(event, ui) {
            console.log('beforeStop')

        	var newPos = "";
            var isNew = false;

            // If it doesn't have an id it's a new object.
            // Give it a temporary one and create a new object
            if (ui.item.attr("id") == null){
                
                isNew = true;
            }

            // If it's a new item from the add bar
            if (ui.item.attr("id") == null){ 
            	// Subtract 50 for the left difference
                ui.item.attr("id", guidGenerator() );
                newPos = parseInt(ui.helper[0].style.left);
                console.log('newPos', newPos);

            
            }else{  // We're moving an object that's already in the list
                // get the original start position
                console.log('\n\nUI POS', ui.position.left );
                console.log('Saved pos', parseInt(ui.item.attr('data-startpos') ));
                newPos = ui.position.left + parseInt(ui.item.attr('data-startpos') ) ;
            }

        	// Get rid of any extra pixels and make sure everything snaps back to the 50 px grid
        	newPos = (50 * Math.floor(newPos / 50));
        	
            // Keep position non-negative
        	if (newPos < 0) newPos = 0;

            // Set column position of dragged row
            ui.item.css('margin-left', newPos);
            
        }, // Before Stop
        
        stop: function(e, ui) {
            // Remove drag class
            ui.item.removeClass("dragging");
            // Update html for new element
            $(ul + ' .new-studio-item').html("Untitled");
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

    	helper: function(e) {
            // Return helper element
            return $( '<div class="new-item-helper"><div>Hello</div></div>' );
        }
    });

        
} // END MetaStudio.prototype.bindModelStudio 

  
function guidGenerator() {
        return 'temp' + 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}


