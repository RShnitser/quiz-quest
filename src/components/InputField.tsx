import "./InputField.css";

type InputFieldProps = {
    label: string;
    type: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    
    name?: string;
    checked?: boolean;
    value?: string;
    error: string;
}

const InputField = ({label, type, error, ...props}: InputFieldProps) => {
    
    //const errorM = "";
    return (
        <>
            <div className={
                type === "text" || type === "password" 
                ? "input-vertical" 
                : "input-horizontal"}
            >
                <label className="input-label" htmlFor={label}>{label}</label>
                <input 
                    id={label}
                    type={type}
                    className={error.length ? "input-field input-error-bg" : "input-field"}
                    {...props}
                />
            </div>
            <div className="input-error">{error}</div>
        </>
    );
}

export default InputField;