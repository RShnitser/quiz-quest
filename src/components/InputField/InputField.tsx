import "./InputField.css";

type InputFieldProps = {
  label: string;
  type: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  name?: string;
  checked?: boolean;
  value?: string;
  min?: string;
  max?: string;
};

const InputField = ({ label, type, error, ...props }: InputFieldProps) => {
  return (
    <>
      <div
        className={
          type === "text" || type === "password" || type === "number"
            ? "input-vertical"
            : "input-horizontal"
        }
      >
        <input
          id={label}
          type={type}
          className={
            error.length ? "input-field input-error-bg" : "input-field"
          }
          {...props}
        />
        <label className="input-label" htmlFor={label}>
          {label}
        </label>
      </div>
      <div className="input-error">{error}</div>
    </>
  );
};

export default InputField;
