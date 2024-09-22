import { RegistrationContext } from '@/context/RegistrationContext';
import { TextField } from '@mui/material';
import React, { useCallback, useContext } from 'react';

export default function InputBox(props) {
  const { fieldValues, setFieldValues, errors, handleBlur } = useContext(RegistrationContext);

  const changeHandler = useCallback(
    (e) => {
      setFieldValues((temp) => ({ ...temp, [e.target.name]: e.target.value })); 
    },
    [setFieldValues]
  );

  return (
    <div className='flex flex-col gap-2 w-full mt-3'>
      <p className='text-sm text-gray-400 font-semibold'>{props.label}</p>
      <TextField
        name={props.name} 
        placeholder={props.label}
        value={fieldValues[props.name] || ''} 
        variant="outlined"
        size="small"
        onChange={changeHandler}
        onBlur={handleBlur}
        error={!!errors[props.name]} 
        helperText={errors[props.name]} 
      />
    </div>
  );
}
