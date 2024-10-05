import {
  Text,
  Flex,
  Image,
  Spacer,
  SimpleGrid,
  Box,
  ListItem,
  UnorderedList,
  HStack,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchData from "../utils/fetchData";
import SideBox from "../components/SideBox";
import TripCard from "../components/TripCard";

const CountryDetail = () => {
  const { id } = useParams();
  const [country, setCountry] = useState({});
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resultTrips, resultCountry, resultCities] = await Promise.all([
          fetchData("trips/?country=" + id),
          fetchData("countries/" + id),
          fetchData("cities/?country=" + id),
        ]);

        if (resultTrips.error || resultCountry.error || resultCities.error) {
          console.log(
            (resultTrips.error || "") +
              (resultCountry.error || "") +
              (resultCities.error || "")
          );
        } else {
          setTrips(resultTrips.data);
          setCountry(resultCountry.data);
          setCities(resultCities.data);
        }
      } catch (err) {
        console.log("An unexpected error occurred while fetching data");
      }
    };

    fetchAllData();
  }, []);

  return (
    <div>
      <Header title={country.name}>
        <Image
          height="40px"
          border="1px solid"
          borderColor="gray"
          ms={50}
          src={`/assets/icons/flags/4x3/${country.iso_code}.svg`}
        />
        <Spacer />
        <Text fontSize="26" fontWeight={"bold"} me={4}>
          {country.continent}
        </Text>
      </Header>
      <Flex>
        <SideBox
          items={[
            ["Capital", country.capital],
            ["Currency", country.currency],
            ["Language", country.language],
            [
              "Visa",
              country.visa_detail
                ? country.visa_detail
                : country.need_visa
                ? "yes"
                : "no",
            ],
          ]}
        ></SideBox>
        <Box mx={4} my={2}>
          <Header title={"Visited cities"}></Header>
          <UnorderedList>
            <HStack spacing={6}>
              {cities.map((city) => (
                <ListItem>{city.name}</ListItem>
              ))}
            </HStack>
          </UnorderedList>
        </Box>
      </Flex>
      <Header title={"Trips"}></Header>
      <SimpleGrid spacing={2} minChildWidth="300px">
        {trips.map((trip) => (
          <TripCard
            id={trip.id}
            title={trip.title}
            duration={trip.duration}
            date={trip.end}
            countries={trip.countries}
          ></TripCard>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default CountryDetail;
