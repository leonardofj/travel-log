import { Box, Divider, Heading, HStack } from "@chakra-ui/react";
import AddButton from "./AddButton";

interface HeaderWithButtonProps {
  title: string;
  size?: string;
  onOpen: () => void;
}

const HeaderWithButton = ({
  title,
  size = "xl",
  onOpen,
}: HeaderWithButtonProps) => {
  return (
    <Box m={4}>
      <HStack spacing="15px">
        <Heading size={size}>{title}</Heading>
        <AddButton onOpen={onOpen} />
      </HStack>
      <Divider my={2} />
    </Box>
  );
};

export default HeaderWithButton;
