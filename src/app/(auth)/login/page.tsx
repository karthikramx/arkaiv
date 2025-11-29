"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Shield, Users, Building } from "lucide-react";

export default function Page() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user } = useAuth();

  // Get role from URL query parameter
  const role = searchParams.get("role") || "employee";

  // Define role-based styling
  const getRoleConfig = (userRole: string) => {
    switch (userRole) {
      case "admin":
        return {
          color: "red",
          bgGradient: "bg-gradient-to-br from-red-50 to-red-100",
          cardBorder: "border-red-200",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          buttonStyle: "bg-red-600 hover:bg-red-700",
          icon: Shield,
          title: "Admin Portal",
          description:
            "Administrative access only. Manage system settings, users, and permissions.",
        };
      case "contractor":
        return {
          color: "green",
          bgGradient: "bg-gradient-to-br from-green-50 to-green-100",
          cardBorder: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          buttonStyle: "bg-green-600 hover:bg-green-700",
          icon: Building,
          title: "Contractor Portal",
          description:
            "Contractor access only. Access assigned projects and documents.",
        };
      case "employee":
      default:
        return {
          color: "blue",
          bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100",
          cardBorder: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          buttonStyle: "bg-blue-600 hover:bg-blue-700",
          icon: Users,
          title: "Employee Portal",
          description:
            "Employee access only. Access company resources and team documents.",
        };
    }
  };

  const roleConfig = getRoleConfig(role);
  const IconComponent = roleConfig.icon;

  useEffect(() => {
    if (user) router.push("/home");
  }, [user, router]);

  return (
    <div
      className={cn(
        "flex min-h-svh w-full items-center justify-center p-6 md:p-10",
        roleConfig.bgGradient
      )}
    >
      <div className="w-full max-w-sm mt-[-350px]">
        <div className={cn("flex flex-col gap-6")}>
          <Card className={cn("shadow-lg", roleConfig.cardBorder)}>
            <CardHeader className="text-center">
              <div
                className={cn(
                  "mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center",
                  roleConfig.iconBg
                )}
              >
                <IconComponent
                  className={cn("h-6 w-6", roleConfig.iconColor)}
                />
              </div>
              <CardTitle className="text-xl">{roleConfig.title}</CardTitle>
              <CardDescription>{roleConfig.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);

                  try {
                    // Step 1: Validate user role before authentication
                    const roleValidation = await fetch(
                      "/api/auth/validate-role",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          email: email,
                          requiredRole: role,
                        }),
                      }
                    );

                    const roleResult = await roleValidation.json();

                    console.log("Verifying role for user:", email);
                    console.log("Required role:", role);
                    console.log("Role validation result:", roleResult);

                    if (!roleResult.isValid) {
                      toast.error(
                        roleResult.error || "Access denied for this portal"
                      );
                      setIsLoading(false);
                      return;
                    }

                    // Step 2: Proceed with Firebase authentication
                    const response = await login(email, password);

                    if (!response.error) {
                      toast.success("Login Successful");
                      router.push("/home");
                    } else {
                      toast.error(
                        "Login Failed. Please check your credentials."
                      );
                    }
                  } catch (error) {
                    console.error("Login error:", error);
                    toast.error("Login failed. Please try again.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="/forgotpassword"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </Field>
                  <Field>
                    <Button
                      type="submit"
                      className={cn(
                        "w-full text-white",
                        roleConfig.buttonStyle
                      )}
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Validating..."
                        : `Login as ${
                            role.charAt(0).toUpperCase() + role.slice(1)
                          }`}
                    </Button>
                  </Field>

                  {/* Security Notice */}
                  <Field>
                    <div
                      className={cn(
                        "text-xs text-center p-2 rounded-md border",
                        roleConfig.iconColor,
                        roleConfig.cardBorder,
                        roleConfig.iconBg
                      )}
                    >
                      🔒 This portal is restricted to authorized {role}s only.
                      Your access will be verified before login.
                    </div>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
