import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { saveData } from "../utils/saveData";
import fetchData from "../utils/fetchData";

interface CreateStopsFormProps {
  onClose: () => void;
}

interface Stop {
  city: string;
  arrival: string;
  departure: string;
}

const CreateStopsForm = ({ onClose }: CreateStopsFormProps) => {
  const [stops, setStops] = useState<Stop[]>([
    { city: "", arrival: "", departure: "" },
  ]);
  const [trip, setTrip] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await fetchData("cities");
        if (result.error) {
          console.log(result.error);
        } else {
          setCities(result.data);
        }
      } catch (err) {
        console.log("An unexpected error occurred while fetching data");
      }
    };
    fetchCities();
  }, []);

  const handleInputChange = (
    index: number,
    field: keyof Stop,
    value: string
  ) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    setStops(newStops);
  };

  const addStop = () => {
    setStops([...stops, { city: "", arrival: "", departure: "" }]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await saveData<object>({
        path: "stops",
        data: { stops: stops, trip: trip },
      });
      console.log(res.data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Box w={"95%"}>
            {/* Do this better */}
            <Flex>
              <Box w={"30%"}>
                <Text>City</Text>
              </Box>
              <Spacer />
              <Box w={"30%"}>
                <Text>Arrival</Text>
              </Box>
              <Spacer />
              <Box w={"30%"}>
                <Text>Departure</Text>
              </Box>
            </Flex>
          </Box>
          {stops.map((stop, index) => (
            <HStack spacing={4}>
              <FormControl id={`city-${index}`} isRequired>
                <Select
                  placeholder="Select city"
                  onChange={(e) =>
                    handleInputChange(index, "city", e.target.value)
                  }
                  value={stop.city}
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.country}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id={`arrival-${index}`} isRequired>
                <Input
                  type="datetime-local"
                  value={stop.arrival}
                  placeholder="Arrival"
                  onChange={(e) =>
                    handleInputChange(index, "arrival", e.target.value)
                  }
                />
              </FormControl>
              <FormControl id={`departure-${index}`} isRequired>
                <Input
                  type="datetime-local"
                  value={stop.departure}
                  onChange={(e) =>
                    handleInputChange(index, "departure", e.target.value)
                  }
                />
              </FormControl>
            </HStack>
          ))}
          <FormControl>
            <FormLabel>Trip</FormLabel>
            <Input
              type="text"
              placeholder="Trip title"
              onChange={(event) => setTrip(event.currentTarget.value)}
            />
          </FormControl>
          <Button onClick={addStop} colorScheme="blue">
            Add Another Stop
          </Button>
          <Button type="submit" colorScheme="teal">
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateStopsForm;
