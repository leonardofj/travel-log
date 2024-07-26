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

interface CreatePlanFormProps {
  onClose: () => void;
}

const CreatePlanForm = ({ onClose }: CreatePlanFormProps) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedTags, setSelectedTags] = useState("");
  const [selectedCities, setSelectedCities] = useState("");
  const [tags, setTags] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resultCities, resultTags] = await Promise.all([
          fetchData("cities"),
          fetchData("tags"),
        ]);

        if (resultCities.error || resultTags.error) {
          console.log((resultCities.error || "") + (resultTags.error || ""));
        } else {
          setCities(resultCities.data);
          setTags(resultTags.data);
        }
      } catch (err) {
        console.log("An unexpected error occurred while fetching data");
      }
    };

    fetchAllData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await saveData<object>({
        path: "plans",
        data: { title: title, start: start, end: end },
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
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            placeholder="Title"
            size="lg"
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired mt={6}>
          <FormLabel>Start</FormLabel>
          <Input
            type="date"
            placeholder="Select date"
            size="lg"
            onChange={(event) => setStart(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired mt={6}>
          <FormLabel>End</FormLabel>
          <Input
            type="date"
            placeholder="Select date"
            size="lg"
            onChange={(event) => setEnd(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl mt={6}>
          <FormLabel>Tags</FormLabel>
          <Select
            placeholder="Select tags"
            multiple={true}
            onChange={(event) => setSelectedTags(event.currentTarget.value)}
            value={selectedTags}
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mt={6}>
          <FormLabel>Cities</FormLabel>
          <Select
            placeholder="Select cities"
            multiple={true}
            onChange={(event) => setSelectedCities(event.currentTarget.value)}
            value={selectedCities}
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}, {city.country}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button colorScheme="blue" mt={5} mb={3} onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreatePlanForm;
