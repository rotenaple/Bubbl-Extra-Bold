document.addEventListener('DOMContentLoaded', function () {
    const textbox = document.querySelector('.sample-textbox');
    const toggleButton = document.getElementById('toggleDlig');
    const textboxes = document.querySelectorAll('.toggle');
    const fontSizeDropdown = document.getElementById('fontSizeDropdown');

    // Generate random colors
    const colors = generateColors();
    document.querySelector('.color-1').style.color = colors[0];
    document.querySelector('.color-2').style.color = colors[1];
    document.querySelector('.color-3').style.color = colors[2];

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

function contrastRatio(rgb1, rgb2) {
    const luminance = rgb => {
        const a = rgb.map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };

    const lum1 = luminance(rgb1);
    const lum2 = luminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function generateColors() {
    let h = Math.floor(Math.random() * 360);
    const colors = [];
    const baseColor = [235, 235, 235]; // RGB of #ebebeb
    for (let i = 0; i < 3; i++) {
        // Set saturation and lightness to avoid neon colors
        let s = 50 + Math.floor(Math.random() * 30); // Saturation: 50-80%
        let l = 60 + Math.floor(Math.random() * 30); // Lightness: 60-90%
        let rgb, cr;
        do {
            rgb = hslToRgb(h, s, l);
            cr = contrastRatio(rgb, baseColor);
            if (cr < 4.5) {
                l -= 5; // Adjust lightness to modify contrast
            }
        } while (cr < 4.5);
        colors.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
        h = (h + 90 + Math.floor(Math.random() * 61)) % 360;
    }
    return colors;
}

console.log(generateColors());


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
        success = (lightRatio >= 4.5 || darkRatio >= 4.5);

        selectedBackground = darkRatio >= 4.5 && lightRatio < 4.5 ? 'dark' : 'light';

        console.log(`Generating colour: [${rgbObject.r}, ${rgbObject.g}, ${rgbObject.b}] ${success ? 'success' : 'fail'}, light: [${lightRatio.toFixed(2)}] dark: [${darkRatio.toFixed(2)}]`);
    } while (!success);

    return {
        rgb: rgbObject,
        backgroundIsDark: selectedBackground === 'dark'
    };
}

function isContrastValid(rgb1, rgb2) {
    const contrastRatio = getContrastRatio(rgb1, rgb2);
    return contrastRatio >= 4.5; // WCAG AA minimum contrast ratio for normal text
}

function getLuminance(rgb) {
    let a = [rgb.r, rgb.g, rgb.b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(rgb1, rgb2) {
    let lum1 = getLuminance(rgb1);
    let lum2 = getLuminance(rgb2);
    return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
}