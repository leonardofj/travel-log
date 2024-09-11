import { Badge, Box, Flex, List, ListItem, Text } from "@chakra-ui/react";

const SideBox: React.FC<[string, string][]> = ({ items }) => {
  return (
    <Box bg={"#E0E0E0"} p={4} m={3} borderRadius={15} w={200}>
      <List spacing={3}>
        {items.map((item, index) => (
          <ListItem key={index}>
            <strong>{item[0]}: </strong> {item[1]}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideBox;
