"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Box, CircularProgress } from '@mui/material';


const publicRoutes = ["/", "/settings", "/signin", "/signup", ["/medications"]];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoading = status === "loading";
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname?.startsWith(`${route}/`)
  );
  
  useEffect(() => {

    if (!isLoading && !session && !isPublicRoute) {
      router.push("/signin");
    }
  }, [isLoading, session, router, pathname, isPublicRoute]);


  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  

  if (!session && !isPublicRoute) {
    return null;
  }
  

  return <>{children}</>;
}
