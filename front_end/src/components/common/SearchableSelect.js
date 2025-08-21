import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress
} from '@mui/material';

const SearchableSelect = ({
  options = [],
  loading = false,
  onSelectionChange,
  onSearchChange,
  getOptionLabel,
  getOptionValue,
  placeholder = "Search...",
  label,
  value,
  error,
  helperText,
  required = false,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (onSearchChange) {
      onSearchChange(newInputValue);
    }
  };

  const handleSelectionChange = (event, newValue) => {
    if (onSelectionChange) {
      onSelectionChange(newValue);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel || ((option) => option.label || option.name || option.toString())}
      value={value}
      onChange={handleSelectionChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      isOptionEqualToValue={(option, value) => {
        if (getOptionValue) {
          return getOptionValue(option) === getOptionValue(value);
        }
        return option?.id === value?.id;
      }}
    />
  );
};

export default SearchableSelect;
