import {
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Spacer,
  Switch,
  Text,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchData from "../fetchData";

const Countries = () => {
  const [data, setData] = useState([]);
  const [visited, setVisited] = useState(true);

  const handleVisited = () => {
    setVisited(!visited);
  };

  useEffect(() => {
    const fetchMyData = async () => {
      const query = "countries/?visited=" + visited;
      const result = await fetchData(query);
      if (result.error) {
        console.log(result.error);
      } else {
        setData(result.data);
      }
    };

    fetchMyData();
  }, [visited]);

  return (
    <div>
      <Header title={"Countries"}>
        <Spacer />
        <HStack spacing={2}>
          <Text>Visited</Text>
          <Switch isChecked={visited} onChange={handleVisited} />
        </HStack>
      </Header>

      <SimpleGrid spacing={2} minChildWidth="300px">
        {data.map((country) => (
          <Link to={`${country.id}`}>
            <Card m={2} bg={"#e6f1f7"}>
              {visited ? (
                <Image
                  style={{ width: "300px", height: "200px" }}
                  objectFit="cover"
                  src={`/assets/images/${country.iso_code}.jpg`}
                />
              ) : (
                ""
              )}
              <CardBody>
                <Flex>
                  <Heading size="md">{country.name}</Heading>
                  <Spacer />
                  <Image
                    height="30px"
                    border="1px solid"
                    borderColor="gray"
                    src={`/assets/icons/flags/4x3/${country.iso_code}.svg`}
                  />
                </Flex>
                <Flex>
                  <Text>{country.continent}</Text>
                  <Spacer />
                  <Text>
                    {country.visits} trip{country.visits !== 1 ? "s" : ""}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default Countries;
