import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { saveData } from "../saveData";
import fetchData from "../fetchData";

interface CreateCityFormProps {
  onClose: () => void;
}

const CreateCityForm = ({ onClose }: CreateCityFormProps) => {
  const [city, setCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [state, setState] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const result = await fetchData("countries");
        if (result.error) {
          console.log(result.error);
        } else {
          setCountries(result.data);
        }
      } catch (err) {
        console.log("An unexpected error occurred while fetching data");
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`city: ${city}, state: ${state}, country: ${selectedCountry}`);
    try {
      const res = await saveData<object>({
        path: "cities",
        data: { city: city, state: state, country: selectedCountry },
      });
      console.log(res.data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error making POST request:", error);
    }
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
