import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import useAPIAfterEvent from "@/lib/api/hooks/useAPIAfterEvent.ts";
import { loginAPI } from "@/lib/api/endpoints/auth.endpoint.ts";
import { showToast } from "@/lib/helpers/ui.helper.ts";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/context/auth-provider.tsx";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { loading, callAPI: callLoginAPI } = useAPIAfterEvent({
    APIFunction: loginAPI,
  });

  const { login } = useAuth();

  const onSubmit = (data: LoginForm) => {
    callLoginAPI(
      data,
      (data) => {
        login(data);
        navigate("/student");
      },
      (e) => {
        showToast({
          title: e.response?.data?.message,
        });
      },
    );
  };

  return (
    <div className="min-h-screen w-screen p-4 flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Login</CardTitle>
          <ModeToggle />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register("email")} placeholder="Email" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <Input
              type="password"
              {...register("password")}
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Login
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
