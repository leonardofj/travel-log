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
import { countries } from "../data";

const Countries = () => {
  return (
    <div>
      <Header title={"Countries"}></Header>

      <SimpleGrid spacing={2} minChildWidth="300px">
        {countries.map((country) => (
          <Link to={`${country.id}`}>
            <Card m={2}>
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
                    boxSize="40px"
                    src={`/assets/icons/flags/4x3/${country.iso_code}.svg`}
                  />
                </Flex>
                <Flex>
                  <Text>{country.continent}</Text>
                  <Spacer />
                  <Text>{country.id} visits</Text>
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
