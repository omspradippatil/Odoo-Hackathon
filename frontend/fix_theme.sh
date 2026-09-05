#!/bin/bash
# Remove "dark" from html tag in layout.tsx
sed -i '' 's/className="dark"//g' app/layout.tsx
sed -i '' 's/bg-zinc-950/bg-gray-50/g' app/layout.tsx
sed -i '' 's/text-zinc-50/text-gray-900/g' app/layout.tsx

# Replace common dark classes across all files
find app components -type f -name "*.tsx" -exec sed -i '' -e 's/bg-zinc-950/bg-white/g' {} +
find app components -type f -name "*.tsx" -exec sed -i '' -e 's/bg-zinc-900/bg-gray-50/g' {} +
find app components -type f -name "*.tsx" -exec sed -i '' -e 's/bg-zinc-800/bg-gray-100/g' {} +
find app components -type f -name "*.tsx" -exec sed -i '' -e 's/border-zinc-800/border-gray-200/g' {} +
find app components -type f -name "*.tsx" -exec sed -i '' -e 's/border-zinc-700/border-gray-300/g' {} +
find app components -type f -name "*.tsx" -exec sed -i '' -e 's/text-zinc-400/text-gray-500/g' {} +
find app components -type f -name "*.tsx" -exec sed -i '' -e 's/text-zinc-300/text-gray-600/g' {} +
find app components -type f -name "*.tsx" -exec sed -i '' -e 's/text-zinc-50/text-gray-900/g' {} +
find app components -type f -name "*.tsx" -exec sed -i '' -e 's/text-zinc-100/text-gray-800/g' {} +
