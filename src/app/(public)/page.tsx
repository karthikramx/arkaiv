"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Building, Shield, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 justify-center pt-40">
        <section className="container max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xl text-muted-foreground">
              Choose your login type to access the platform
            </p>
          </div>

          {/* Login Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Admin Login Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Admin Login</CardTitle>
                <CardDescription>
                  Access administrative controls and system management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <button
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => {
                      window.location.href = "/login?role=admin";
                    }}
                  >
                    Login as Admin
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Employee Login Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Employee Login</CardTitle>
                <CardDescription>
                  Access your employee dashboard and company resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      window.location.href = "/login?role=employee";
                    }}
                  >
                    Login as Employee
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Contractor Login Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Contractor Login</CardTitle>
                <CardDescription>
                  Access contractor portal and project information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <button
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => {
                      window.location.href = "/login?role=contractor";
                    }}
                  >
                    Login as Contractor
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
