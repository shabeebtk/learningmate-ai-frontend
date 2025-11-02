// const handleLogout = async () => {
//     try {
//       // get refresh token from cookies
//       const refresh = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("refresh_token="))
//         ?.split("=")[1];

//       // delete cookies (both access + refresh)
//       document.cookie =
//         "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//       document.cookie =
//         "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

//       // reset user context
//       setUser(null);

//       // redirect
//       router.push("/register");
//     } catch (err) {
//       console.error("Logout failed", err);
//       router.push("/register");
//     }
//   };