import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [showError,setShowError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  let showError = false;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    // try {
    const { success, message } = await login(email, password);
    console.log(message);
    if (success) {
      // setErrorMessage('');
      navigate("/admin/dashboard");
    } else {
      await Swal.fire({
        title: "Access Denied",
        text: message,
        icon: "warning",
        confirmButtonText: "Ok",
      });
      window.location.reload();
    }
    // }
    //  finally {
    //   setIsLoginLoading(false);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">TeamBoost</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoginLoading}
              >
                {isLoginLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          {showError && (
            <p className="text-red-500 text-sm text-center mt-2">
              {"Login failed. Check your credentials."}
            </p>
          )}

          <CardFooter className="flex justify-center flex-wrap">
            <p className="text-sm text-center text-gray-500 mt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary">
            ← Back to home
          </Link>
        </div>

        {/* <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo credentials:</p>
          <p>Admin: admin@TeamBoost.com / admin123</p>
          <p>User: user@TeamBoost.com / user123</p>
          <p>OTP code: 123456</p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
