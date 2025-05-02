import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import useAPIAfterEvent from "@/lib/api/hooks/useAPIAfterEvent.ts";
import { registerAPI } from "@/lib/api/endpoints/auth.endpoint.ts";
import { useAuth } from "@/components/context/auth-provider.tsx";
import { Loader2 } from "lucide-react";
import { handleFormError } from "@/lib/helpers/ui.helper.ts";
import useAPIGetItems from "@/lib/api/hooks/useAPIGetItems.ts";
import { getAllBatchesAPI } from "@/lib/api/endpoints/common.api.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

const registerSchema = z
  .object({
    full_name: z.string().min(2),
    email: z.string().email(),
    batch_id: z.coerce.number().min(1, "Please select a batch"),
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const { loading, callAPI: callToRegisterAPI } = useAPIAfterEvent({
    APIFunction: registerAPI,
  });

  const { loading: loadingBatch, items } = useAPIGetItems({
    APIFunction: getAllBatchesAPI,
  });

  const { login } = useAuth();

  const onSubmit = (data: RegisterForm) => {
    callToRegisterAPI(
      data,
      (data) => {
        login(data);
        navigate("/student");
      },
      (error) => {
        handleFormError({ setError, error });
      },
    );
  };

  return (
    <div className="min-h-screen w-screen p-4 flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Register</CardTitle>
          <ModeToggle />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register("full_name")} placeholder="Full Name" />
            {errors.full_name && (
              <p className="text-red-500 text-sm">{errors.full_name.message}</p>
            )}
            <Input {...register("email")} placeholder="Email" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <Select
              onValueChange={(value) => setValue("batch_id", Number(value))}
              disabled={loadingBatch}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {items?.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id.toString()}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.batch_id && (
              <p className="text-red-500 text-sm">{errors.batch_id.message}</p>
            )}

            <Input
              type="password"
              {...register("password")}
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <Input
              type="password"
              {...register("password_confirmation")}
              placeholder="Confirm Password"
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm">
                {errors.password_confirmation.message}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Register
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
