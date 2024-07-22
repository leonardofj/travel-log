import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

interface AddButtonProps {
  onOpen: () => void;
}

const AddButton = ({ onOpen }: AddButtonProps) => {
  return (
    <Button
      variant={"solid"}
      bg={"#FFBA08"}
      size={"sm"}
      color={"#660000"}
      mr={4}
      leftIcon={<AddIcon />}
      _hover={{ bg: "#660000", color: "#FFBA08" }}
      onClick={onOpen}
    >
      Add new
    </Button>
  );
};

export default AddButton;
