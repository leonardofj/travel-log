import {
  Text,
  Card,
  CardBody,
  Heading,
  Divider,
  Image,
  HStack,
} from "@chakra-ui/react";

interface TripCardProps {
  title: string;
  duration: number;
  timeAgo: number;
  countries: string[];
}

const TripCard = ({ title, duration, timeAgo, countries }: TripCardProps) => {
  return (
    <Card m={2}>
      <CardBody>
        <Heading size="md">{title}</Heading>
        <Divider my={1} />
        <Text>{duration} days</Text>
        <Text>{timeAgo} weeks ago</Text>
        <HStack spacing={2} float={"right"}>
          {countries.map((country) => (
            <Image
              borderRadius="full"
              boxSize="30px"
              src={`/assets/icons/flags/1x1/${country}.svg`}
            />
          ))}
        </HStack>
      </CardBody>
    </Card>
  );
};

export default TripCard;
