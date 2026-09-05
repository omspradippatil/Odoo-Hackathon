const fs = require('fs');

const files = [
  'app/workspace/quotations/new/page.tsx',
  'app/workspace/dashboard/page.tsx',
  'app/workspace/pipeline/page.tsx',
  'app/local/page.tsx',
  'app/local/checkout/[id]/page.tsx'
];

const classMap = {
  'text-gray-9000': 'text-gray-500',
  'text-zinc-200': 'text-gray-900',
  'hover:text-zinc-200': 'hover:text-gray-900',
  'hover:bg-zinc-700': 'hover:bg-gray-200',
  'bg-emerald-950': 'bg-emerald-100',
  'border-emerald-700': 'border-emerald-200',
  'border-emerald-800': 'border-emerald-200',
  'border-emerald-800/60': 'border-emerald-200',
  'border-emerald-800/80': 'border-emerald-200',
  'text-emerald-400': 'text-emerald-600',
  'bg-emerald-950/60': 'bg-emerald-100',
  'bg-emerald-950/80': 'bg-emerald-100',
  'bg-emerald-950/10': 'bg-emerald-50',
  'bg-purple-950': 'bg-blue-100',
  'border-purple-800': 'border-blue-200',
  'text-purple-400': 'text-blue-600',
  'bg-red-950': 'bg-red-100',
  'text-red-400': 'text-red-600',
  'text-red-300': 'text-red-600',
  'border-red-800': 'border-red-200',
  'border-red-900/50': 'border-red-200',
  'bg-red-950/20': 'bg-red-50',
  'bg-red-950/30': 'bg-red-100',
  'hover:bg-red-950/30': 'hover:bg-red-100',
  'border-red-800/80': 'border-red-200',
  'bg-red-950/10': 'bg-red-50',
  'bg-amber-950': 'bg-amber-100',
  'text-amber-400': 'text-amber-600',
  'border-amber-800': 'border-amber-200',
  'border-amber-800/80': 'border-amber-200',
  'bg-amber-950/10': 'bg-amber-50',
  'bg-amber-950/60': 'bg-amber-100',
  'border-blue-900/40': 'border-blue-200',
  'bg-blue-950/20': 'bg-blue-50',
  'text-blue-400': 'text-blue-600',
  'text-blue-300': 'text-blue-600',
  'bg-blue-950/10': 'bg-blue-50',
  'border-blue-800/80': 'border-blue-200',
  'text-zinc-500': 'text-gray-500',
  'placeholder-zinc-500': 'placeholder-gray-500',
  'text-zinc-600': 'text-gray-600',
  'hover:text-white': 'hover:text-blue-600',
  'text-white': 'text-white', // keeping button text white
  'bg-gray-50/40': 'bg-gray-50',
  'bg-gray-50/50': 'bg-gray-50',
  'bg-gray-50/60': 'bg-gray-50',
  'bg-gray-50/20': 'bg-gray-50',
  'bg-gray-50/30': 'bg-gray-50',
  'bg-gray-50/70': 'bg-gray-50',
  'hover:bg-gray-50/70': 'hover:bg-gray-100',
  'border-gray-200/80': 'border-gray-200',
  'border-gray-200/60': 'border-gray-200',
  'bg-gradient-to-r': '',
  'from-blue-950/70': 'bg-blue-50',
  'via-indigo-950/40': '',
  'to-zinc-900': '',
  'bg-orange-950/60': 'bg-orange-100',
  'border-orange-800': 'border-orange-200',
  'text-orange-400': 'text-orange-600'
};

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  for (const [oldClass, newClass] of Object.entries(classMap)) {
    // We use a global replace but carefully to match whole words if possible, or just exact string match.
    // Given tailwind classes, direct string replacement usually works fine for these specific colors.
    content = content.split(oldClass).join(newClass);
  }
  
  // Specific fix for Local Mode banner text white -> gray-900
  // "text-white" might be replaced, but it's used in buttons. We only want to replace it in the banner heading.
  if (file.includes('local/page.tsx')) {
    content = content.replace('text-2xl sm:text-4xl font-black tracking-tight text-white', 'text-2xl sm:text-4xl font-black tracking-tight text-gray-900');
  }
  if (file.includes('local/checkout/[id]/page.tsx')) {
    content = content.replace('text-lg text-white font-mono', 'text-lg text-gray-900 font-mono');
  }

  // Ensure any lingering text-gray-800 becomes text-gray-900 for stronger contrast if desired
  // Or text-zinc-600 -> text-gray-600
  content = content.split('text-zinc-600').join('text-gray-600');
  content = content.split('text-zinc-500').join('text-gray-500');

  fs.writeFileSync(file, content);
}
console.log("Done refactoring classes.");
