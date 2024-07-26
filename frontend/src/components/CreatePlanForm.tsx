import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { saveData } from "../saveData";
import fetchData from "../fetchData";
import MultiSelect from "./MultiSelect";
import { MultiSelectOption } from "./interfaces";

interface CreatePlanFormProps {
  onClose: () => void;
}

const CreatePlanForm = ({ onClose }: CreatePlanFormProps) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
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
        data: {
          title: title,
          start: start,
          end: end,
          tags: selectedTags,
          cities: selectedCities,
        },
      });
      console.log(res.data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const optionsTags: MultiSelectOption[] = tags.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const optionsCities: MultiSelectOption[] = cities.map((item) => ({
    label: `${item.name}, ${item.country}`,
    value: item.id,
  }));

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
        <MultiSelect
          mt={6}
          label="Tags"
          options={optionsTags}
          placeholder="tags"
          selectedOptions={selectedTags}
          setSelectedOptions={setSelectedTags}
        />
        <MultiSelect
          mt={6}
          label="Cities"
          options={optionsCities}
          placeholder="cities"
          selectedOptions={selectedCities}
          setSelectedOptions={setSelectedCities}
        />

        <Button colorScheme="blue" mt={5} mb={3} onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreatePlanForm;
