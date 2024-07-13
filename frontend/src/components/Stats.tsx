import { Badge, Box, Flex, List, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import fetchData from "../fetchData";

const StatsBox = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMyData = async () => {
      const result = await fetchData("stats");
      if (result.error) {
        console.log(result.error);
      } else {
        setData(result.data);
      }
    };

    fetchMyData();
  }, []);

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
              {data.trips}
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
              {data.total_duration}
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
              {data.countries}
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
              {data.cities}
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
              {data.continents}
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
