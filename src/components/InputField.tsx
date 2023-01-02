type InputFieldProps = {
    label: string;
    type: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    
    name?: string;
    checked?: boolean;
    value?: string;
}

const InputField = ({label, ...props}: InputFieldProps) => {
    
    return (
        <>
            <label htmlFor={label}>{label}</label>
            <input 
                id={label}
                className="form-input"
                {...props}
            />
        </>
    );
}

export default InputField;