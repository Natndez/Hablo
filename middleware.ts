import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// All routes (pages) that can be accessed without being signed in
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])


export default clerkMiddleware((auth, request) => {
    if(!isPublicRoute(request)) {
        auth().protect(); // Protecting all routes that are not defined in isPublicRoute
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};