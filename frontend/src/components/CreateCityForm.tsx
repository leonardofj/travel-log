import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

interface CreateCityFormProps {
  onClose: () => void;
  countries: any[];
}

const CreateCityForm = ({ onClose, countries }: CreateCityFormProps) => {
  const [city, setCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [state, setState] = useState("");
  const handleSubmit = (event) => {
    // console.log(api);
    event.preventDefault();
    console.log(`city: ${city}, state: ${state}, country: ${selectedCountry}`);
    onClose();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>City</FormLabel>
          <Input
            type="text"
            placeholder="City"
            size="lg"
            onChange={(event) => setCity(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired mt={6}>
          <FormLabel>Country</FormLabel>
          <Select
            placeholder="Select option"
            onChange={(event) => setSelectedCountry(event.currentTarget.value)}
            value={selectedCountry}
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mt={6}>
          <FormLabel>State</FormLabel>
          <Input
            type="text"
            placeholder="State"
            size="lg"
            onChange={(event) => setState(event.currentTarget.value)}
          />
        </FormControl>
        <Button colorScheme="blue" mt={5} mb={3} onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateCityForm;
