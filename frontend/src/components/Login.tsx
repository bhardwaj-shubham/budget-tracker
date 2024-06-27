import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

function Login() {
  return (
    <div className="mx-auto my-20 max-w-[440px] shadow-lg">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>You're not Logged In.</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <AlertCircle />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Please login to access this page.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4">
          <Button className="w-full mx-2" asChild>
            <a href="/api/login">Login</a>
          </Button>
          <Button className="w-full mx-2" variant="outline" asChild>
            <a href="/api/register">Register</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
