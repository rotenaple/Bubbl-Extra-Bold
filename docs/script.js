document.addEventListener('DOMContentLoaded', function() {
    var textbox = document.querySelector('.sample-textbox');

    function autoExpand(field) {
        // Reset field height
        field.style.height = 'inherit';

        // Get the computed styles for the element
        var computed = window.getComputedStyle(field);

        // Calculate the height
        var height = field.scrollHeight + parseInt(computed.getPropertyValue('border-top-width'), 10) + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
        
        field.style.height = height + 'px';
    }

    // Initial adjustment
    autoExpand(textbox);

    // Adjust on input events
    textbox.addEventListener('input', function() {
        autoExpand(textbox);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var toggleButton = document.getElementById('toggleDlig');
    var textboxes = document.querySelectorAll('.toggle');
    var checkboxImage = toggleButton.querySelector('img');

    toggleButton.addEventListener('click', function() {
        textboxes.forEach(function(textbox) {
            textbox.classList.toggle('dlig-on');
        });

        if (textboxes[0].classList.contains('dlig-on')) {
            checkboxImage.src = 'img/checkbox_1.svg';
        } else {
            checkboxImage.src = 'img/checkbox_0.svg';
        }
    });
});
