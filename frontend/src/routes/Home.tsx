import { Box, Flex, HStack, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import StatsBox from "../components/Stats";
import PlanCard from "../components/PlanCard";
import TripCard from "../components/TripCard";
import HeaderWithButton from "../components/HeaderWithButton";
import { useEffect, useState } from "react";
import fetchData from "../fetchData";
import ModalForm from "../components/ModalForm";
import CreatePlanForm from "../components/CreatePlanForm";

const Home = () => {
  const [tripsData, setTripsData] = useState([]);
  const [plansData, setPlansData] = useState([]);
  const {
    isOpen: isPlanModalOpen,
    onOpen: onPlanModalOpen,
    onClose: onPlanModalClose,
  } = useDisclosure();

  const {
    isOpen: isTripModalOpen,
    onOpen: onTripModalOpen,
    onClose: onTripModalClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resultTrips, resultPlans] = await Promise.all([
          fetchData("trips"),
          fetchData("plans"),
        ]);

        if (resultTrips.error || resultPlans.error) {
          console.log((resultTrips.error || "") + (resultPlans.error || ""));
        } else {
          setTripsData(resultTrips.data);
          setPlansData(resultPlans.data);
        }
      } catch (err) {
        console.log("An unexpected error occurred while fetching data");
      }
    };

    fetchAllData();
  }, []);
  return (
    <div className="Home">
      <Box p={4}>
        <ModalForm
          isOpen={isPlanModalOpen}
          onClose={onPlanModalClose}
          title="Create new plan"
        >
          <CreatePlanForm onClose={onPlanModalClose} />
        </ModalForm>
        <ModalForm
          isOpen={isTripModalOpen}
          onClose={onTripModalClose}
          title="Add new trip"
        >
          <CreatePlanForm onClose={onTripModalClose} />
        </ModalForm>

        <Flex>
          <StatsBox></StatsBox>
          <Box mx={4} my={2}>
            <HeaderWithButton
              title={"Plans"}
              size={"lg"}
              onOpen={onPlanModalOpen}
            ></HeaderWithButton>
            <HStack spacing={4} py={3}>
              {plansData.map((plan) => (
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

        <HeaderWithButton
          title={"Trips"}
          size={"lg"}
          onOpen={onTripModalOpen}
        ></HeaderWithButton>
        <SimpleGrid spacing={2} minChildWidth="300px">
          {tripsData.map((trip) => (
            <TripCard
              title={trip.title}
              duration={trip.duration}
              timeAgo={trip.end}
              countries={trip.countries}
            ></TripCard>
          ))}
        </SimpleGrid>
      </Box>
    </div>
  );
};

export default Home;
