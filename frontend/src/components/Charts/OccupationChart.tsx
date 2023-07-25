import { Person } from "@/model/person";
import { getOccupationColors } from "@/utils/colors";
import { DivProps } from "@/utils/defaultInterfaces";
import Chart from "@/components/Charts/Chart";
import { Occupation, OccupationSchema } from "@/model/occupation";
import InfoCard from "./InfoCard/InfoCard";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import { capitalize } from "@/utils/utils";

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
}

export default function OccupationChart({
  people,
  selectedPerson,
  ...rest
}: Props) {
  const baseCount = Object.values(OccupationSchema.Enum).map((occupation) => ({
    name: occupation,
    count: 0,
  }));

  const occupationCount = people.reduce(
    (acc: { name: Occupation; count: number }[], person) => {
      const occupation = person.occupation!;
      const index = acc.findIndex((item) => item.name === occupation);
      acc[index].count++;
      return acc;
    },
    baseCount
  );

  occupationCount.sort((a, b) => b.count - a.count);

  return (
    <Chart
      people={people}
      selectedPerson={selectedPerson}
      title={"OCCUPATION DISTRIBUTION"}
      label="Number of people"
      entityEnum={OccupationSchema.Enum}
      colors={getOccupationColors()}
      chartType="bar"
      attribute="occupation"
      dimmable
      direction="horizontal"
      {...rest}
    >
      <InfoCard
        title="MOST POPULAR"
        icon={<TrendingUpRoundedIcon />}
        mainValue={capitalize(occupationCount[0].name)}
      />

      <InfoCard
        title="LEAST POPULAR"
        icon={<TrendingDownRoundedIcon />}
        mainValue={capitalize(occupationCount[occupationCount.length - 1].name)}
      />
    </Chart>
  );
}
