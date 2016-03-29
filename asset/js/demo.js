$(document).ready(function() {
    var chat = true;
    
    $('#chat-control').click(function(e) {
        e.preventDefault();
        chat = !chat;
        if (chat) {
            $('.chat').show();
        } else {
            $('.chat').hide();
        }
    });
});