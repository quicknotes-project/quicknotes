import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Form from '../../components/Form';
import './AuthPage.css';

enum AuthModes {
  'Sign in',
  'Sign up',
}

type AuthMode = keyof typeof AuthModes;

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('Sign in');

  const [username, setUsername] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [touched, setTouched] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { tryLogin, tryRegister } = useAuth();

  const fields = [
    {
      label: 'Username',
      value: username,
      onChange: setUsername,
      name: 'username',
      invalid: username.trim().length < 1,
      invalidMessage: 'username must be non-empty',
      placeholder: 'Enter username...',
      required: true,
    },
    {
      label: 'Your name',
      value: fullname,
      onChange: setFullname,
      name: 'fullname',
      invalid: fullname.trim().length < 1,
      invalidMessage: 'fullname must be non-empty',
      placeholder: 'Enter your name...',
      required: authMode === 'Sign up',
    },
    {
      label: 'Password',
      value: password,
      onChange: setPassword,
      name: 'password',
      type: 'password',
      invalid: password.trim().length < 1,
      invalidMessage: 'password must be non-empty',
      placeholder: 'Enter password...',
      required: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    console.log({ username, fullname, password });

    if (fields.some((field) => field.required && field.invalid)) {
      return;
    }

    const authFn =
      authMode === 'Sign in'
        ? () => tryLogin(username, password)
        : () => tryRegister(username, fullname, password);

    const res = await authFn();
    if (!res) {
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <main className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h3 className="auth-title">{authMode}</h3>

          <div className="auth-subtitle">
            Not registered yet?{' '}
            <div
              className="auth-switch link"
              onClick={() =>
                setAuthMode((state) =>
                  state === 'Sign in' ? 'Sign up' : 'Sign in'
                )
              }
            >
              {authMode === 'Sign in' ? 'Sign up' : 'Sign in'}
            </div>
          </div>
        </div>

        <div className="auth-body">
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
              hidden={field.name === 'fullname' && authMode === 'Sign in'}
              invalid={field.invalid}
              touched={touched}
              invalidMessage={field.invalidMessage}
              placeholder={field.placeholder}
            />
          ))}
        </div>

        <div className="auth-footer">
          <button className="button" type="submit">Submit</button>
        </div>
      </form>
    </main>
  );
}
