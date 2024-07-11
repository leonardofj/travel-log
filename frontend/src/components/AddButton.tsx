import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

const AddButton = () => {
  return (
    <Button
      variant={"solid"}
      bg={"#FFBA08"}
      size={"sm"}
      color={"#660000"}
      mr={4}
      leftIcon={<AddIcon />}
      _hover={{ bg: "#660000", color: "#FFBA08" }}
    >
      Add new
    </Button>
  );
};

export default AddButton;
