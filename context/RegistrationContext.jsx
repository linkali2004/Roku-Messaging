"use client";
const { createContext, useState } = require("react");

export const RegistrationContext = createContext();

export default function RegistrationContextProvider({ children }) {
  const [name, setName] = useState({name:"User",userID:null});
  const[isUpdated,setIsUpdated] = useState(false);
  const [fieldValues, setFieldValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const[signinSuccess,setSignInSuccess] = useState(false);
  const[signupSuccess,setSignUpSuccess] = useState(false);
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value) {
          error = "Username is required.";
        } else if (value.length < 3) {
          error = "Username must be at least 3 characters long.";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = "Email is required.";
        } else if (!emailRegex.test(value)) {
          error = "Invalid email address.";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required.";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters long.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors, [name]: error };

      if (!error) {
        delete newErrors[name];
      }

      return newErrors;
    });

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(fieldValues).forEach((key) => {
      const error = validateField(key, fieldValues[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      setSafe(true);
      console.log("Form submitted successfully", fieldValues);
    } else {
      setSafe(false);
      console.log("Form contains errors", newErrors);
    }
  };

  return (
    <RegistrationContext.Provider
      value={{
        fieldValues,
        setFieldValues,
        errors,
        handleBlur,
        handleSubmit,
        signinSuccess,
        setSignInSuccess,
        name, 
        setName,
        signupSuccess,
        setSignUpSuccess,
        isUpdated,
        setIsUpdated
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}
