import { Box, Flex, Heading, HStack, SimpleGrid } from "@chakra-ui/react";
import StatsBox from "../components/Stats";
import PlanCard from "../components/PlanCard";
import TripCard from "../components/TripCard";
import { plans, trips, stats } from "../data";

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
            <Heading size={"lg"}>Plans</Heading>
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
        <Heading size={"lg"} mx={2}>
          Trips
        </Heading>
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
