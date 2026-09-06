const fs = require('fs');
const glob = require('glob');

// Since we are running in an environment where we can modify the CSS easily, 
// and we just added overflow-x: hidden to body, that fixes horizontal scroll.

// We will add line-clamp-1 or truncate to card titles globally if they seem like they could overflow,
// but actually, we should just let them wrap gracefully with `break-words`.

const files = glob.sync('src/app/**/*.tsx');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix long email/names breaking flex layouts by adding min-w-0 to flex children where appropriate.
    // That's too risky with regex. Let's just fix known common issues.

    // 1. Long text escaping cards: 
    // Add "break-words" to text-navy, text-navy/70 etc where they are plain paragraphs or headings inside cards.
    // e.g. <p className="text-sm ...">
    if (content.includes('className="text-sm font-medium text-navy/70"') && !content.includes('break-words')) {
        content = content.replace(/className="text-sm font-medium text-navy\/70"/g, 'className="text-sm font-medium text-navy/70 break-words"');
        changed = true;
    }

    if (content.includes('className="text-lg font-bold text-navy"') && !content.includes('break-words')) {
        content = content.replace(/className="text-lg font-bold text-navy"/g, 'className="text-lg font-bold text-navy break-words"');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
    }
});

