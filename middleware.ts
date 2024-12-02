import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/docs", "/sign-in", "/sign-up"],
  afterAuth(auth, req) {
    // Redirect to dashboard after sign in
    if (auth.userId && req.nextUrl.pathname === "/") {
      const dashboard = new URL("/dashboard", req.url);
      return Response.redirect(dashboard);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
