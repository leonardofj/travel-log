import { Text, Card, CardBody, Heading, Divider } from "@chakra-ui/react";

interface PlanCardProps {
  title: string;
  duration: number;
  start: string;
  end: string;
  cities: string[];
}

const PlanCard = ({ title, duration, start, end, cities }: PlanCardProps) => {
  return (
    <Card h={"100%"}>
      <CardBody>
        <Heading size="md">{title}</Heading>
        <Divider my={1} />
        <Text>{duration} days</Text>
        <Text>
          {start} - {end}{" "}
        </Text>
        <Text>{cities.join(", ")}</Text>
      </CardBody>
    </Card>
  );
};

export default PlanCard;
