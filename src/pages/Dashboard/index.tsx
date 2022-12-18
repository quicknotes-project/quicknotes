import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import Form from "../../components/ui/Form";
import { Maybe } from "../../types";
import { cn, renderIf } from "../../utils";
import "./Dashboard.css";

export default function Dashboard() {
  const { username, fullname, tryUpdateUser } = useAuth();

  const [usernameInput, setUsernameInput] = useState<string>("");
  const [fullnameInput, setFullnameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Maybe<string>>(null);

  const fields = [
    {
      label: "Username",
      value: usernameInput,
      onChange: setUsernameInput,
      name: "username",
      invalid: false,
      invalidMessage: "username must be non-empty",
      placeholder: "Enter a new username...",
      required: false,
    },
    {
      label: "Your name",
      value: fullnameInput,
      onChange: setFullnameInput,
      name: "fullname",
      invalid: false,
      invalidMessage: "fullname must be non-empty",
      placeholder: "Enter a new name...",
      required: false,
    },
    {
      label: "Password",
      value: passwordInput,
      onChange: setPasswordInput,
      name: "password",
      type: "password",
      invalid: false,
      invalidMessage: "password must be non-empty",
      placeholder: "Enter a new password...",
      required: false,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched(true);
    setLoading(true);
    setErrorMessage(null);

    if (
      fields.some((field) => field.required && field.invalid) ||
      [usernameInput, passwordInput, fullnameInput].every(
        (value) => value.trim() === ""
      )
    ) {
      setLoading(false);
      return;
    }

    const res = await tryUpdateUser({
      username: usernameInput,
      password: passwordInput,
      fullname: fullnameInput,
    });

    if (!res.success) {
      setErrorMessage(res.message);
    }

    setLoading(false);
  };

  return (
    <main className="dashboard">
      <h1>
        {fullname} ({username})
      </h1>
      <h2>Update user info</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <Form.InputGroup
            key={`user-field-${index}`}
            label={field.label}
            value={field.value}
            onChange={(e) => {
              setTouched(false);
              field.onChange(e.target.value);
            }}
            id={field.name}
            name={field.name}
            type={field.type}
            className="user-input-group"
            disabled={loading}
            invalid={field.invalid}
            touched={touched}
            invalidMessage={field.invalidMessage}
            placeholder={field.placeholder}
          />
        ))}

        {renderIf(
          touched && (loading || !!errorMessage),
          <div className={cn("status", { "error-message": !!errorMessage })}>
            {errorMessage || "loading..."}
          </div>
        )}

        <button className="button submit" disabled={loading}>
          Submit
        </button>
      </form>
    </main>
  );
}
