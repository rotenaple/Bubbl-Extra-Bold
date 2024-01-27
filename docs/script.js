document.addEventListener('DOMContentLoaded', function() {
    // Auto-expand textarea
    const textbox = document.querySelector('.sample-textbox');
    textbox.addEventListener('input', function() {
        autoExpand(this);
    });
    autoExpand(textbox); // Initial adjustment

    // Toggle discretionary ligatures
    const toggleButton = document.getElementById('toggleDlig');
    const textboxes = document.querySelectorAll('.toggle');
    toggleButton.addEventListener('click', function() {
        toggleDlig(textboxes, this.querySelector('img'));
    });

    // Populate Unicode table
    populateUnicodeTable('basic-latin-table', 0x0020, 0x007F);
    populateUnicodeTable('latin-1-supplement-table', 0x00A0, 0x00FF);
    populateUnicodeTable('latin-ext-a-table', 0x0100, 0x017F);
    disableAutoFeatures();
});

function autoExpand(field) {
    // Reset field height
    field.style.height = 'inherit';

    // Calculate the height
    var computed = window.getComputedStyle(field);
    var height = field.scrollHeight + parseInt(computed.getPropertyValue('border-top-width'), 10) + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    
    field.style.height = height + 'px';
}

function toggleDlig(textboxes, checkboxImage) {
    textboxes.forEach(textbox => textbox.classList.toggle('dlig-on'));
    checkboxImage.src = textboxes[0].classList.contains('dlig-on') ? 'img/checkbox_1.svg' : 'img/checkbox_0.svg';
}

function populateUnicodeTable(blockId, start, end) {
    const table = document.getElementById(blockId);
    let html = '';

    for (let i = start; i <= end; i++) {
        // Start a new row for characters every 8 characters
        if ((i - start) % 8 === 0) {
            if (i !== start) {
                html += '</tr><tr>'; // End the previous row of codes and start a new row for characters
            }
        }

        // Add the character cell
        html += `<td onmouseover="showEnlargedCharacter('&#${i};', '${`U+${i.toString(16).toUpperCase().padStart(4, '0')}`}')">&#${i};</td>`;

        // Add the Unicode code cell at the end of the row
        if ((i - start) % 8 === 7 || i === end) {
            html += '</tr><tr>'; // End the row for characters and start a new row for codes
            for (let j = i - 7; j <= i; j++) {
                let paddedCode = j.toString(16).toUpperCase().padStart(4, '0');
                html += `<td class="unicode-code">${paddedCode}</td>`;
            }
        }
    }

    html += '</tr>'; // Close the final row
    table.innerHTML = html;
}

function showEnlargedCharacter(character, code) {
    const enlargedCharacter = document.getElementById('enlarged-character');
    enlargedCharacter.innerHTML = `<p>${character}</p>`;
}

function disableAutoFeatures() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('spellcheck', 'false');
    });
}