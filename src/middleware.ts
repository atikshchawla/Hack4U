export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/setup/:path*",
    "/api/submit/:path*",
    "/api/team/:path*",
    "/api/users/profile/:path*",
  ],
};
