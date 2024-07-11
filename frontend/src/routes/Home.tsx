import { Box, Flex, HStack, SimpleGrid } from "@chakra-ui/react";
import StatsBox from "../components/Stats";
import PlanCard from "../components/PlanCard";
import TripCard from "../components/TripCard";
import { plans, trips, stats } from "../data";
import HeaderWithButton from "../components/HeaderWithButton";

const Home = () => {
  return (
    <div className="Home">
      <Box p={4}>
        <Flex>
          <StatsBox
            countries={stats.countries}
            cities={stats.cities}
            trips={stats.trips}
            continents={stats.continents}
            total_duration={stats.total_duration}
          ></StatsBox>
          <Box mx={4} my={2}>
            <HeaderWithButton title={"Plans"} size={"lg"}></HeaderWithButton>
            <HStack spacing={4} py={3}>
              {plans.map((plan) => (
                <PlanCard
                  title={plan.title}
                  duration={plan.duration}
                  start={plan.start}
                  end={plan.end}
                  cities={plan.cities}
                ></PlanCard>
              ))}
            </HStack>
          </Box>
        </Flex>

        <HeaderWithButton title={"Trips"} size={"lg"}></HeaderWithButton>
        <SimpleGrid spacing={2} minChildWidth="300px">
          {trips.map((trip) => (
            <TripCard
              title={trip.title}
              duration={trip.duration}
              timeAgo={trip.time_ago}
              countries={trip.countries}
            ></TripCard>
          ))}
        </SimpleGrid>
      </Box>
    </div>
  );
};

export default Home;
