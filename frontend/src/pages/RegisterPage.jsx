import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Phone, UserPlus, ChevronLeft, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { useLanguage } from "../context/LanguageContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("citizen");
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Validators
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Strict Validations
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
      alert("All fields are compulsory. Please fill all the details.");
      return;
    }

    if (!validateEmail(formData.email)) {
      alert("Invalid email format. Please enter a valid email address.");
      return;
    }

    if (formData.mobile.length !== 10) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    if (!validatePassword(formData.password)) {
      alert("Weak Password! Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character (e.g., @, #, $, !).");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert(t("passwordMismatch") || "Passwords do not match!");
      setError(t("passwordMismatch"));
      return;
    }

    if (!agreed) {
      alert(t("mustAgreeTerms") || "You must agree to the terms and conditions.");
      setError(t("mustAgreeTerms"));
      return;
    }

    if (role === "admin") {
      alert("Admin registration is not allowed. Please contact system administrator.");
      setError("Admin registration is not allowed. Please contact system administrator.");
      return;
    }

    setLoading(true);

    const result = await authService.register({
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
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
      navigate("/dashboard");
    } else {
      const errorMsg = result.message ? result.message.toLowerCase() : "";
      // Check if user is already registered
      if (errorMsg.includes("already") || errorMsg.includes("exists") || errorMsg.includes("use")) {
        alert("User is already registered! Redirecting to login page.");
        navigate("/login");
      } else {
        alert(result.message || "Registration failed.");
        setError(result.message);
      }
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200/40 via-transparent to-emerald-900/40"></div>

      <Link
        to="/"
        className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-teal-800 hover:bg-white flex items-center gap-1 font-medium shadow-lg transition"
      >
        <ChevronLeft size={20} /> {t("BackToHome")}
      </Link>

      <div className="relative z-10 flex w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden bg-white my-8">
        <div className="hidden md:flex md:w-2/5 relative bg-gradient-to-br from-emerald-700 to-teal-900 items-center justify-center p-8">
          <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-600/30 rounded-full -translate-y-20 -translate-x-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full translate-y-16 translate-x-16"></div>

          <div className="relative z-10 text-center">
            <div className="w-40 h-40 mx-auto rounded-full border-2 border-white/40 flex items-center justify-center mb-6 bg-emerald-800/50">
              <div className="w-24 h-24 rounded-full bg-emerald-600/60 flex items-center justify-center">
                <UserPlus size={60} className="text-white/80" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-wider mb-2">{t("signUp")}</h1>
            <p className="text-emerald-100 text-sm mt-4">{t("भूमि-सेवा")}</p>
          </div>
        </div>

        <div className="w-full md:w-3/5 bg-white p-8 md:p-10">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0f766e" strokeWidth="3"/>
                <circle cx="50" cy="50" r="8" fill="#0f766e"/>
                {[...Array(24)].map((_, i) => (
                  <line key={i} x1="50" y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                    stroke="#0f766e" strokeWidth="1.5"/>
                ))}
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold font-hindi text-orange-600">{t("bhoomiSevaHindi")}</h2>
              <p className="text-sm font-semibold text-teal-800">{t("bhoomiSevaEng")}</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800">{t("createAccount")}</h3>
          <p className="text-sm text-gray-500 mb-4">{t("registerSubtitle")}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">{t("fullName")}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={18} />
                <input
                  type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                  placeholder={t("full Name")}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">{t("EmailAddress")}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={18} />
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    placeholder={t("Enter email")}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">{t("mobileNumber")}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={18} />
                  <input
                    type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                    pattern="[0-9]{10}" maxLength="10"
                    placeholder={t("mobile No.")}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">{t("password")}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={18} />
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                    placeholder={t("Enter Password")}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-700">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">{t("confirmPassword")}</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleChange} required
                    placeholder={t("confirmPassword")}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-700">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 pt-1">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded accent-teal-700"/>
              <span>{t("agreeTerms")}</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-700 to-teal-800 text-white py-3 rounded-md font-semibold hover:from-emerald-800 hover:to-teal-900 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("registering")}
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  {t("register")}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            {t("alreadyHaveAccount")}{" "}
            <Link to="/login" className="text-teal-700 font-semibold hover:underline">
              {t("loginHere")}
            </Link>
          </p>

          <p className="text-xs text-center text-gray-400 mt-3">{t("@2026 copyright")}</p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;