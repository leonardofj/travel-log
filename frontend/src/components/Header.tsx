import { Box, Divider, Flex, Heading } from "@chakra-ui/react";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header = ({ title, children }: HeaderProps) => {
  return (
    <Box m={4}>
      <Flex>
        <Heading as={"h2"}>{title}</Heading>
        {children}
      </Flex>
      <Divider my={2} />
    </Box>
  );
};

export default Header;
