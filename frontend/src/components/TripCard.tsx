import {
  Text,
  Card,
  CardBody,
  Heading,
  Divider,
  Image,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import timeAgo from "../utils/timeAgo";

interface TripCardProps {
  id: number;
  title: string;
  duration: number;
  date: string | Date;
  countries: string[];
}

const TripCard = ({ id, title, duration, date, countries }: TripCardProps) => {
  return (
    <Link to={`/trips/${id}`}>
      <Card m={2}>
        <CardBody>
          <Heading size="md">{title}</Heading>
          <Divider my={1} />
          <Text>{duration} days</Text>
          <Text>{timeAgo(date)}</Text>
          <HStack spacing={2} float={"right"}>
            {countries.map((country) => (
              <Image
                borderRadius="full"
                border="1px solid"
                borderColor="gray"
                boxSize="30px"
                src={`/assets/icons/flags/1x1/${country}.svg`}
              />
            ))}
          </HStack>
        </CardBody>
      </Card>
    </Link>
  );
};

export default TripCard;
