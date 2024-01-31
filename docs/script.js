document.addEventListener('DOMContentLoaded', function () {
    const textbox = document.querySelector('.sample-textbox');
    const toggleButton = document.getElementById('toggleDlig');
    const textboxes = document.querySelectorAll('.toggle');
    const fontSizeDropdown = document.getElementById('fontSizeDropdown');

    // Generate random colors
    updateColors();
    setInterval(updateColors, 5000);

    // Auto-expand textarea and initialise font size
    textbox.addEventListener('input', function () {
        updateTextboxFontSize(fontSizeDropdown.value, textbox);
        autoExpand(this);
    });
    autoExpand(textbox); // Initial adjustment
    textbox.style.fontSize = fontSizeDropdown.value + 'px';

    // Toggle discretionary ligatures
    toggleButton.addEventListener('click', function () {
        toggleDlig(textboxes, this.querySelector('img'));
    });

    // Populate Unicode tables
    populateUnicodeTable('basic-latin-table', 0x0020, 0x007F);
    populateUnicodeTable('latin-1-supplement-table', 0x00A0, 0x00FF);
    populateUnicodeTable('latin-ext-a-table', 0x0100, 0x017F);

    // Disable autocorrection
    disableAutoFeatures();

    // Font size controls
    document.getElementById('increaseFontSize').addEventListener('click', function () {
        changeFontSize(1);
        updateTextboxFontSize(fontSizeDropdown.value, textbox);
        autoExpand(textbox);
    });
    document.getElementById('decreaseFontSize').addEventListener('click', function () {
        changeFontSize(-1);
        updateTextboxFontSize(fontSizeDropdown.value, textbox);
        autoExpand(textbox);
    });

    fontSizeDropdown.addEventListener('change', function () {
        textbox.style.fontSize = this.value + 'px';
    });

    window.addEventListener('resize', function () {
        autoExpand(textbox);
    });

    // Random Color Button
    const randomColorButton = document.getElementById('randomColorButton');
    randomColorButton.addEventListener('click', function () {
        const { rgb, backgroundIsDark } = generateContrastValidRGB();
        let textColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        textbox.style.color = textColor;
        textbox.style.backgroundColor = backgroundIsDark ? '#333333' : '#EBEBEB';
    });
});

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

function toggleDlig(textboxes, checkboxImage) {
    textboxes.forEach(textbox => textbox.classList.toggle('dlig-on'));
    checkboxImage.src = textboxes[0].classList.contains('dlig-on') ? 'img/checkbox_1.svg' : 'img/checkbox_0.svg';
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

function changeFontSize(direction) {
    var dropdown = document.getElementById('fontSizeDropdown');
    var currentIndex = dropdown.selectedIndex;
    var maxIndex = dropdown.options.length - 1;

    // Calculate new index
    var newIndex = currentIndex + direction;

    // Ensure new index is within the range
    if (newIndex >= 0 && newIndex <= maxIndex) {
        dropdown.selectedIndex = newIndex;
    }
}

function updateTextboxFontSize(fontSize, textbox) {
    textbox.style.fontSize = fontSize + 'px';
}

function autoExpand(field) {
    // Reset field height
    field.style.height = 'inherit';

    // Calculate the height
    var computed = window.getComputedStyle(field);
    var height = field.scrollHeight + parseInt(computed.getPropertyValue('border-top-width'), 10) + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';
}


// Color generation for accent text - returns three text colors on light background
function generateColors() {
    let h = Math.floor(Math.random() * 360);
    const colors = [];
    const baseColor = { r: 235, g: 235, b: 235 }; // RGB of #ebebeb as an object
    for (let i = 0; i < 3; i++) {
        let s = 70 + Math.floor(Math.random() * 25); // Saturation: 50-90%
        let l = 40 + Math.floor(Math.random() * 35); // Lightness: 20-75%
        let rgbArray, rgbObject, cr;
        do {
            rgbArray = hslToRgb(h, s, l);
            rgbObject = { r: rgbArray[0], g: rgbArray[1], b: rgbArray[2] }; // Convert array to object
            cr = getContrastRatio(rgbObject, baseColor);
            if (cr < 3) {
                l -= 5; // Decrement lightness to increase contrast
                if (l < 0) {
                    break; // Break the loop if lightness is too low
                }
            }
        } while (cr < 3);

        if (l >= 0) {
            console.log(`Accepted Color - HSL(${h}, ${s}, ${l}), RGB(${rgbObject.r}, ${rgbObject.g}, ${rgbObject.b}), Contrast Ratio: ${cr.toFixed(2)}`);
            colors.push(`rgb(${rgbObject.r}, ${rgbObject.g}, ${rgbObject.b})`);
        }

        h = (h + 90 + Math.floor(Math.random() * 61)) % 360; // Adjust hue for the next color
    }
    return colors;
}

function updateColors() {
    const colors = generateColors();
    document.querySelector('.color-1').style.color = colors[0];
    document.querySelector('.color-2').style.color = colors[1];
    document.querySelector('.color-3').style.color = colors[2];
}

// Color generation for textbox - returns one text color and corresponding background brightness
function generateContrastValidRGB() {
    let rgbArray, rgbObject, lightRatio, darkRatio, success, selectedBackground;
    do {
        // Generate random HSL values, avoid greys
        const h = Math.floor(Math.random() * 360);
        const s = 50 + Math.floor(Math.random() * 40); // Saturation: 50-90%
        const l = 25 + Math.floor(Math.random() * 55); // Lightness: 25-80%
        
        // Convert HSL to RGB and then to object
        rgbArray = hslToRgb(h, s, l);
        rgbObject = { r: rgbArray[0], g: rgbArray[1], b: rgbArray[2] };

        lightRatio = getContrastRatio(rgbObject, { r: 235, g: 235, b: 235 });
        darkRatio = getContrastRatio(rgbObject, { r: 51, g: 51, b: 51 });
        success = (lightRatio >= 3 || darkRatio >= 6);

        selectedBackground = darkRatio <= 6 && lightRatio > 3 ? 'light' : 'dark';

        console.log(`Generating colour: [${rgbObject.r}, ${rgbObject.g}, ${rgbObject.b}] ${success ? 'success' : 'fail'}, light: [${lightRatio.toFixed(2)}] dark: [${darkRatio.toFixed(2)}]`);
    } while (!success);

    return {
        rgb: rgbObject,
        backgroundIsDark: selectedBackground === 'dark'
    };
}

function hslToRgb(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
    };
    return [f(0), f(8), f(4)];
}

function isContrastValid(rgb1, rgb2) {
    const contrastRatio = getContrastRatio(rgb1, rgb2);
    return contrastRatio >= 4.5; // WCAG AA minimum contrast ratio for normal text
}

function getContrastRatio(rgb1, rgb2) {
    let lum1 = getLuminance(rgb1);
    let lum2 = getLuminance(rgb2);
    return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
}

function getLuminance(rgb) {
    let a = [rgb.r, rgb.g, rgb.b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}