import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, LogIn, ChevronLeft, RefreshCw, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { authService } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("citizen");
  const [captcha, setCaptcha] = useState("");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    captchaInput: ""
  });

  // Generate captcha
  const generateCaptcha = () => {
    const num = Math.floor(100000 + Math.random() * 900000).toString();
    setCaptcha(num);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.captchaInput !== captcha) {
      alert(t("invalidCaptcha") || "Invalid Captcha. Please try again.");
      setError(t("invalidCaptcha"));
      generateCaptcha();
      setFormData({ ...formData, captchaInput: "" });
      return;
    }

    if (!formData.identifier || !formData.password) {
      alert(t("pleaseEnterValid") || "Please enter email/mobile and password.");
      setError(t("pleaseEnterValid"));
      return;
    }

    setLoading(true);

    const result = await authService.login({
      identifier: formData.identifier,
      password: formData.password,
      role: role,
    });

    if (result.success) {
      const userData = {
        userId: result.data.userId,
        id: result.data.userId,
        fullName: result.data.fullName,
        name: result.data.fullName,
        email: result.data.email,
        mobile: result.data.mobile,
        role: result.data.role.toLowerCase(),
        createdAt: result.data.createdAt, 
        avatar: null,
      };
      login(userData, result.data.token);
      navigate(result.data.role === "ADMIN" ? "/admin" : "/dashboard");
    } else {
      const errorMsg = result.message ? result.message.toLowerCase() : "";
      
      // Check if user is not registered
      if (errorMsg.includes("not found") || errorMsg.includes("register")) {
        alert("User not found! Please register first.");
        navigate("/register");
      } 
      // Check if password is wrong or invalid credentials
      else if (errorMsg.includes("password") || errorMsg.includes("invalid") || errorMsg.includes("wrong")) {
        alert("Wrong password or invalid credentials. Please try again.");
        setError(result.message);
        generateCaptcha();
        setFormData({ ...formData, captchaInput: "" });
      } 
      // Any other error
      else {
        alert(result.message || "Login failed.");
        setError(result.message);
        generateCaptcha();
        setFormData({ ...formData, captchaInput: "" });
      }
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200/40 via-transparent to-green-900/30"></div>

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-teal-800 hover:bg-white flex items-center gap-1 font-medium shadow-lg transition"
      >
        <ChevronLeft size={20} /> {t("BackToHome")}
      </Link>

      {/* Main Card */}
      <div className="relative z-10 flex w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* LEFT PANEL - Teal */}
        <div className="hidden md:flex md:w-2/5 relative bg-gradient-to-br from-teal-700 to-teal-900 items-center justify-center p-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-teal-600/30 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/20 rounded-full translate-y-16 -translate-x-16"></div>

          <div className="relative z-10 text-center">
            <div className="w-40 h-40 mx-auto rounded-full border-2 border-white/40 flex items-center justify-center mb-6 bg-teal-800/50">
              <div className="w-24 h-24 rounded-full bg-teal-600/60 flex items-center justify-center">
                <User size={60} className="text-white/80" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-wider mb-2">{t("logIn")}</h1>
            <p className="text-teal-100 text-sm mt-4">{t("भूमि-सेवा")}</p>
          </div>
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="w-full md:w-3/5 bg-white p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0f766e" strokeWidth="3"/>
                <circle cx="50" cy="50" r="8" fill="#0f766e"/>
                {[...Array(24)].map((_, i) => (
                  <line
                    key={i}
                    x1="50" y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                    stroke="#0f766e" strokeWidth="1.5"
                  />
                ))}
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold font-hindi text-orange-600">{t("bhoomiSevaHindi")}</h2>
              <p className="text-sm font-semibold text-teal-800">{t("bhoomiSevaEng")}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                {t("Email Address")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={18} />
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                {t("Password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-700 hover:text-teal-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                {t("captcha")}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-200 rounded-md flex items-center justify-center py-2.5 font-bold text-lg tracking-widest text-gray-800 select-none"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.05) 8px, rgba(0,0,0,0.05) 16px)"
                  }}
                >
                  {captcha.split("").join(" ")}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="px-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  title="Refresh Captcha"
                >
                  <RefreshCw size={18} className="text-teal-700" />
                </button>
                <div className="relative flex-1">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={16} />
                  <input
                    type="text"
                    name="captchaInput"
                    value={formData.captchaInput}
                    onChange={handleChange}
                    placeholder={t("enterCaptcha")}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-200">
              <p className="text-center text-gray-700 text-sm mb-3">Login As</p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setRole("citizen")}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition border-2 ${
                    role === "citizen"
                      ? "bg-orange-50 text-orange-600 border-orange-500"
                      : "bg-white text-orange-500 border-orange-300 hover:border-orange-500"
                  }`}
                >
                  {t("citizen")}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition border-2 ${
                    role === "admin"
                      ? "bg-orange-50 text-orange-600 border-orange-500"
                      : "bg-white text-orange-500 border-orange-300 hover:border-orange-500"
                  }`}
                >
                  {t("admin")}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-700 to-teal-800 text-white py-3 rounded-md font-semibold hover:from-teal-800 hover:to-teal-900 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("loggingIn")}
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  {t("login")}
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              New user?{" "}
              <Link to="/register" className="text-teal-700 font-semibold hover:underline">
                {t("Register Now")}
              </Link>
            </p>
          </form>

          <p className="text-xs text-center text-gray-400 mt-5">
            {t("@2026 copyright")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;