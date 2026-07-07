import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import { consumeSessionExpiredFlag, getAuthSession, loginUser } from "../api/eloquentApi";

const signInVisual = "/assets/images/auth/eloquent-sign-in-visual.png";

const SignInLayer = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (consumeSessionExpiredFlag()) {
      setNotice("Your session has expired. Please sign in again.");
    }
  }, []);

  if (getAuthSession()?.token) {
    return <Navigate replace to="/blogs" />;
  }

  const handleLogin = async (values, helpers) => {
    setError("");
    setNotice("");

    try {
      await loginUser(values);
      navigate("/blogs");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <section className="auth eloquent-signin">
      <div className="eloquent-signin-visual">
        <img alt="Photography lens and film artwork" src={signInVisual} />
      </div>
      <div className="eloquent-signin-panel">
        <div className="eloquent-signin-form">
          <h1>Sign In</h1>
          <Formik initialValues={{ email: "", password: "" }} onSubmit={handleLogin}>
            {({ isSubmitting }) => (
              <Form className="eloquent-signin-fields">
                <label>
                  <span>Email</span>
                  <Field
                    autoComplete="email"
                    name="email"
                    placeholder="Email"
                    required
                    type="email"
                  />
                </label>
                <label>
                  <span>Password</span>
                  <div className="eloquent-password-field">
                    <Field
                      autoComplete="current-password"
                      name="password"
                      placeholder="Password"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="eloquent-password-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                      title={showPassword ? "Hide password" : "Show password"}
                      type="button"
                    >
                      <Icon
                        icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"}
                        width="21"
                      />
                    </button>
                  </div>
                </label>

                {notice && <div className="eloquent-alert">{notice}</div>}
                {error && <div className="eloquent-alert error">{error}</div>}

                <button
                  className="eloquent-signin-button"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;
