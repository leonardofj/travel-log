import { Text, Flex, Image, Spacer, Heading } from "@chakra-ui/react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchData from "../fetchData";
import SideBox from "../components/SideBox";

const CountryDetail = () => {
  const { id } = useParams();
  const [country, setCountry] = useState({});

  useEffect(() => {
    const fetchMyData = async () => {
      const result = await fetchData("countries/" + id);
      if (result.error) {
        console.log(result.error);
      } else {
        setCountry(result.data);
      }
    };

    fetchMyData();
  }, []);

  return (
    <div>
      <Header title={country.name}>
        <Image
          boxSize="50px"
          ms={50}
          src={`/assets/icons/flags/4x3/${country.iso_code}.svg`}
        />
        <Spacer />
        <Text fontSize="26" fontWeight={"bold"} me={4}>
          {country.continent}
        </Text>
      </Header>
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
    </div>
  );
};

export default CountryDetail;
