import {
  Text,
  Flex,
  Image,
  Spacer,
  Box,
  ListItem,
  UnorderedList,
  HStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import fetchData from "../utils/fetchData";
import SideBox from "../components/SideBox";
import timeAgo from "../utils/timeAgo";

interface TripCity {
  name: string;
  country: string;
}

interface TripStop {
  id: number;
  city: string;
  country: string;
  country_iso: string;
  arrival: string;
}

interface Trip {
  id: number;
  title: string;
  start: string;
  end: string;
  duration: number;
  countries: string[];
  cities: TripCity[];
  stops: TripStop[];
}

const formatDate = (date: string | null) =>
  date ? format(new Date(date), "yyyy-MM-dd") : "—";

const STOP_MIN_WIDTH = 175;
const ROW_GAP = 56;
const ROW_EXIT_EXTEND = 72;
const ROW_ENTER_EXTEND = 40;
const CORNER_RADIUS = 30;

interface TimelineRow {
  stops: TripStop[];
  reversed: boolean;
  startIndex: number;
}

const divideEqually = (total: number, maxPerRow: number): number[] => {
  if (total === 0) return [];
  const rowCount = Math.ceil(total / maxPerRow);
  const base = Math.floor(total / rowCount);
  const extra = total % rowCount;
  return Array.from({ length: rowCount }, (_, i) => base + (i < extra ? 1 : 0));
};

const buildTimelineRows = (
  stops: TripStop[],
  maxPerRow: number,
): TimelineRow[] => {
  const sizes = divideEqually(stops.length, maxPerRow);
  const rows: TimelineRow[] = [];
  let offset = 0;

  sizes.forEach((size, rowIndex) => {
    const chunk = stops.slice(offset, offset + size);
    rows.push({
      stops: rowIndex % 2 === 1 ? [...chunk].reverse() : chunk,
      reversed: rowIndex % 2 === 1,
      startIndex: offset,
    });
    offset += size;
  });

  return rows;
};

const getDotCenter = (dot: HTMLDivElement, container: HTMLDivElement) => {
  const containerRect = container.getBoundingClientRect();
  const dotRect = dot.getBoundingClientRect();
  return {
    x: dotRect.left + dotRect.width / 2 - containerRect.left,
    y: dotRect.top + dotRect.height / 2 - containerRect.top,
  };
};

const buildSerpentinePath = (
  positions: { x: number; y: number }[],
  rows: TimelineRow[],
): string => {
  if (positions.length === 0) return "";
  if (positions.length === 1) {
    return `M ${positions[0].x} ${positions[0].y}`;
  }

  let path = `M ${positions[0].x} ${positions[0].y}`;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const rowPositions = positions.slice(
      row.startIndex,
      row.startIndex + row.stops.length,
    );

    for (let i = 1; i < rowPositions.length; i++) {
      path += ` L ${rowPositions[i].x} ${rowPositions[i].y}`;
    }

    if (rowIndex >= rows.length - 1) continue;

    const last = rowPositions[rowPositions.length - 1];
    const nextRow = rows[rowIndex + 1];
    const nextRowPositions = positions.slice(
      nextRow.startIndex,
      nextRow.startIndex + nextRow.stops.length,
    );
    const firstNext = nextRowPositions[0];

    const alongRow =
      rowPositions.length > 1
        ? Math.sign(
            rowPositions[rowPositions.length - 1].x -
              rowPositions[rowPositions.length - 2].x,
          )
        : 0;
    const towardNext = Math.sign(firstNext.x - last.x);
    const extendDir = alongRow || towardNext || (row.reversed ? -1 : 1);

    const nextAlongRow =
      nextRowPositions.length > 1
        ? Math.sign(nextRowPositions[1].x - nextRowPositions[0].x)
        : nextRow.reversed
          ? -1
          : 1;
    const enterX = firstNext.x - nextAlongRow * ROW_ENTER_EXTEND;

    const extendX = last.x + extendDir * ROW_EXIT_EXTEND;
    const dy = firstNext.y - last.y;
    const horizSpan = Math.abs(extendX - enterX);
    const radius = Math.min(CORNER_RADIUS, dy * 0.48, horizSpan);

    path += ` L ${extendX - extendDir * radius} ${last.y}`;
    if (extendDir > 0) {
      path += ` A ${radius} ${radius} 0 0 1 ${extendX} ${last.y + radius}`;
    } else {
      path += ` A ${radius} ${radius} 0 0 0 ${extendX} ${last.y + radius}`;
    }
    path += ` L ${extendX} ${firstNext.y - radius}`;

    const horizDir = Math.sign(enterX - extendX);
    if (horizDir > 0) {
      path += ` A ${radius} ${radius} 0 0 0 ${enterX} ${firstNext.y}`;
    } else if (horizDir < 0) {
      path += ` A ${radius} ${radius} 0 0 1 ${enterX} ${firstNext.y}`;
    } else {
      path += ` L ${extendX} ${firstNext.y}`;
    }

    path += ` L ${firstNext.x} ${firstNext.y}`;
  }

  return path;
};

const TimelineDot = () => (
  <Box
    w="12px"
    h="12px"
    borderRadius="full"
    bg="#3182ce"
    border="2px solid"
    borderColor="white"
    boxShadow="0 0 0 2px #3182ce"
    flexShrink={0}
    position="relative"
    zIndex={1}
  />
);

const StopsTimeline = ({ stops }: { stops: TripStop[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [maxPerRow, setMaxPerRow] = useState(4);
  const [path, setPath] = useState("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateMaxPerRow = () => {
      setMaxPerRow(Math.max(1, Math.floor(el.offsetWidth / STOP_MIN_WIDTH)));
    };

    updateMaxPerRow();
    const observer = new ResizeObserver(updateMaxPerRow);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(
    () => buildTimelineRows(stops, maxPerRow),
    [stops, maxPerRow],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || stops.length === 0) {
      setPath("");
      return;
    }

    const updatePath = () => {
      const positions = stops.map((_, index) => {
        const dot = dotRefs.current[index];
        return dot ? getDotCenter(dot, container) : null;
      });

      if (positions.some((point) => point === null)) {
        return;
      }

      setPath(
        buildSerpentinePath(positions as { x: number; y: number }[], rows),
      );
    };

    const frame = requestAnimationFrame(updatePath);
    const observer = new ResizeObserver(updatePath);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [stops, rows, maxPerRow]);

  return (
    <Box
      ref={containerRef}
      w="100%"
      px={8}
      pb={8}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      {path && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "visible",
          }}
        >
          <path
            d={path}
            stroke="#CBD5E0"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {rows.map((row, rowIndex) => (
        <Flex
          key={rowIndex}
          w="fit-content"
          align="flex-start"
          mb={rowIndex < rows.length - 1 ? `${ROW_GAP}px` : 0}
        >
          {row.stops.map((stop) => {
            const chronoIndex = stops.findIndex((s) => s.id === stop.id);
            return (
              <Box
                key={stop.id}
                w={`${STOP_MIN_WIDTH}px`}
                flexShrink={0}
                px={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Text
                  fontSize="sm"
                  color="gray.500"
                  mb={1}
                  noOfLines={1}
                  textAlign="center"
                  w="100%"
                >
                  {formatDate(stop.arrival)}
                </Text>
                <Flex justify="center" h="12px">
                  <Box
                    ref={(el) => {
                      dotRefs.current[chronoIndex] = el;
                    }}
                  >
                    <TimelineDot />
                  </Box>
                </Flex>
                <HStack spacing={2} mt={2} justify="center" align="flex-start">
                  <Image
                    height="18px"
                    flexShrink={0}
                    src={`/assets/icons/flags/4x3/${stop.country_iso}.svg`}
                  />
                  <Text
                    fontWeight="medium"
                    fontSize="sm"
                    lineHeight="short"
                    textAlign="center"
                  >
                    {stop.city}
                  </Text>
                </HStack>
              </Box>
            );
          })}
        </Flex>
      ))}
    </Box>
  );
};

const TripDetail = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const result = await fetchData<Trip>("trips/" + id);
        if (result.error) {
          console.log(result.error);
        } else {
          setTrip(result.data);
        }
      } catch {
        console.log("An unexpected error occurred while fetching data");
      }
    };

    fetchTrip();
  }, [id]);

  if (!trip) {
    return (
      <div>
        <Header title="Trip" />
        <Box p={4}>
          <Text>Loading...</Text>
        </Box>
      </div>
    );
  }

  return (
    <div>
      <Header title={trip.title}>
        <HStack spacing={2} ms={6}>
          {trip.countries.map((iso) => (
            <Image
              key={iso}
              height="30px"
              borderRadius="full"
              border="1px solid"
              borderColor="gray"
              src={`/assets/icons/flags/1x1/${iso}.svg`}
            />
          ))}
        </HStack>
        <Spacer />
        <Text fontSize="lg" fontWeight="bold" me={4}>
          {timeAgo(trip.end)}
        </Text>
      </Header>
      <Flex>
        <SideBox
          items={[
            ["Duration", `${trip.duration} days`],
            ["Start", formatDate(trip.start)],
            ["End", formatDate(trip.end)],
            ["Countries", String(trip.countries.length)],
            ["Cities", String(trip.cities.length)],
            ["Stops", String(trip.stops.length)],
          ]}
        />
        <Box mx={4} my={2} flex={1}>
          <Header title="Cities" />
          <UnorderedList>
            <HStack spacing={6} flexWrap="wrap" alignItems="flex-start">
              {trip.cities.map((city) => (
                <ListItem key={`${city.name}-${city.country}`}>
                  {city.name}, {city.country}
                </ListItem>
              ))}
            </HStack>
          </UnorderedList>
        </Box>
      </Flex>
      <Header title="Stops" />
      <StopsTimeline stops={trip.stops} />
    </div>
  );
};

export default TripDetail;
