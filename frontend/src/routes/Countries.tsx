import {
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchData from "../fetchData";

const Countries = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMyData = async () => {
      const result = await fetchData("countries");
      if (result.error) {
        console.log(result.error);
      } else {
        setData(result.data);
      }
    };

    fetchMyData();
  }, []);

  return (
    <div>
      <Header title={"Countries"}></Header>

      <SimpleGrid spacing={2} minChildWidth="300px">
        {data.map((country) => (
          <Link to={`${country.id}`}>
            <Card m={2} bg={"#e6f1f7"}>
              <Image
                style={{ width: "300px", height: "200px" }}
                objectFit="cover"
                src={`/assets/images/${country.iso_code}.jpg`}
              />
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
