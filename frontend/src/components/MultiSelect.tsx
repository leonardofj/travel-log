import React from "react";
import { Select } from "chakra-react-select";
import { Box, FormControl, FormLabel } from "@chakra-ui/react";
import { MultiSelectOption, MultiSelectProps } from "./interfaces";

const MultiSelect: React.FC<MultiSelectProps> = ({
  mt,
  label,
  options,
  selectedOptions,
  setSelectedOptions,
  placeholder = "...",
}) => {
  // Convert the selectedOptions array of numbers to array of Option objects
  const selectedOptionObjects = options.filter((option) =>
    selectedOptions.includes(option.value)
  );

  const handleChange = (selected: MultiSelectOption[] | null) => {
    // Convert the selected Option objects back to an array of numbers
    const selectedValues = selected
      ? selected.map((option) => option.value)
      : [];
    setSelectedOptions(selectedValues);
  };
  return (
    <FormControl mt={mt}>
      <FormLabel>{label}</FormLabel>
      <Box>
        <Select
          useBasicStyles
          isMulti
          options={options}
          value={selectedOptionObjects}
          onChange={(selected) => handleChange(selected as MultiSelectOption[])}
          placeholder={`Select ${placeholder}`}
          closeMenuOnSelect={false}
        />
      </Box>
    </FormControl>
  );
};

export default MultiSelect;
