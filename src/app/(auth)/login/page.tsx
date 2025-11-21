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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
          title: "Admin Login",
          description: "Access administrative controls and system management",
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
          title: "Contractor Login",
          description: "Access contractor portal and project information",
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
          title: "Employee Login",
          description: "Access your employee dashboard and company resources",
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
                  const response = await login(email, password);
                  if (!response.error) {
                    toast("Login Successful");
                    router.push("/home");
                  } else if (response.error) {
                    console.log("From the login component, raise toast there");
                    toast("Login Failed, Please check your credentials");
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
                      onClick={() => {}}
                    >
                      Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Button>
                    {/* <Button variant="outline" type="button">
                          Login with Google
                        </Button> */}
                    {/* <FieldDescription className="text-center">
                      Don&apos;t have an account?{" "}
                      <a
                        href="/signup"
                        className={cn("underline", roleConfig.iconColor)}
                      >
                        Sign up
                      </a>
                    </FieldDescription> */}
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
