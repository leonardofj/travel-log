import { DataTable } from "../components/DataTable";
import HeaderWithButton from "../components/HeaderWithButton";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import fetchData from "../fetchData";

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
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMyData = async () => {
      const result = await fetchData("cities");
      if (result.error) {
        console.log(result.error);
      } else {
        setData(result.data);
      }
    };

    fetchMyData();
  }, []);

  return (
    <div>
      <HeaderWithButton title={"Cities"}></HeaderWithButton>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Cities;
