import { DataTable } from "../components/DataTable";
import HeaderWithButton from "../components/HeaderWithButton";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import fetchData from "../fetchData";
import ModalForm from "../components/ModalForm";
import CreateCityForm from "../components/CreateCityForm";
import { useDisclosure } from "@chakra-ui/react";

export type CityTable = {
  id: number;
  name: string;
  visits: number;
  country: string;
  last_visit: string;
};

const columnHelper = createColumnHelper<CityTable>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "City",
  }),
  columnHelper.accessor("country", {
    cell: (info) => info.getValue(),
    header: "Country",
  }),
  columnHelper.accessor("visits", {
    cell: (info) => info.getValue(),
    header: "Visits",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("last_visit", {
    cell: (info) => info.getValue(),
    header: "Last visit",
  }),
];

const Cities = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const {
    isOpen: isCityModalOpen,
    onOpen: onCityModalOpen,
    onClose: onCityModalClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resultCities, resultCountries] = await Promise.all([
          fetchData("cities"),
          fetchData("countries"),
        ]);

        if (resultCities.error || resultCountries.error) {
          console.log(
            (resultCities.error || "") + (resultCountries.error || "")
          );
        } else {
          setCitiesData(resultCities.data);
          setCountriesData(resultCountries.data);
        }
      } catch (err) {
        console.log("An unexpected error occurred while fetching data");
      }
    };

    fetchAllData();
  }, []);

  return (
    <div>
      <HeaderWithButton
        title={"Cities"}
        onOpen={onCityModalOpen}
      ></HeaderWithButton>
      <ModalForm
        isOpen={isCityModalOpen}
        onClose={onCityModalClose}
        title="Add new city"
      >
        <CreateCityForm onClose={onCityModalClose} countries={countriesData} />
      </ModalForm>
      <DataTable columns={columns} data={citiesData} />
    </div>
  );
};

export default Cities;
