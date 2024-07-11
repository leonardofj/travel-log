import { Text, Card, CardBody, Heading, Divider } from "@chakra-ui/react";

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
        <Text align={"right"}>{countries.toString()}</Text>
      </CardBody>
    </Card>
  );
};

export default TripCard;
