import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Form from "../../components/ui/Form";
import { cn, renderIf } from "../../utils";
import { Maybe } from "../../types";
import "./AuthPage.css";

const authModes = ["Sign in", "Sign up"] as const;

type AuthMode = typeof authModes[number];

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { tryLogin, tryRegister } = useAuth();

  const [authMode, setAuthMode] = useState<AuthMode>("Sign in");

  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Maybe<string>>(null);

  const fields = [
    {
      label: "Username",
      value: username,
      onChange: setUsername,
      name: "username",
      invalid: username.trim().length < 1,
      invalidMessage: "username must be non-empty",
      placeholder: "Enter username...",
      required: true,
    },
    {
      label: "Your name",
      value: fullname,
      onChange: setFullname,
      name: "fullname",
      invalid: fullname.trim().length < 1,
      invalidMessage: "fullname must be non-empty",
      placeholder: "Enter your name...",
      required: authMode === "Sign up",
    },
    {
      label: "Password",
      value: password,
      onChange: setPassword,
      name: "password",
      type: "password",
      invalid: password.trim().length < 1,
      invalidMessage: "password must be non-empty",
      placeholder: "Enter password...",
      required: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched(true);
    setLoading(true);
    setErrorMessage(null);

    if (fields.some((field) => field.required && field.invalid)) {
      setLoading(false);
      return;
    }

    if (authMode === "Sign up") {
      const res = await tryRegister({ username, fullname, password });
      if (!res.success) {
        console.log("");
        setErrorMessage(res.message);
        setLoading(false);
        return;
      }
    }

    const res = await tryLogin({ username, password });

    if (!res.success) {
      setErrorMessage(res.message);
      setLoading(false);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <main className="auth-container">
      <div className="auth-header">
        <h3 className="auth-title">{authMode}</h3>

        <div className="auth-subtitle">
          <span>Not registered yet?</span>
          <div
            className="auth-switch link"
            onClick={() => {
              setTouched(false);
              setAuthMode((state) =>
                state === "Sign in" ? "Sign up" : "Sign in"
              );
            }}
          >
            {authMode === "Sign in" ? "Sign up" : "Sign in"}
          </div>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <Form.InputGroup
            key={`auth-field-${index}`}
            label={field.label}
            value={field.value}
            onChange={(e) => {
              setTouched(false);
              field.onChange(e.target.value);
            }}
            id={field.name}
            name={field.name}
            type={field.type}
            className="auth-input-group"
            disabled={loading}
            hidden={!field.required}
            invalid={field.invalid}
            touched={touched}
            invalidMessage={field.invalidMessage}
            placeholder={field.placeholder}
          />
        ))}

        {renderIf(
          touched && (loading || !!errorMessage),
          <div
            className={cn("auth-status", { "error-message": !!errorMessage })}
          >
            {errorMessage || "loading..."}
          </div>
        )}

        <button className="button" disabled={loading}>
          Submit
        </button>
      </form>
    </main>
  );
}
