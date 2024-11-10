"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await fetch(
            `http://localhost:5000/callback?code=${code}`
          );
          const data = await response.json();

          localStorage.setItem("token", data.token);
          if (data.name) localStorage.setItem("userName", data.name);
          if (data.picture) localStorage.setItem("userPicture", data.picture);

          router.push("/dashboard");
          if (localStorage.getItem("isGoogleSignup")) {
            fetch("http://localhost:5000/steps", {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            })
              .then((response) => response.json())
              .then((fitnessData) => {
                localStorage.setItem(
                  "fitnessData",
                  JSON.stringify(fitnessData)
                );
              })
              .catch((error) => {
                console.error("Error fetching fitness data:", error);
              });
          }
        } catch (error) {
          console.error("Error in callback:", error);
          router.push("/signup?error=callback_failed");
        }
      }
    };

    handleCallback();
  }, [router]);

  return null; 
}
