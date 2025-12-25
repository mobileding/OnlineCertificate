import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation'; // <--- CHANGED THIS

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
// Lightweight wrappers around Next.js' navigation APIs
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing); // <--- AND THIS