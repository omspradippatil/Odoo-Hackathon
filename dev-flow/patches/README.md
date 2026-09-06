# Patches & Utility Scripts

This folder contains temporary fix/patch scripts used during development.

## Contents

### Fix Scripts (`fix_*.js`)
These are development utilities to fix specific issues:
- Admin reports, auth enums, billing pages
- Build fixes, data seeder fixes
- Database properties, demo hooks
- Invoice printing, local pages
- Mock data, pricing, product entities
- Seller labels, suspense handling
- Workspace UI/UX fixes (user, layout, RBAC, roles, customer)

### Patch Scripts (`patch_*.js`)
These are feature patches for specific functionality:
- Login, signup, navbar authentication
- Workspace layout, logout, mobile logout
- Trust page, workspace auth

### Generator/Wrapper Scripts
- `generate_admin_wrappers.js` - Admin wrapper generation
- `generate_wrappers.js` - General wrapper generation
- `rewrite_local.js`, `rewrite_local_page.js`, `rewrite_page.js` - Page rewriting utilities

---

## ⚠️ Note

These are **development/debugging scripts** and should not be committed to production. They were used during the development cycle to fix issues and test features. The actual production code is in `src/`.

For production deployment, these files can be ignored.