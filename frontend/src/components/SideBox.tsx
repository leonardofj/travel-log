import { Box, List, ListItem } from "@chakra-ui/react";

const SideBox: React.FC<[string, string][]> = ({ items }) => {
  return (
    <Box bg={"#e6f1f7"} p={4} m={3} borderRadius={15} w={200}>
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
