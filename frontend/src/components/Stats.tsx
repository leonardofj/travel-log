import { Badge, Box, Flex, List, ListItem, Text } from "@chakra-ui/react";

interface StatsProps {
  countries: number;
  cities: number;
  trips: number;
  continents: number;
  total_duration: number;
}

const StatsBox = ({
  countries,
  cities,
  trips,
  continents,
  total_duration,
}: StatsProps) => {
  return (
    <Box bg={"#E0E0E0"} p={4} my={3} borderRadius={15}>
      <List spacing={3}>
        <ListItem>
          <Flex>
            <Badge
              bg={"#1D3344"}
              color={"white"}
              fontSize="1.2em"
              borderRadius={15}
              px={2}
            >
              {trips}
            </Badge>
            <Text fontSize="1.2em" fontWeight={"bold"} mx={1}>
              trips
            </Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex>
            <Badge
              bg={"#1D3344"}
              color={"white"}
              fontSize="1.2em"
              borderRadius={15}
              px={2}
            >
              {total_duration}
            </Badge>
            <Text fontSize="1.2em" fontWeight={"bold"} mx={1}>
              days traveling
            </Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex>
            <Badge
              bg={"#1D3344"}
              color={"white"}
              fontSize="1.2em"
              borderRadius={15}
              px={2}
            >
              {countries}
            </Badge>
            <Text fontSize="1.2em" fontWeight={"bold"} mx={1}>
              countries
            </Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex>
            <Badge
              bg={"#1D3344"}
              color={"white"}
              fontSize="1.2em"
              borderRadius={15}
              px={2}
            >
              {cities}
            </Badge>
            <Text fontSize="1.2em" fontWeight={"bold"} mx={1}>
              cities
            </Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex>
            <Badge
              bg={"#1D3344"}
              color={"white"}
              fontSize="1.2em"
              borderRadius={15}
              px={2}
            >
              {continents}
            </Badge>
            <Text fontSize="1.2em" fontWeight={"bold"} mx={1}>
              continents
            </Text>
          </Flex>
        </ListItem>
      </List>
    </Box>
  );
};

export default StatsBox;
