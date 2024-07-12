import { DataTable } from "../components/DataTable";
import HeaderWithButton from "../components/HeaderWithButton";
import { createColumnHelper } from "@tanstack/react-table";
import { cities } from "../data";

export type CityTable = {
  id: number;
  name: string;
  visited: number;
  country_id: number;
  lat: number;
  lon: number;
  state: string;
};

const data: CityTable[] = cities;

const columnHelper = createColumnHelper<CityTable>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "City",
  }),
  columnHelper.accessor("country_id", {
    cell: (info) => info.getValue(),
    header: "Country ID",
  }),
  columnHelper.accessor("state", {
    cell: (info) => info.getValue(),
    header: "State",
    meta: {
      isNumeric: true,
    },
  }),
];

const Cities = () => {
  return (
    <div>
      <HeaderWithButton title={"Cities"}></HeaderWithButton>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Cities;
