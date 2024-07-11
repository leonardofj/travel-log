import { Box, Divider, Heading } from "@chakra-ui/react";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <Box m={4}>
      <Heading as={"h2"}>{title}</Heading>
      <Divider my={2} />
    </Box>
  );
};

export default Header;
