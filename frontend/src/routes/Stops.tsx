import { createColumnHelper } from "@tanstack/react-table";
import HeaderWithButton from "../components/HeaderWithButton";
import { useEffect, useState } from "react";
import fetchData from "../utils/fetchData";
import { useDisclosure } from "@chakra-ui/react";
import ModalForm from "../components/ModalForm";
import { DataTable } from "../components/DataTable";
import CreateStopsForm from "../components/CreateStopsForm";

export type StopTable = {
  id: number;
  city: string;
  country: string;
  arrival: string;
  departure: string;
  trip?: string;
};

const columnHelper = createColumnHelper<StopTable>();

const columns = [
  columnHelper.accessor((row) => `${row.city}, ${row.country}`, {
    id: "location",
    cell: (info) => info.getValue(),
    header: "Location",
  }),
  columnHelper.accessor("arrival", {
    cell: (info) => info.getValue(),
    header: "Arrival",
  }),
  columnHelper.accessor("departure", {
    cell: (info) => info.getValue(),
    header: "Departure",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("trip", {
    cell: (info) => info.getValue(),
    header: "Trip",
  }),
];

const Stops = () => {
  const [stopsData, setStopsData] = useState([]);
  const {
    isOpen: isStopModalOpen,
    onOpen: onStopModalOpen,
    onClose: onStopModalClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const resultStops = await fetchData("stops");
        if (resultStops.error) {
          console.log(resultStops.error);
        } else {
          setStopsData(resultStops.data);
        }
      } catch (err) {
        console.log("An unexpected error occurred while fetching data");
      }
    };

    fetchStops();
  }, []);

  return (
    <div>
      <HeaderWithButton
        title={"Stops"}
        onOpen={onStopModalOpen}
      ></HeaderWithButton>
      <ModalForm
        isOpen={isStopModalOpen}
        onClose={onStopModalClose}
        title="Add stops"
        size="4xl"
      >
        <CreateStopsForm onClose={onStopModalClose} />
      </ModalForm>
      <DataTable columns={columns} data={stopsData} />
    </div>
  );
};

export default Stops;
