import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

interface CreatePlanFormProps {
  onClose: () => void;
}

const CreatePlanForm = ({ onClose }: CreatePlanFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (event) => {
    // console.log(api);
    event.preventDefault();
    console.log(`password: ${password} & event: ${email}`);
    onClose();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="test@test.com"
            size="lg"
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired mt={6}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="*******"
            size="lg"
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </FormControl>
        {/* <Divider mb={3} mt={5} /> */}
        <Button colorScheme="blue" mt={5} mb={3} onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreatePlanForm;
