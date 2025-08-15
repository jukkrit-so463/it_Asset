import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, Lock, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();

  const from = location.state?.from?.pathname || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login logic
    if (username === "admin" && password === "admin123") {
      login(username, rememberMe);
      navigate(from, { replace: true });
    } else {
      alert("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4 shadow-lg">
            <Settings className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            IT Asset Management
          </h1>
          <p className="text-white/90 text-lg">
            ระบบจัดการทรัพย์สินไอที
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-blue-50 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">
                ชื่อผู้ใช้งาน
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="username"
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-white border-blue-200 text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                รหัสผ่าน
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white border-blue-200 text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-blue-300 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400"
                />
                <Label htmlFor="remember" className="text-gray-700 text-sm">
                  จดจําการเข้าสู่ระบบ
                </Label>
              </div>
              <button
                type="button"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors"
            >
              เข้าสู่ระบบ
            </Button>

            {/* Demo Account Info */}
            <div className="text-center space-y-1">
              <p className="text-gray-600 text-sm">Demo Account:</p>
              <p className="text-gray-600 text-sm font-mono">
                Username: admin | Password: admin123
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            © 2025 ITNMD Asset Management System.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
