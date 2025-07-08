import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Form, FormField, FormActions } from "@/components/common/Form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCommon } from "@/hooks/useCommon";
import { ROUTES } from "@/lib/constants";
import { AlertCircle } from "lucide-react";
import { Helmet } from 'react-helmet';

export default function LoginSimple() {
  const { login, isLoading, navigate, t } = useCommon();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate(ROUTES.DASHBOARD);
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

        <Helmet>
            <title>Loginsimple | Talkcon</title>
            <meta name="description" content="Loginsimple page of Talkcon platform." />
        </Helmet>
  return (
    <PageLayout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t("auth.login.title") || "Sign in to your account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link
                to={ROUTES.SIGNUP}
                className="font-medium text-primary hover:text-primary/80"
              >
                create a new account
              </Link>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <FormField
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />

                <FormField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  required
                />

                <FormActions
                  submitText={isLoading ? "Signing in..." : "Sign in"}
                  isLoading={isLoading}
                />
              </Form>

              <div className="mt-4 text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
