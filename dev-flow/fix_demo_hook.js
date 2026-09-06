const fs = require('fs');

let content = fs.readFileSync('src/components/demo/DemoShortcut.tsx', 'utf8');

// The early return must go AFTER all hooks!
// Wait, the early return is:
/*
  if (isAuth === true || isAuth === null) {
    return null;
  }
*/
// And then there's:
/*
  // Handle ESC key to close on desktop
  useEffect(() => { ...
*/

// Let's remove it from there and put it right before the `return (` statement.
content = content.replace(
  `
  if (isAuth === true || isAuth === null) {
    return null;
  }
`,
  ""
);

content = content.replace(
  '  if (!mounted) return null;',
  '  if (!mounted || isAuth === true || isAuth === null) return null;'
);

fs.writeFileSync('src/components/demo/DemoShortcut.tsx', content);
